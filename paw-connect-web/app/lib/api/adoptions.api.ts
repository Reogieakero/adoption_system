import { API_BASE_URL } from '../config';
import type { AdoptionApplication, ApplicationDetails, StatusType } from '../../admin/adoptions/types';

const ADOPTIONS_BASE = `${API_BASE_URL}/api/admin/adoptions`;

class AdoptionsApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AdoptionsApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new AdoptionsApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ADOPTIONS_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AdoptionsApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

export async function fetchAdoptions(): Promise<AdoptionApplication[]> {
  const data = await adminRequest<{ success: true; applications: AdoptionApplication[] }>('');
  return data.applications;
}

export async function fetchAdoptionDetails(id: string): Promise<ApplicationDetails> {
  const data = await adminRequest<{ success: true; details: ApplicationDetails }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.details;
}

export async function updateAdoptionStatus(
  id: string,
  status: StatusType
): Promise<AdoptionApplication> {
  const data = await adminRequest<{ success: true; application: AdoptionApplication }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
  return data.application;
}