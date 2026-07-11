import { Request, Response, NextFunction } from 'express';
import { adoptionService } from '../services/adoption.service';
import { UpdateApplicationStatusInput } from '../types/adoption.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const adoptionController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await adoptionService.listApplications();
      res.json({ success: true, applications });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const details = await adoptionService.getApplicationDetails(req.params.id);
      res.json({ success: true, details });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body as UpdateApplicationStatusInput;
      const application = await adoptionService.updateStatus(req.params.id, status);
      res.json({ success: true, application });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};