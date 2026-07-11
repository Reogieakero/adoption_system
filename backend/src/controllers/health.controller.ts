import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { CreateHealthHistoryInput, UpdateVitalsInput } from '../types/health.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const healthController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animals = await healthService.listAnimalsHealth();
      res.json({ success: true, animals });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animal = await healthService.getAnimalHealthDetail(req.params.id);
      res.json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async addHistoryEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateHealthHistoryInput;
      const animal = await healthService.addHistoryEntry(req.params.id, input);
      res.status(201).json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateVitals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as UpdateVitalsInput;
      const animal = await healthService.updateVitals(req.params.id, input);
      res.json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};