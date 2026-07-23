import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import { AppError } from '../errors/AppError';
import { adoptionRepository } from '../repositories/adoption.repository';
import { notificationService } from './notification.service';
import { logService } from './log.service';
import { AdoptionApplicationWithDetails, AdoptionStatus, UpdateApplicationStatusInput } from '../types/adoption.types';
import { rowToAdoptionApplication } from '../utils/adoptionMapper';

const VALID_STATUSES: AdoptionStatus[] = ['pending_review', 'approved', 'rejected', 'pet_unavailable'];

export const adoptionService = {
  async listApplications(): Promise<AdoptionApplicationWithDetails[]> {
    const rows = await adoptionRepository.findAll();
    return rows.map(rowToAdoptionApplication);
  },

  async getMyApplications(residentId: number): Promise<AdoptionApplicationWithDetails[]> {
    const rows = await adoptionRepository.findByResidentId(residentId);
    return rows.map(rowToAdoptionApplication);
  },

  async createApplication(input: { pet_id: number; resident_id: number; reason_for_adopting?: string | null; living_situation?: string | null; has_other_pets?: boolean | null; household_members_count?: number | null; additional_notes?: string | null }): Promise<AdoptionApplicationWithDetails> {
    const pet = await pool.query<RowDataPacket[]>('SELECT pet_id, name, status FROM pets WHERE pet_id = ?', [input.pet_id]);
    if (!pet[0][0]) {
      throw new AppError(404, 'Pet not found');
    }
    if (pet[0][0].status !== 'available') {
      throw new AppError(400, 'This pet is not available for adoption');
    }

    const existing = await adoptionRepository.findByResidentId(input.resident_id);
    const alreadyApplied = existing.find((a) => a.pet_id === input.pet_id && a.status === 'pending_review');
    if (alreadyApplied) {
      throw new AppError(409, 'You already have a pending application for this pet');
    }

    const applicationId = await adoptionRepository.create(input);

    await logService.logAction({
      userId: input.resident_id,
      action: 'Created',
      entityType: 'Adoption',
      entityId: applicationId,
      description: `Adoption application submitted for pet #${input.pet_id}`,
    });

    await notificationService.create({
      recipient_id: input.resident_id,
      type: 'adoption_status',
      linked_type: 'adoption_application',
      linked_id: applicationId,
      message_text: `Your adoption application for "${pet[0][0].name}" has been submitted and is pending review.`,
    });

    return this.getApplicationDetails(applicationId);
  },

  async getApplicationDetails(id: number): Promise<AdoptionApplicationWithDetails> {
    const row = await adoptionRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Adoption application not found');
    }
    return rowToAdoptionApplication(row);
  },

  async updateStatus(id: number, status: AdoptionStatus, adminId: number, rejectionReason?: string | null): Promise<AdoptionApplicationWithDetails> {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid status "${status}"`);
    }

    const application = await adoptionRepository.findById(id);
    if (!application) {
      throw new AppError(404, 'Adoption application not found');
    }

    await adoptionRepository.updateStatus(id, status, adminId, rejectionReason ?? null);
    await logService.logAction({
      userId: adminId,
      action: 'Updated Status',
      entityType: 'Adoption',
      entityId: id,
      description: `Adoption application #${id} status changed to "${status}" for pet "${application.pet_name}"`,
    });

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
