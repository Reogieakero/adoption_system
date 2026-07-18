import { getAdminToken, ApiError } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';
import type { HeatmapData } from '@/types';

const HEATMAP_BASE = `${API_BASE_URL}/api/admin/heatmap`;

export async function fetchHeatmapData(): Promise<HeatmapData> {
  const res = await fetch(HEATMAP_BASE, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return { rescuePoints: data.rescuePoints, adoptionPoints: data.adoptionPoints };
}
