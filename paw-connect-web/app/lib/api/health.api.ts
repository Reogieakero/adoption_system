import { API_BASE_URL } from '../config';
import type { Animal, HistoryEntry } from '../../admin/health/types';

const HEALTH_BASE = `${API_BASE_URL}/api/admin/health`;

export interface AddHistoryEntryPayload {
  date: string;
  event: string;
  notes: string;
}

export interface UpdateVitalsPayload {
  heartRate?: number;
  healthStatus?: Animal['healthStatus'];
  vaccinationStatus?: Animal['vaccinationStatus'];
}

class HealthApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HealthApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new HealthApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${HEALTH_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new HealthApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

export async function fetchAnimalsHealth(): Promise<Animal[]> {
  const data = await adminRequest<{ success: true; animals: Animal[] }>('');
  return data.animals;
}

export async function fetchAnimalHealthDetail(id: string): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>(`/${encodeURIComponent(id)}`);
  return data.animal;
}

export async function addAnimalHistoryEntry(
  id: string,
  entry: AddHistoryEntryPayload
): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>(
    `/${encodeURIComponent(id)}/history`,
    {
      method: 'POST',
      body: JSON.stringify(entry),
    }
  );
  return data.animal;
}

export async function updateAnimalVitals(
  id: string,
  vitals: UpdateVitalsPayload
): Promise<Animal> {
  const data = await adminRequest<{ success: true; animal: Animal }>(
    `/${encodeURIComponent(id)}/vitals`,
    {
      method: 'PATCH',
      body: JSON.stringify(vitals),
    }
  );
  return data.animal;
}

export type { HistoryEntry };