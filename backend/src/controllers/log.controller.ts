import { Request, Response, NextFunction } from 'express';
import { logService } from '../services/log.service';

export const logController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 20));
      const search = req.query.search as string | undefined;
      const module = req.query.module as string | undefined;
      const dateFrom = req.query.dateFrom as string | undefined;
      const dateTo = req.query.dateTo as string | undefined;

      const result = await logService.listLogs({ page, limit, search, module, dateFrom, dateTo });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  },
};
