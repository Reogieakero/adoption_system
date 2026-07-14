import { API_BASE_URL } from '../config';
import type { LearningModule } from '../../admin/learning/types';

const MODULES_BASE = `${API_BASE_URL}/api/admin/learning-modules`;

export type CreateLearningModulePayload = Omit<
  LearningModule,
  'id' | 'views' | 'completionRate' | 'dateAdded' | 'lastUpdated'
>;
export type UpdateLearningModulePayload = Partial<CreateLearningModulePayload>;

class LearningModulesApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'LearningModulesApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new LearningModulesApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${MODULES_BASE}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new LearningModulesApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

function buildModuleFormData(payload: object, imageFile: File | null): FormData {
  const formData = new FormData();
  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (key === 'image') return; // image goes in as a file part, not text
    formData.append(key, value == null ? '' : String(value));
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
}

export async function fetchLearningModules(): Promise<LearningModule[]> {
  const data = await adminRequest<{ success: true; modules: LearningModule[] }>('');
  return data.modules;
}

export async function fetchLearningModuleById(id: string): Promise<LearningModule> {
  const data = await adminRequest<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}`
  );
  return data.module;
}

export async function createLearningModule(
  payload: CreateLearningModulePayload,
  imageFile: File | null = null
): Promise<LearningModule> {
  const data = await adminRequest<{ success: true; module: LearningModule }>('', {
    method: 'POST',
    body: buildModuleFormData(payload, imageFile),
  });
  return data.module;
}

export async function updateLearningModule(
  id: string,
  payload: UpdateLearningModulePayload,
  imageFile: File | null = null
): Promise<LearningModule> {
  const data = await adminRequest<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildModuleFormData(payload, imageFile),
    }
  );
  return data.module;
}

export async function duplicateLearningModule(id: string): Promise<LearningModule> {
  const data = await adminRequest<{ success: true; module: LearningModule }>(
    `/${encodeURIComponent(id)}/duplicate`,
    { method: 'POST' }
  );
  return data.module;
}

export async function deleteLearningModule(id: string): Promise<void> {
  await adminRequest<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}