import { RowDataPacket } from 'mysql2/promise';
import { LearningModule, ModuleDifficulty, ModuleStatus } from '../types/learningModule.types';

export interface LearningModuleRow extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ModuleDifficulty;
  duration: string;
  status: ModuleStatus;
  objectives: string | null;
  content: string | null;
  video_url: string | null;
  pdf_url: string | null;
  views: number;
  completion_rate: string;
  image_url: string | null;
  date_added: Date;
  last_updated: Date;
}

export function toDisplayDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseDisplayDate(value: string): string | null {
  if (!value.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function rowToLearningModule(row: LearningModuleRow): LearningModule {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    duration: row.duration,
    status: row.status,
    objectives: row.objectives ?? '',
    content: row.content ?? '',
    videoUrl: row.video_url ?? '',
    pdfUrl: row.pdf_url ?? '',
    views: row.views,
    completionRate: row.completion_rate,
    image: row.image_url ?? '',
    dateAdded: toDisplayDate(row.date_added),
    lastUpdated: toDisplayDate(row.last_updated),
  };
}