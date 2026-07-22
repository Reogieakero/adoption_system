import { Request, Response, NextFunction } from 'express';
import { animalReportService } from '../services/animalReport.service';
import { CreateAnimalReportInput, ReportStatus } from '../types/animalReport.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const animalReportController = {
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
      const { status, resolution_notes } = req.body as { status: ReportStatus; resolution_notes?: string | null };
      const report = await animalReportService.updateStatus(Number(req.params.id), status, resolution_notes ?? null);
      res.json({ success: true, report });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
