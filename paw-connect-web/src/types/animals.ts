export type PetSourceType = 'shelter' | 'community';
export type PetSpecies = 'dog' | 'cat';
export type PetBreedType = 'aspin' | 'puspin' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';
export type PetStatus = 'pending_verification' | 'available' | 'pending' | 'adopted' | 'rejected';
export type PetHealthStatus = 'Healthy' | 'Recovering' | 'Under Treatment' | 'Critical';

export interface Pet {
  pet_id: number;
  source_type: PetSourceType;
  posted_by_user_id: number | null;
  species: PetSpecies;
  breed_type: PetBreedType;
  breed_detail: string | null;
  name: string;
  age_estimate: string | null;
  sex: PetSex;
  description: string | null;
  status: PetStatus;
  health_status: PetHealthStatus;
  rejection_reason: string | null;
  location_area: string | null;
  created_by_user_id: number;
  updated_by_user_id: number | null;
  deleted_by_user_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  primary_photo_url?: string | null;
  photos?: { photo_id: number; file_url: string; is_primary: boolean | number }[];
  asset_3d?: { asset_id: number; asset_url: string; asset_type: string } | null;
  health_record?: {
    record_id: number;
    pet_id: number;
    medical_history: string | null;
    vaccination_status: string | null;
    health_status: PetHealthStatus;
  } | null;
}

export type PetFormData = Omit<Pet, 'pet_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'deleted_by_user_id' | 'updated_by_user_id' | 'created_by_user_id' | 'posted_by_user_id' | 'rejection_reason' | 'health_status' | 'primary_photo_url' | 'photos' | 'asset_3d'>;
