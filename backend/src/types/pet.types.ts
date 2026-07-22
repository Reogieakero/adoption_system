export type PetSourceType = 'shelter' | 'community';
export type PetSpecies = 'dog' | 'cat';
export type PetBreedType = 'aspin' | 'puspin' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';
export type PetStatus = 'pending_verification' | 'available' | 'pending' | 'adopted' | 'rejected';

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
  rejection_reason: string | null;
  location_area: string | null;
  created_by_user_id: number;
  updated_by_user_id: number | null;
  deleted_by_user_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PetPhoto {
  photo_id: number;
  pet_id: number;
  file_url: string;
  is_primary: boolean;
  uploaded_at: string;
}

export interface Pet3dAsset {
  asset_id: number;
  pet_id: number;
  asset_url: string;
  asset_type: 'model_3d' | '360_view';
  uploaded_at: string;
}

export interface CreatePetInput {
  source_type: PetSourceType;
  posted_by_user_id?: number | null;
  species: PetSpecies;
  breed_type: PetBreedType;
  breed_detail?: string | null;
  name: string;
  age_estimate?: string | null;
  sex: PetSex;
  description?: string | null;
  status: PetStatus;
  rejection_reason?: string | null;
  location_area?: string | null;
  created_by_user_id: number;
}

export interface UpdatePetInput {
  source_type?: PetSourceType;
  posted_by_user_id?: number | null;
  species?: PetSpecies;
  breed_type?: PetBreedType;
  breed_detail?: string | null;
  name?: string;
  age_estimate?: string | null;
  sex?: PetSex;
  description?: string | null;
  status?: PetStatus;
  rejection_reason?: string | null;
  location_area?: string | null;
  updated_by_user_id?: number | null;
}

export interface PetWithDetails extends Pet {
  primary_photo: PetPhoto | null;
  photos: PetPhoto[];
  asset_3d: Pet3dAsset | null;
}

export type Model3dStatus = 'none' | 'pending' | 'ready' | 'failed';
