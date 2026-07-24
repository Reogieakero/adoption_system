import { AppError } from '../errors/AppError';
import { animalReportRepository } from '../repositories/animalReport.repository';
import { notificationService } from './notification.service';
import { logService } from './log.service';
import { userRepository } from '../repositories/user.repository';
import { emitDataChanged } from '../socket';
import { AnimalReport, CreateAnimalReportInput, ReportStatus, UpdateAnimalReportInput } from '../types/animalReport.types';
import { rowToAnimalReport } from '../utils/animalReportMapper';

const VALID_STATUSES: ReportStatus[] = ['submitted', 'in_progress', 'dispatched', 'resolved'];

export const animalReportService = {
  async countPending(): Promise<number> {
    return animalReportRepository.countPending();
  },

  async listReports(): Promise<AnimalReport[]> {
    const rows = await animalReportRepository.findAll();
    return rows.map(rowToAnimalReport);
  },

  async getMyReports(residentId: number): Promise<AnimalReport[]> {
    const rows = await animalReportRepository.findByResidentId(residentId);
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

    await logService.logAction({
      userId: null,
      action: 'Created',
      entityType: 'Reports',
      entityId: reportId,
      description: `New ${input.species} rescue report submitted by resident`,
    });

    // Notify all admins about the new report
    const adminIds = await userRepository.findAdminUserIds();
    for (const adminId of adminIds) {
      await notificationService.create({
        recipient_id: adminId,
        type: 'new_report',
        linked_type: 'animal_report',
        linked_id: reportId,
        message_text: `A new ${input.species} rescue report has been submitted.`,
      });
    }

    emitDataChanged();
    return this.getReportById(reportId);
  },

  async updateStatus(id: number, status: ReportStatus, adminId?: number, resolutionNotes?: string | null): Promise<AnimalReport> {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid status "${status}"`);
    }

    const exists = await animalReportRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Animal report not found');
    }

    await animalReportRepository.updateStatus(id, status, resolutionNotes ?? null);
    await logService.logAction({
      userId: adminId ?? null,
      action: 'Updated Status',
      entityType: 'Reports',
      entityId: id,
      description: `Report #${id} status changed to "${status}"`,
    });

    emitDataChanged();

    // Notify the resident about the report status change
    const report = await this.getReportById(id);
    await notificationService.create({
      recipient_id: report.resident_id,
      type: 'report_status',
      linked_type: 'animal_report',
      linked_id: id,
      message_text: `Your rescue report has been ${status === 'resolved' ? 'resolved' : status === 'in_progress' ? 'acknowledged' : status === 'dispatched' ? 'dispatched' : 'updated'}.`,
    });

    return report;
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
