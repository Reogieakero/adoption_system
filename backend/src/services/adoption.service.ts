import { AppError } from '../errors/AppError';
import { adoptionRepository } from '../repositories/adoption.repository';
import { notificationService } from './notification.service';
import { AdoptionApplicationWithDetails, AdoptionStatus, UpdateApplicationStatusInput } from '../types/adoption.types';
import { rowToAdoptionApplication } from '../utils/adoptionMapper';

const VALID_STATUSES: AdoptionStatus[] = ['pending_review', 'approved', 'rejected', 'pet_unavailable'];

export const adoptionService = {
  async listApplications(): Promise<AdoptionApplicationWithDetails[]> {
    const rows = await adoptionRepository.findAll();
    return rows.map(rowToAdoptionApplication);
  },

  async getApplicationDetails(id: number): Promise<AdoptionApplicationWithDetails> {
    const row = await adoptionRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Adoption application not found');
    }
    return rowToAdoptionApplication(row);
  },

  async updateStatus(id: number, status: AdoptionStatus, rejectionReason?: string | null): Promise<AdoptionApplicationWithDetails> {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid status "${status}"`);
    }

    const application = await adoptionRepository.findById(id);
    if (!application) {
      throw new AppError(404, 'Adoption application not found');
    }

    await adoptionRepository.updateStatus(id, status, 1, rejectionReason ?? null);

    // Notify the resident about the adoption status change
    await notificationService.create({
      recipient_id: application.resident_id,
      type: 'adoption_status',
      linked_type: 'adoption_application',
      linked_id: id,
      message_text: `Your adoption application for "${application.pet_name}" has been ${status === 'approved' ? 'approved' : status === 'rejected' ? 'reviewed' : 'updated'}.`,
    });

    // Business rule: when one application is approved, set all other
    // pending_review applications for the same pet to pet_unavailable
    if (status === 'approved') {
      const pendingApps = await adoptionRepository.findPendingByPetId(application.pet_id);
      for (const pending of pendingApps) {
        if (pending.application_id !== id) {
          await adoptionRepository.updateStatus(
            pending.application_id,
            'pet_unavailable',
            1,
            'Another application was approved for this pet.'
          );
          await notificationService.create({
            recipient_id: pending.resident_id,
            type: 'adoption_status',
            linked_type: 'adoption_application',
            linked_id: pending.application_id,
            message_text: `Your adoption application for "${pending.pet_name}" is no longer available — another application was approved.`,
          });
        }
      }

      await adoptionRepository.updatePetStatus(application.pet_id, 'pending');
    }

    // When the admin marks the animal as released, update the pet to adopted
    if (status === 'pet_unavailable') {
      await adoptionRepository.updatePetStatus(application.pet_id, 'adopted');
    }

    const updated = await adoptionRepository.findById(id);
    if (!updated) {
      throw new AppError(404, 'Adoption application not found after update');
    }
    return rowToAdoptionApplication(updated);
  },
};
