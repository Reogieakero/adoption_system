import { API_BASE_URL } from '../config';
import type { Animal } from '../../admin/animals/animalsData';

const ANIMALS_BASE = `${API_BASE_URL}/api/admin/animals`;

export type UpdateAnimalPayload = Partial<Omit<Animal, 'id'>>;
export type CreateAnimalPayload = Animal;

class AnimalsApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AnimalsApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new AnimalsApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${ANIMALS_BASE}${path}`, {
    ...init,
    headers: {
      // Let the browser set the multipart/form-data boundary itself —
      // setting Content-Type manually for FormData breaks the upload.
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AnimalsApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

// Builds a multipart form: every Animal field as a text part, plus the
// actual photo File (if provided) — never a base64 string.
function buildAnimalFormData(payload: object, photoFile: File | null): FormData {
  const formData = new FormData();
  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (key === 'photo') return; // photo goes in as a file part, not text
    formData.append(key, value == null ? '' : String(value));
  });
  if (photoFile) {
    formData.append('photo', photoFile);
  }
  return formData;
}

export async function fetchAnimals(): Promise<Animal[]> {
  const data = await adminRequest<{ success: true; animals: Animal[] }>('');
  return data.animals;
}

export async function fetchAnimalById(id: string): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>(`/${encodeURIComponent(id)}`);
  return data.animal;
}

export async function createAnimal(
  payload: CreateAnimalPayload,
  photoFile: File | null = null
): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>('', {
    method: 'POST',
    body: buildAnimalFormData(payload, photoFile),
  });
  return data.animal;
}

export async function updateAnimal(
  id: string,
  payload: UpdateAnimalPayload,
  photoFile: File | null = null
): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildAnimalFormData(payload, photoFile),
    }
  );
  return data.animal;
}

export async function deleteAnimal(id: string): Promise<void> {
  await adminRequest<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}