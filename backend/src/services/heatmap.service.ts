import { heatmapRepository } from '../repositories/heatmap.repository';
import { AdoptionHeatPoint, HeatmapResponse, RescueHeatPoint } from '../types/heatmap.types';
import { toIsoDate, toIsoDateTime } from '../utils/heatmapMapper';

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
      weight: 0.5,
      id: row.report_id,
      status: row.status,
      location_area: row.location_area ?? '',
      species: row.species,
      reportedAt: toIsoDateTime(row.submitted_at),
    }));

    const adoptionPoints: AdoptionHeatPoint[] = adoptionRows.map((row) => ({
      lat: Number(row.latitude),
      lng: Number(row.longitude),
      weight: ADOPTION_POINT_WEIGHT,
      applicationId: row.application_id,
      animalName: row.animal_name,
      applicationDate: toIsoDate(row.application_date),
      location_area: row.location_area ?? '',
    }));

    return { rescuePoints, adoptionPoints };
  },
};
