import { createServiceClient } from '@/lib/api-client';
import type { RescueCase, RescueStage } from '@/types';

const { request } = createServiceClient('/api/admin/rescues');

export async function fetchRescues(): Promise<RescueCase[]> {
  const data = await request<{ success: true; cases: RescueCase[] }>('');
  return data.cases;
}

export async function fetchRescueDetails(id: string): Promise<RescueCase> {
  const data = await request<{ success: true; details: RescueCase }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.details;
}

export async function updateRescueStage(id: string, stage: RescueStage): Promise<RescueCase> {
  const data = await request<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/stage`,
    { method: 'PATCH', body: JSON.stringify({ stage }) }
  );
  return data.case;
}

export async function updateRescueStatus(id: string, status: string): Promise<RescueCase> {
  const data = await request<{ success: true; case: RescueCase }>(
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
  const data = await request<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/assign`,
    { method: 'PATCH', body: JSON.stringify({ assignedRescuer, rescueTeam, eta }) }
  );
  return data.case;
}

export async function updateRescuePriority(
  id: string,
  priority: RescueCase['priority']
): Promise<RescueCase> {
  const data = await request<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/priority`,
    { method: 'PATCH', body: JSON.stringify({ priority }) }
  );
  return data.case;
}

export async function updateRescueNotes(id: string, internalNotes: string): Promise<RescueCase> {
  const data = await request<{ success: true; case: RescueCase }>(
    `/${encodeURIComponent(id)}/notes`,
    { method: 'PATCH', body: JSON.stringify({ internalNotes }) }
  );
  return data.case;
}
