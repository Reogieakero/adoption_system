import { AppError } from '../errors/AppError';
import { adoptionRepository } from '../repositories/adoption.repository';
import { AdoptionApplication, ApplicationDetails, StatusType } from '../types/adoption.types';
import { rowToAdoptionApplication, rowToApplicationDetails } from '../utils/adoptionMapper';

const VALID_STATUSES: StatusType[] = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Adopted'];

export const adoptionService = {
  async listApplications(): Promise<AdoptionApplication[]> {
    const rows = await adoptionRepository.findAll();
    return rows.map(rowToAdoptionApplication);
  },

  async getApplicationDetails(id: string): Promise<ApplicationDetails> {
    const row = await adoptionRepository.findDetailsById(id);
    if (!row) {
      throw new AppError(404, 'Adoption application not found');
    }
    return rowToApplicationDetails(row);
  },

  async updateStatus(id: string, status: StatusType): Promise<AdoptionApplication> {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid status "${status}"`);
    }

    const exists = await adoptionRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Adoption application not found');
    }

    await adoptionRepository.updateStatus(id, status);

    const rows = await adoptionRepository.findAll();
    const updated = rows.find((r) => r.id === id);
    if (!updated) {
      throw new AppError(404, 'Adoption application not found after update');
    }
    return rowToAdoptionApplication(updated);
  },
};