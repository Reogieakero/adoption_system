import { AppError } from '../errors/AppError';
import { healthRepository } from '../repositories/health.repository';
import { AnimalHealth, CreateHealthHistoryInput, UpdateVitalsInput } from '../types/health.types';
import { rowToAnimalHealth, rowToHistoryEntry } from '../utils/healthMapper';

const VALID_HEALTH_STATUSES = ['Healthy', 'Under Treatment', 'Recovering', 'Critical'];
const VALID_VACCINATION_STATUSES = [
  'Vaccinated',
  'Not Fully Vaccinated',
  'Due',
  'Not Vaccinated',
];

function validateHistoryInput(input: CreateHealthHistoryInput): void {
  if (!input.date || !input.event || !input.notes) {
    throw new AppError(400, 'Fields "date", "event", and "notes" are all required');
  }
  if (Number.isNaN(Date.parse(input.date))) {
    throw new AppError(400, 'Field "date" must be a valid date (YYYY-MM-DD)');
  }
}

function validateVitalsInput(input: UpdateVitalsInput): void {
  if (input.heartRate !== undefined && (Number.isNaN(input.heartRate) || input.heartRate < 0)) {
    throw new AppError(400, 'Field "heartRate" must be a non-negative number');
  }
  if (input.healthStatus !== undefined && !VALID_HEALTH_STATUSES.includes(input.healthStatus)) {
    throw new AppError(400, `Invalid healthStatus "${input.healthStatus}"`);
  }
  if (
    input.vaccinationStatus !== undefined &&
    !VALID_VACCINATION_STATUSES.includes(input.vaccinationStatus)
  ) {
    throw new AppError(400, `Invalid vaccinationStatus "${input.vaccinationStatus}"`);
  }
}

export const healthService = {
  async listAnimalsHealth(): Promise<AnimalHealth[]> {
    const rows = await healthRepository.findAllAnimals();
    return rows.map((row) => rowToAnimalHealth(row));
  },

  async getAnimalHealthDetail(id: string): Promise<AnimalHealth> {
    const row = await healthRepository.findAnimalById(id);
    if (!row) {
      throw new AppError(404, 'Animal not found');
    }
    const historyRows = await healthRepository.findHistoryByAnimalId(id);
    return rowToAnimalHealth(row, historyRows.map(rowToHistoryEntry));
  },

  async addHistoryEntry(id: string, input: CreateHealthHistoryInput): Promise<AnimalHealth> {
    validateHistoryInput(input);

    const exists = await healthRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Animal not found');
    }

    await healthRepository.addHistoryEntry(id, input);
    return this.getAnimalHealthDetail(id);
  },

  async updateVitals(id: string, input: UpdateVitalsInput): Promise<AnimalHealth> {
    validateVitalsInput(input);

    const exists = await healthRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Animal not found');
    }

    const updated = await healthRepository.updateVitals(id, input);
    if (!updated) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    return this.getAnimalHealthDetail(id);
  },
};