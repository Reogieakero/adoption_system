import { AppError } from '../errors/AppError';
import { healthRepository } from '../repositories/health.repository';
import { HealthRecordWithPet, UpdateHealthRecordInput } from '../types/health.types';
import { rowToHealthRecord } from '../utils/healthMapper';

export const healthService = {
  async listHealthRecords(): Promise<HealthRecordWithPet[]> {
    const rows = await healthRepository.findAll();
    return rows.map(rowToHealthRecord);
  },

  async getHealthByPetId(petId: number): Promise<HealthRecordWithPet> {
    const row = await healthRepository.findByPetId(petId);
    if (!row) {
      throw new AppError(404, 'Health record not found for this pet');
    }
    return rowToHealthRecord(row);
  },

  async upsertHealthRecord(
    petId: number,
    medicalHistory: string | null,
    vaccinationStatus: string | null,
    heartRateBpm: number | null,
    createdByUserId: number
  ): Promise<HealthRecordWithPet> {
    const petExists = await healthRepository.petExists(petId);
    if (!petExists) {
      throw new AppError(404, 'Pet not found');
    }

    await healthRepository.upsert(petId, medicalHistory, vaccinationStatus, heartRateBpm, createdByUserId);
    return this.getHealthByPetId(petId);
  },

  async updateHealthRecord(petId: number, input: UpdateHealthRecordInput): Promise<HealthRecordWithPet> {
    const petExists = await healthRepository.petExists(petId);
    if (!petExists) {
      throw new AppError(404, 'Pet not found');
    }

    const recordExists = await healthRepository.exists(petId);
    if (!recordExists) {
      throw new AppError(404, 'Health record not found for this pet');
    }

    const updated = await healthRepository.update(petId, input);
    if (!updated) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    return this.getHealthByPetId(petId);
  },
};
