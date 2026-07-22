import { createServiceClient, buildFormData } from '@/lib/api-client';
import type { ElearningModule, ElearningCategory, CreateElearningModulePayload, UpdateElearningModulePayload } from '@/types';

const { request } = createServiceClient('/api/admin/learning-modules');

export async function fetchCategories(): Promise<ElearningCategory[]> {
  const data = await request<{ success: true; categories: ElearningCategory[] }>('/categories');
  return data.categories;
}

export async function createCategory(payload: { name: string; description?: string; order_index?: number }): Promise<ElearningCategory> {
  const data = await request<{ success: true; category: ElearningCategory }>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.category;
}

export async function fetchLearningModules(categoryId?: number): Promise<ElearningModule[]> {
  const qs = categoryId ? `?categoryId=${categoryId}` : '';
  const data = await request<{ success: true; modules: ElearningModule[] }>(qs);
  return data.modules;
}

export async function fetchLearningModuleById(id: number): Promise<ElearningModule> {
  const data = await request<{ success: true; module: ElearningModule }>(
    `/${encodeURIComponent(id)}`
  );
  return data.module;
}

export async function createLearningModule(
  payload: CreateElearningModulePayload,
  imageFile: File | null = null
): Promise<ElearningModule> {
  const data = await request<{ success: true; module: ElearningModule }>('', {
    method: 'POST',
    body: buildFormData(payload as Record<string, unknown>, 'cover_image', imageFile),
  });
  return data.module;
}

export async function updateLearningModule(
  id: number,
  payload: UpdateElearningModulePayload,
  imageFile: File | null = null
): Promise<ElearningModule> {
  const data = await request<{ success: true; module: ElearningModule }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildFormData(payload as Record<string, unknown>, 'cover_image', imageFile),
    }
  );
  return data.module;
}

export async function deleteLearningModule(id: number): Promise<void> {
  await request<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
