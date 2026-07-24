export type HealthStatus = 'Healthy' | 'Recovering' | 'Under Treatment' | 'Critical';

export interface HealthRecord {
  record_id: number;
  pet_id: number;
  medical_history: string | null;
  vaccination_status: string | null;
  heart_rate_bpm: number | null;
  health_status: HealthStatus;
  created_by_user_id: number;
  last_updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface HealthRecordWithPet extends HealthRecord {
  pet_name: string;
  pet_species: string;
  pet_breed_type: string;
  pet_photo_url: string | null;
}

export interface CreateHealthRecordInput {
  medical_history?: string | null;
  vaccination_status?: string | null;
  heart_rate_bpm?: number | null;
  created_by_user_id: number;
}

export interface UpdateHealthRecordInput {
  medical_history?: string | null;
  vaccination_status?: string | null;
  heart_rate_bpm?: number | null;
  health_status?: HealthStatus;
  last_updated_by: number;
}
