import { createServiceClient } from '@/lib/api-client';
import type { AdoptionApplication, ApplicationDetails, AdoptionStatus } from '@/types';

const { request } = createServiceClient('/api/admin/adoptions');

export async function fetchAdoptions(): Promise<AdoptionApplication[]> {
  const data = await request<{ success: true; applications: AdoptionApplication[] }>('');
  return data.applications;
}

export async function fetchAdoptionDetails(id: string): Promise<ApplicationDetails> {
  const data = await request<{ success: true; details: ApplicationDetails }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.details;
}

export async function updateAdoptionStatus(
  id: string,
  status: AdoptionStatus
): Promise<AdoptionApplication> {
  const data = await request<{ success: true; application: AdoptionApplication }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
  return data.application;
}
