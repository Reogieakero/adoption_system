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
