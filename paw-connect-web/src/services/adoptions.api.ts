import { createServiceClient } from '@/lib/api-client';
import type { AdoptionApplication, UpdateApplicationStatusPayload } from '@/types';

const { request } = createServiceClient('/api/admin/adoptions');

export async function fetchAdoptions(): Promise<AdoptionApplication[]> {
  const data = await request<{ success: true; applications: AdoptionApplication[] }>('');
  return data.applications;
}

export async function fetchAdoptionById(id: number): Promise<AdoptionApplication> {
  const data = await request<{ success: true; details: AdoptionApplication }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.details;
}

export async function updateAdoptionStatus(
  id: number,
  payload: UpdateApplicationStatusPayload
): Promise<AdoptionApplication> {
  const data = await request<{ success: true; application: AdoptionApplication }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
  return data.application;
}
