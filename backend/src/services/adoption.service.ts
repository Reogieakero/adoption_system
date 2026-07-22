import { AppError } from '../errors/AppError';
import { adoptionRepository } from '../repositories/adoption.repository';
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
