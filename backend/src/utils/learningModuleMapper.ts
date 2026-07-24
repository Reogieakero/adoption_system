import { RowDataPacket } from 'mysql2/promise';
import { ElearningModule, ElearningCategory, ModuleProgress, ModuleStatus, ProgressStatus } from '../types/learningModule.types';

export interface ElearningModuleRow extends RowDataPacket {
  module_id: number;
  category_id: number;
  title: string;
  description: string | null;
  content_body: string;
  video_url: string | null;
  cover_image_url: string | null;
  order_index: number;
  status: ModuleStatus;
  created_by_admin_id: number;
  created_at: Date;
  updated_at: Date;
  progress_status?: ProgressStatus | null;
  category_name?: string;
}

export interface ElearningCategoryRow extends RowDataPacket {
  category_id: number;
  name: string;
  description: string | null;
  order_index: number;
  created_at: Date;
}

export interface ModuleProgressRow extends RowDataPacket {
  progress_id: number;
  module_id: number;
  resident_id: number;
  status: ProgressStatus;
  started_at: Date | null;
  completed_at: Date | null;
}

function toISODate(value: Date | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function rowToElearningModule(row: ElearningModuleRow): ElearningModule {
  return {
    module_id: row.module_id,
    category_id: row.category_id,
    title: row.title,
    description: row.description,
    content_body: row.content_body,
    video_url: row.video_url,
    cover_image_url: row.cover_image_url,
    order_index: row.order_index,
    status: row.status,
    created_by_admin_id: row.created_by_admin_id,
    created_at: toISODate(row.created_at) ?? '',
    updated_at: toISODate(row.updated_at) ?? '',
    progress_status: row.progress_status ?? null,
    category_name: row.category_name ?? null,
  };
}

export function rowToCategory(row: ElearningCategoryRow): ElearningCategory {
  return {
    category_id: row.category_id,
    name: row.name,
    description: row.description,
    order_index: row.order_index,
    created_at: toISODate(row.created_at) ?? '',
  };
}

export function rowToProgress(row: ModuleProgressRow): ModuleProgress {
  return {
    progress_id: row.progress_id,
    module_id: row.module_id,
    resident_id: row.resident_id,
    status: row.status,
    started_at: toISODate(row.started_at),
    completed_at: toISODate(row.completed_at),
  };
}
