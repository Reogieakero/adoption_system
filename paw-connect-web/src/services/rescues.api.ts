import { createServiceClient } from '@/lib/api-client';
import type { AnimalReport, ReportStatus } from '@/types';

const { request } = createServiceClient('/api/admin/animal-reports');

export async function fetchReportPendingCount(): Promise<number> {
  const data = await request<{ success: true; count: number }>('/pending-count');
  return data.count;
}

export async function fetchAnimalReports(): Promise<AnimalReport[]> {
  const data = await request<{ success: true; reports: AnimalReport[] }>('');
  return data.reports;
}

export async function fetchAnimalReportById(id: number): Promise<AnimalReport> {
  const data = await request<{ success: true; report: AnimalReport }>(
    `/${encodeURIComponent(id)}/details`
  );
  return data.report;
}

export async function updateReportStatus(
  id: number,
  status: ReportStatus,
  resolutionNotes?: string
): Promise<AnimalReport> {
  const data = await request<{ success: true; report: AnimalReport }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status, resolution_notes: resolutionNotes }),
    }
  );
  return data.report;
}
