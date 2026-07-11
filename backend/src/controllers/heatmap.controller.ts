import { Request, Response, NextFunction } from 'express';
import { heatmapService } from '../services/heatmap.service';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const heatmapController = {
  async getData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await heatmapService.getHeatmapData();
      res.json({ success: true, ...data });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};