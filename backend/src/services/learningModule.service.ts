import { AppError } from '../errors/AppError';
import { learningModuleRepository } from '../repositories/learningModule.repository';
import { logService } from './log.service';
import {
  ElearningCategory, ElearningModule, ModuleProgress,
  CreateElearningModuleInput, UpdateElearningModuleInput, CreateCategoryInput,
  ProgressStatus,
} from '../types/learningModule.types';
import { rowToElearningModule, rowToCategory, rowToProgress } from '../utils/learningModuleMapper';

const VALID_MODULE_STATUSES = ['draft', 'published'];
const VALID_PROGRESS_STATUSES: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];

export const learningModuleService = {
  // ── Categories ──────────────────────────────────────────────────────
  async listCategories(): Promise<ElearningCategory[]> {
    const rows = await learningModuleRepository.findAllCategories();
    return rows.map(rowToCategory);
  },

  async getCategoryById(id: number): Promise<ElearningCategory> {
    const row = await learningModuleRepository.findCategoryById(id);
    if (!row) {
      throw new AppError(404, 'Category not found');
    }
    return rowToCategory(row);
  },

  async createCategory(input: CreateCategoryInput): Promise<ElearningCategory> {
    const id = await learningModuleRepository.createCategory(input);

    await logService.logAction({
      action: 'Created',
      entityType: 'E-Learning',
      entityId: id,
      description: `E-learning category "${input.name}" created`,
    });

    return this.getCategoryById(id);
  },

  // ── Modules ─────────────────────────────────────────────────────────
  async listModules(): Promise<ElearningModule[]> {
    const rows = await learningModuleRepository.findAllModules();
    return rows.map(rowToElearningModule);
  },

  async getModulesByCategory(categoryId: number): Promise<ElearningModule[]> {
    const rows = await learningModuleRepository.findModulesByCategory(categoryId);
    return rows.map(rowToElearningModule);
  },

  async getModuleById(id: number): Promise<ElearningModule> {
    const row = await learningModuleRepository.findModuleById(id);
    if (!row) {
      throw new AppError(404, 'Learning module not found');
    }
    return rowToElearningModule(row);
  },

  async createModule(input: CreateElearningModuleInput): Promise<ElearningModule> {
    if (input.status && !VALID_MODULE_STATUSES.includes(input.status)) {
      throw new AppError(400, `Invalid status "${input.status}"`);
    }

    const id = await learningModuleRepository.createModule(input);

    await logService.logAction({
      userId: input.created_by_admin_id,
      action: 'Created',
      entityType: 'E-Learning',
      entityId: id,
      description: `E-learning module "${input.title}" created`,
    });

    return this.getModuleById(id);
  },

  async updateModule(id: number, input: UpdateElearningModuleInput): Promise<ElearningModule> {
    const existing = await learningModuleRepository.findModuleById(id);
    if (!existing) {
      throw new AppError(404, 'Learning module not found');
    }

    if (input.status && !VALID_MODULE_STATUSES.includes(input.status)) {
      throw new AppError(400, `Invalid status "${input.status}"`);
    }

    await learningModuleRepository.updateModule(id, input);

    await logService.logAction({
      action: 'Updated',
      entityType: 'E-Learning',
      entityId: id,
      description: `E-learning module "${existing.title}" updated`,
    });

    return this.getModuleById(id);
  },

  async deleteModule(id: number): Promise<void> {
    const existing = await learningModuleRepository.findModuleById(id);
    if (!existing) {
      throw new AppError(404, 'Learning module not found');
    }

    await learningModuleRepository.deleteModule(id);

    await logService.logAction({
      action: 'Deleted',
      entityType: 'E-Learning',
      entityId: id,
      description: `E-learning module "${existing.title}" deleted`,
    });
  },

  async duplicateModule(id: number): Promise<ElearningModule> {
    const source = await this.getModuleById(id);
    const input: CreateElearningModuleInput = {
      category_id: source.category_id,
      title: `${source.title} (Copy)`,
      description: source.description,
      content_body: source.content_body,
      video_url: source.video_url,
      cover_image_url: source.cover_image_url,
      order_index: source.order_index + 1,
      status: 'draft',
      created_by_admin_id: source.created_by_admin_id,
    };
    return this.createModule(input);
  },

  // ── Progress ────────────────────────────────────────────────────────
  async getProgress(moduleId: number, residentId: number): Promise<ModuleProgress | null> {
    const row = await learningModuleRepository.findProgressByModuleAndResident(moduleId, residentId);
    return row ? rowToProgress(row) : null;
  },

  async updateProgress(moduleId: number, residentId: number, status: ProgressStatus): Promise<ModuleProgress> {
    if (!VALID_PROGRESS_STATUSES.includes(status)) {
      throw new AppError(400, `Invalid progress status "${status}"`);
    }

    const moduleExists = await learningModuleRepository.findModuleById(moduleId);
    if (!moduleExists) {
      throw new AppError(404, 'Learning module not found');
    }

    await learningModuleRepository.upsertProgress(moduleId, residentId, status);
    const row = await learningModuleRepository.findProgressByModuleAndResident(moduleId, residentId);
    return rowToProgress(row!);
  },
};
