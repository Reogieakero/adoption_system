import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { UpdateHealthRecordInput } from '../types/health.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const healthController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await healthService.listHealthRecords();
      res.json({ success: true, records });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getByPetId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await healthService.getHealthByPetId(Number(req.params.id));
      res.json({ success: true, record });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async upsert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { medical_history, vaccination_status, heart_rate_bpm } = req.body as {
        medical_history?: string | null;
        vaccination_status?: string | null;
        heart_rate_bpm?: number | null;
      };
      const adminId = (req as any).admin?.id ?? 1;
      const record = await healthService.upsertHealthRecord(
        Number(req.params.id),
        medical_history ?? null,
        vaccination_status ?? null,
        heart_rate_bpm ?? null,
        adminId
      );
      res.json({ success: true, record });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateHealthRecordInput = {
        ...(req.body as UpdateHealthRecordInput),
        last_updated_by: (req as any).admin?.id ?? 1,
      };
      const record = await healthService.updateHealthRecord(Number(req.params.id), input);
      res.json({ success: true, record });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
