import { heatmapRepository, RescuePointRow } from '../repositories/heatmap.repository';
import { AdoptionHeatPoint, HeatmapResponse, RescueHeatPoint } from '../types/heatmap.types';
import { toIsoDate, toIsoDateTime } from '../utils/heatmapMapper';

// Higher-priority rescue reports glow hotter on the map, not just "more points
// in the same area" — a single Critical case still stands out.
const PRIORITY_WEIGHT: Record<RescuePointRow['priority'], number> = {
  Critical: 1.0,
  High: 0.75,
  Medium: 0.5,
  Low: 0.25,
};

const ADOPTION_POINT_WEIGHT = 0.6;

export const heatmapService = {
  async getHeatmapData(): Promise<HeatmapResponse> {
    const [rescueRows, adoptionRows] = await Promise.all([
      heatmapRepository.findRescuePoints(),
      heatmapRepository.findAdoptionPoints(),
    ]);

    const rescuePoints: RescueHeatPoint[] = rescueRows.map((row) => ({
      lat: Number(row.latitude),
      lng: Number(row.longitude),
      weight: PRIORITY_WEIGHT[row.priority] ?? 0.5,
      id: row.id,
      priority: row.priority,
      status: row.status,
      barangay: row.barangay,
      animalType: row.animal_type,
      reportedAt: toIsoDateTime(row.reported_at),
    }));

    const adoptionPoints: AdoptionHeatPoint[] = adoptionRows.map((row) => ({
      lat: Number(row.latitude),
      lng: Number(row.longitude),
      weight: ADOPTION_POINT_WEIGHT,
      applicationId: row.application_id,
      animalName: row.animal_name,
      applicationDate: toIsoDate(row.application_date),
      barangay: row.barangay,
    }));

    return { rescuePoints, adoptionPoints };
  },
};