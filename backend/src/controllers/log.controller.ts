import { Request, Response, NextFunction } from 'express';
import { logService } from '../services/log.service';

export const logController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await logService.listLogs();
      res.json({ success: true, logs });
    } catch (err) { next(err); }
  },
};
