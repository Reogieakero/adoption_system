export interface HeatPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface RescueHeatPoint extends HeatPoint {
  id: number;
  status: string;
  location_area: string;
  species: string;
  reportedAt: string;
}

export interface AdoptionHeatPoint extends HeatPoint {
  applicationId: number;
  animalName: string;
  applicationDate: string;
  location_area: string;
}

export interface HeatmapData {
  rescuePoints: RescueHeatPoint[];
  adoptionPoints: AdoptionHeatPoint[];
}
