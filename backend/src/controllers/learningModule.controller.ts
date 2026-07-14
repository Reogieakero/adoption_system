import { Request, Response, NextFunction } from 'express';
import { learningModuleService } from '../services/learningModule.service';
import { CreateLearningModuleInput, UpdateLearningModuleInput } from '../types/learningModule.types';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { toPublicPhotoPath } from '../middleware/upload';

export const learningModuleController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const modules = await learningModuleService.listModules();
      res.json({ success: true, modules });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const module = await learningModuleService.getModuleById(req.params.id);
      res.json({ success: true, module });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const now = new Date().toISOString();
      const body = req.body as Partial<CreateLearningModuleInput>;
      const input: CreateLearningModuleInput = {
        id: body.id ?? `mod-${Date.now()}`,
        title: body.title ?? '',
        description: body.description ?? '',
        category: body.category ?? '',
        difficulty: body.difficulty ?? 'Beginner',
        duration: body.duration ?? '',
        status: body.status ?? 'Draft',
        objectives: body.objectives ?? '',
        content: body.content ?? '',
        videoUrl: body.videoUrl ?? '',
        pdfUrl: body.pdfUrl ?? '',
        views: 0,
        completionRate: '0%',
        image: req.file ? toPublicPhotoPath(req.file) : '',
        dateAdded: body.dateAdded ?? now,
        lastUpdated: body.lastUpdated ?? now,
      };
      const module = await learningModuleService.createModule(input);
      res.status(201).json({ success: true, module });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateLearningModuleInput = {
        ...(req.body as UpdateLearningModuleInput),
        lastUpdated: new Date().toISOString(),
      };
      if (req.file) {
        input.image = toPublicPhotoPath(req.file);
      }
      const module = await learningModuleService.updateModule(req.params.id, input);
      res.json({ success: true, module });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await learningModuleService.deleteModule(req.params.id);
      res.json({ success: true, message: 'Learning module deleted successfully' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async duplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const module = await learningModuleService.duplicateModule(req.params.id);
      res.status(201).json({ success: true, module });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};