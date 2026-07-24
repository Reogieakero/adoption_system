import { Request, Response, NextFunction } from 'express';
import { learningModuleService } from '../services/learningModule.service';
import { CreateElearningModuleInput, UpdateElearningModuleInput, CreateCategoryInput, ProgressStatus } from '../types/learningModule.types';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { toPublicPhotoPath } from '../middleware/upload';

export const learningModuleController = {
  // ── Categories ──────────────────────────────────────────────────────
  async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await learningModuleService.listCategories();
      res.json({ success: true, categories });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateCategoryInput;
      const category = await learningModuleService.createCategory(input);
      res.status(201).json({ success: true, category });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  // ── Modules ─────────────────────────────────────────────────────────
  async listModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const modules = await learningModuleService.listModules();
      res.json({ success: true, modules });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await learningModuleService.getModuleById(Number(req.params.id));
      res.json({ success: true, module: mod });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async listByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const modules = await learningModuleService.getModulesByCategory(Number(req.params.categoryId));
      res.json({ success: true, modules });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as Partial<CreateElearningModuleInput>;
      const input: CreateElearningModuleInput = {
        category_id: body.category_id ?? 0,
        title: body.title ?? '',
        description: body.description ?? null,
        content_body: body.content_body ?? '',
        video_url: body.video_url ?? null,
        cover_image_url: req.file ? toPublicPhotoPath(req.file) : (body.cover_image_url ?? null),
        order_index: body.order_index ?? 0,
        status: body.status ?? 'draft',
        created_by_admin_id: (req as any).admin?.id ?? 1,
      };
      const mod = await learningModuleService.createModule(input);
      res.status(201).json({ success: true, module: mod });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateElearningModuleInput = req.body as UpdateElearningModuleInput;
      if (req.file) {
        input.cover_image_url = toPublicPhotoPath(req.file);
      }
      const mod = await learningModuleService.updateModule(Number(req.params.id), input);
      res.json({ success: true, module: mod });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await learningModuleService.deleteModule(Number(req.params.id));
      res.json({ success: true, message: 'Learning module deleted successfully' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async duplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await learningModuleService.duplicateModule(Number(req.params.id));
      res.status(201).json({ success: true, module: mod });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  // ── Progress ────────────────────────────────────────────────────────
  async getCompletedCounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await learningModuleService.getCompletedCounts();
      res.json({ success: true, stats });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const residentId = Number(req.params.residentId);
      const moduleId = Number(req.params.id);
      const progress = await learningModuleService.getProgress(moduleId, residentId);
      res.json({ success: true, progress });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resident_id, status } = req.body as { resident_id: number; status: ProgressStatus };
      const progress = await learningModuleService.updateProgress(Number(req.params.id), resident_id, status);
      res.json({ success: true, progress });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
