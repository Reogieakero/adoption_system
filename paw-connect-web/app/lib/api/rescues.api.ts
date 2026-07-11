import { API_BASE_URL } from '../config';
import type { RescueCase, RescueStage } from '../../admin/rescues/types';

const RESCUES_BASE = `${API_BASE_URL}/api/admin/rescues`;

class RescuesApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'RescuesApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new RescuesApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${RESCUES_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new RescuesApiError(res.status, typeof data.message === 'string' ? data.message : 'Request failed');
  }

  return data as T;
}

export async function fetchRescues(): Promise<RescueCase[]> {
  const data = await adminRequest<{ success: true; cases: RescueCase[] }>('');
  return data.cases;
}

export async function fetchRescueDetails(id: string): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; details: RescueCase }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.details;
}

export async function updateRescueStage(id: string, stage: RescueStage): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/stage`,
    { method: 'PATCH', body: JSON.stringify({ stage }) }
  );
  return data.case;
}

export async function updateRescueStatus(id: string, status: string): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) }
  );
  return data.case;
}

export async function assignRescuer(
  id: string,
  assignedRescuer: string,
  rescueTeam: string,
  eta?: string
): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/assign`,
    { method: 'PATCH', body: JSON.stringify({ assignedRescuer, rescueTeam, eta }) }
  );
  return data.case;
}

export async function updateRescuePriority(
  id: string,
  priority: RescueCase['priority']
): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/priority`,
    { method: 'PATCH', body: JSON.stringify({ priority }) }
  );
  return data.case;
}

export async function updateRescueNotes(id: string, internalNotes: string): Promise<RescueCase> {
  const data = await adminRequest<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/notes`,
    { method: 'PATCH', body: JSON.stringify({ internalNotes }) }
  );
  return data.case;
}