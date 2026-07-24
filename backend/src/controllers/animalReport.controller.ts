import { Request, Response, NextFunction } from 'express';
import { animalReportService } from '../services/animalReport.service';
import { CreateAnimalReportInput, ReportStatus } from '../types/animalReport.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

const VALID_STATUSES: ReportStatus[] = ['submitted', 'in_progress', 'dispatched', 'resolved'];

export const animalReportController = {
  async countPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await animalReportService.countPending();
      res.json({ success: true, count });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await animalReportService.listReports();
      res.json({ success: true, reports });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await animalReportService.getReportById(Number(req.params.id));
      res.json({ success: true, report });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resolution_notes } = req.body as { status: string; resolution_notes?: string | null };
      if (!status || !VALID_STATUSES.includes(status as ReportStatus)) {
        res.status(400).json({ success: false, message: `Invalid status "${status ?? 'undefined'}". Must be one of: ${VALID_STATUSES.join(', ')}` });
        return;
      }
      const report = await animalReportService.updateStatus(Number(req.params.id), status as ReportStatus, req.admin?.id, resolution_notes ?? null);
      res.json({ success: true, report });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
