import { createServiceClient } from '@/lib/api-client';
import type { HealthAnimal, HealthHistoryEntry, AddHistoryEntryPayload, UpdateVitalsPayload } from '@/types';

const { request } = createServiceClient('/api/admin/health');

export async function fetchAnimalsHealth(): Promise<HealthAnimal[]> {
  const data = await request<{ success: true; animals: HealthAnimal[] }>('');
  return data.animals;
}

export async function fetchAnimalHealthDetail(id: string): Promise<HealthAnimal> {
  const data = await request<{ success: true; animal: HealthAnimal }>(`/${encodeURIComponent(id)}`);
  return data.animal;
}

export async function addAnimalHistoryEntry(
  id: string,
  entry: AddHistoryEntryPayload
): Promise<HealthAnimal> {
  const data = await request<{ success: true; animal: HealthAnimal }>(
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
): Promise<HealthAnimal> {
  const data = await request<{ success: true; animal: HealthAnimal }>(
    `/${encodeURIComponent(id)}/vitals`,
    {
      method: 'PATCH',
      body: JSON.stringify(vitals),
    }
  );
  return data.animal;
}

export type { HealthHistoryEntry };
