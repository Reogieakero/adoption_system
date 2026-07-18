export type HealthStatusType = 'Healthy' | 'Under Treatment' | 'Recovering' | 'Critical';
export type HealthVaccinationStatus = 'Vaccinated' | 'Not Fully Vaccinated' | 'Due' | 'Not Vaccinated';
export type DropdownName = 'species' | 'health' | 'vaccine' | null;

export interface HealthHistoryEntry {
  date: string;
  event: string;
  notes: string;
}

export interface HealthAnimal {
  id: string;
  tag: string;
  name: string;
  species: string;
  breed: string;
  photo: string;
  heartRate: number;
  vaccinationStatus: HealthVaccinationStatus;
  healthStatus: HealthStatusType;
  history: HealthHistoryEntry[];
}

export interface AddHistoryEntryPayload {
  date: string;
  event: string;
  notes: string;
}

export interface UpdateVitalsPayload {
  heartRate?: number;
  healthStatus?: HealthStatusType;
  vaccinationStatus?: HealthVaccinationStatus;
}
