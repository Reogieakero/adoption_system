export type ModuleStatus = 'draft' | 'published';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ElearningCategory {
  category_id: number;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface ElearningModule {
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
  created_at: string;
  updated_at: string;
  progress_status?: ProgressStatus | null;
  category_name?: string | null;
}

export interface ModuleProgress {
  progress_id: number;
  module_id: number;
  resident_id: number;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
}

export interface ElearningModuleWithCategory extends ElearningModule {
  category_name: string;
}

export interface CreateElearningModuleInput {
  category_id: number;
  title: string;
  description?: string | null;
  content_body: string;
  video_url?: string | null;
  cover_image_url?: string | null;
  order_index: number;
  status?: ModuleStatus;
  created_by_admin_id: number;
}

export interface UpdateElearningModuleInput {
  category_id?: number;
  title?: string;
  description?: string | null;
  content_body?: string;
  video_url?: string | null;
  cover_image_url?: string | null;
  order_index?: number;
  status?: ModuleStatus;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
  order_index: number;
}
