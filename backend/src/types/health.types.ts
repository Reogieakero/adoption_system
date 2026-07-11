export type HealthStatus = 'Healthy' | 'Under Treatment' | 'Recovering' | 'Critical';
export type VaccinationStatus =
  | 'Vaccinated'
  | 'Not Fully Vaccinated'
  | 'Due'
  | 'Not Vaccinated';

export interface HealthHistoryEntry {
  date: string;
  event: string;
  notes: string;
}

export interface AnimalHealth {
  id: string;
  tag: string;
  name: string;
  species: string;
  breed: string;
  photo: string;
  heartRate: number;
  vaccinationStatus: VaccinationStatus;
  healthStatus: HealthStatus;
  history: HealthHistoryEntry[];
}

export interface CreateHealthHistoryInput {
  date: string;
  event: string;
  notes: string;
}

export interface UpdateVitalsInput {
  heartRate?: number;
  healthStatus?: HealthStatus;
  vaccinationStatus?: VaccinationStatus;
}