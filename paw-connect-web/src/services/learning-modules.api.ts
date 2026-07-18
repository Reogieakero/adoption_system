import { createServiceClient, buildFormData } from '@/lib/api-client';
import type { LearningModule, CreateLearningModulePayload, UpdateLearningModulePayload } from '@/types';

const { request } = createServiceClient('/api/admin/learning-modules');

export async function fetchLearningModules(): Promise<LearningModule[]> {
  const data = await request<{ success: true; modules: LearningModule[] }>('');
  return data.modules;
}

export async function fetchLearningModuleById(id: string): Promise<LearningModule> {
  const data = await request<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}`
  );
  return data.module;
}

export async function createLearningModule(
  payload: CreateLearningModulePayload,
  imageFile: File | null = null
): Promise<LearningModule> {
  const data = await request<{ success: true; module: LearningModule }>('', {
    method: 'POST',
    body: buildFormData(payload as Record<string, unknown>, 'image', imageFile),
  });
  return data.module;
}

export async function updateLearningModule(
  id: string,
  payload: UpdateLearningModulePayload,
  imageFile: File | null = null
): Promise<LearningModule> {
  const data = await request<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildFormData(payload as Record<string, unknown>, 'image', imageFile),
    }
  );
  return data.module;
}

export async function duplicateLearningModule(id: string): Promise<LearningModule> {
  const data = await request<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}/duplicate`,
    { method: 'POST' }
  );
  return data.module;
}

export async function deleteLearningModule(id: string): Promise<void> {
  await request<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
