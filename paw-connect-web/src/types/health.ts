export interface HealthRecord {
  record_id: number;
  pet_id: number;
  medical_history: string | null;
  vaccination_status: string | null;
  health_status: string | null;
  heart_rate_bpm: number | null;
  created_by_user_id: number;
  last_updated_by: number;
  created_at: string;
  updated_at: string;
  pet_name: string;
  pet_species: string;
  pet_breed_type: string;
  pet_photo_url: string | null;
}

export interface CreateHealthRecordPayload {
  medical_history?: string | null;
  vaccination_status?: string | null;
  health_status?: string | null;
  heart_rate_bpm?: number | null;
}

export interface UpdateHealthRecordPayload {
  medical_history?: string | null;
  vaccination_status?: string | null;
  health_status?: string | null;
  heart_rate_bpm?: number | null;
  last_updated_by: number;
}

export type DropdownName = 'species' | 'health' | 'vaccine' | null;

export interface HealthHistoryEntry {
  date: string;
  event: string;
  notes: string;
  bpm?: number;
}

export interface HealthAnimal {
  id: string;
  tag: string;
  name: string;
  species: string;
  breed: string;
  photo: string;
  heartRate: number;
  healthStatus: string;
  vaccinationStatus: string;
  history: HealthHistoryEntry[];
}
