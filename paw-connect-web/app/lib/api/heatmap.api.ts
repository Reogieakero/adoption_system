import { API_BASE_URL } from '../config';

const HEATMAP_BASE = `${API_BASE_URL}/api/admin/heatmap`;

export interface HeatPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface RescueHeatPoint extends HeatPoint {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  barangay: string;
  animalType: string;
  reportedAt: string;
}

export interface AdoptionHeatPoint extends HeatPoint {
  applicationId: string;
  animalName: string;
  applicationDate: string;
  barangay: string;
}

export interface HeatmapData {
  rescuePoints: RescueHeatPoint[];
  adoptionPoints: AdoptionHeatPoint[];
}

class HeatmapApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HeatmapApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new HeatmapApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

export async function fetchHeatmapData(): Promise<HeatmapData> {
  const res = await fetch(HEATMAP_BASE, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new HeatmapApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return { rescuePoints: data.rescuePoints, adoptionPoints: data.adoptionPoints };
}