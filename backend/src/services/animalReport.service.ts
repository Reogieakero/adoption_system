import { AppError } from '../errors/AppError';
import { animalReportRepository } from '../repositories/animalReport.repository';
import { AnimalReport, CreateAnimalReportInput, ReportStatus, UpdateAnimalReportInput } from '../types/animalReport.types';
import { rowToAnimalReport } from '../utils/animalReportMapper';

const VALID_STATUSES: ReportStatus[] = ['submitted', 'in_progress', 'dispatched', 'resolved'];

export const animalReportService = {
  async listReports(): Promise<AnimalReport[]> {
    const rows = await animalReportRepository.findAll();
    return rows.map(rowToAnimalReport);
  },

  async getReportById(id: number): Promise<AnimalReport> {
    const row = await animalReportRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Animal report not found');
    }
    return rowToAnimalReport(row);
  },

  async createReport(input: CreateAnimalReportInput): Promise<AnimalReport> {
    const reportId = await animalReportRepository.create(input);
    return this.getReportById(reportId);
  },

  async updateStatus(id: number, status: ReportStatus, resolutionNotes?: string | null): Promise<AnimalReport> {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid status "${status}"`);
    }

    const exists = await animalReportRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Animal report not found');
    }

    await animalReportRepository.updateStatus(id, status, resolutionNotes ?? null);
    return this.getReportById(id);
  },

  async updateReport(id: number, input: UpdateAnimalReportInput): Promise<AnimalReport> {
    const exists = await animalReportRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Animal report not found');
    }

    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new AppError(400, `Invalid status "${input.status}"`);
    }

    await animalReportRepository.update(id, input);
    return this.getReportById(id);
  },
};
