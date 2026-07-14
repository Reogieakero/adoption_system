import { AppError } from '../errors/AppError';
import { learningModuleRepository } from '../repositories/learningModule.repository';
import {
  CreateLearningModuleInput,
  LearningModule,
  UpdateLearningModuleInput,
} from '../types/learningModule.types';
import { rowToLearningModule } from '../utils/learningModuleMapper';

const REQUIRED_CREATE_FIELDS: (keyof CreateLearningModuleInput)[] = [
  'id',
  'title',
  'description',
  'category',
  'difficulty',
  'duration',
  'status',
  'dateAdded',
  'lastUpdated',
];

function validateCreateInput(input: CreateLearningModuleInput): void {
  for (const field of REQUIRED_CREATE_FIELDS) {
    const value = input[field];
    if (value === undefined || value === null || value === '') {
      throw new AppError(400, `Field "${field}" is required`);
    }
  }
}

export const learningModuleService = {
  async listModules(): Promise<LearningModule[]> {
    const rows = await learningModuleRepository.findAll();
    return rows.map(rowToLearningModule);
  },

  async getModuleById(id: string): Promise<LearningModule> {
    const row = await learningModuleRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Learning module not found');
    }
    return rowToLearningModule(row);
  },

  async createModule(input: CreateLearningModuleInput): Promise<LearningModule> {
    validateCreateInput(input);

    const existing = await learningModuleRepository.findById(input.id);
    if (existing) {
      throw new AppError(409, 'A learning module with this ID already exists');
    }

    await learningModuleRepository.create({
      ...input,
      views: input.views ?? 0,
      completionRate: input.completionRate ?? '0%',
      image: input.image ?? '',
    });
    return this.getModuleById(input.id);
  },

  async updateModule(id: string, input: UpdateLearningModuleInput): Promise<LearningModule> {
    const existing = await learningModuleRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Learning module not found');
    }

    const updated = await learningModuleRepository.update(id, input);
    if (!updated) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    return this.getModuleById(id);
  },

  async deleteModule(id: string): Promise<void> {
    const deleted = await learningModuleRepository.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Learning module not found');
    }
  },

  async duplicateModule(id: string): Promise<LearningModule> {
    const source = await this.getModuleById(id);
    const now = new Date().toISOString();
    const copy: CreateLearningModuleInput = {
      ...source,
      id: `mod-${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: 'Draft',
      views: 0,
      completionRate: '0%',
      dateAdded: now,
      lastUpdated: now,
    };
    await learningModuleRepository.create(copy);
    return this.getModuleById(copy.id);
  },

  async seedModules(modules: CreateLearningModuleInput[]): Promise<number> {
    for (const module of modules) {
      validateCreateInput(module);
      await learningModuleRepository.upsert(module);
    }
    return modules.length;
  },
};