import { RowDataPacket } from 'mysql2/promise';
import { Pet, PetPhoto, Pet3dAsset, PetSpecies, PetBreedType, PetSex, PetStatus } from '../types/pet.types';

export interface PetRow extends RowDataPacket {
  pet_id: number;
  source_type: 'shelter' | 'community';
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
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PetPhotoRow extends RowDataPacket {
  photo_id: number;
  pet_id: number;
  file_url: string;
  is_primary: number;
  uploaded_at: Date;
}

export interface Pet3dAssetRow extends RowDataPacket {
  asset_id: number;
  pet_id: number;
  asset_url: string;
  asset_type: 'model_3d' | '360_view';
  uploaded_at: Date;
}

export interface PetWithDetailsRow extends PetRow {
  primary_photo_url: string | null;
  primary_photo_id: number | null;
  asset_url: string | null;
  asset_type: string | null;
  asset_id: number | null;
}

export function toISODate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function rowToPet(row: PetRow): Pet {
  return {
    pet_id: row.pet_id,
    source_type: row.source_type,
    posted_by_user_id: row.posted_by_user_id,
    species: row.species,
    breed_type: row.breed_type,
    breed_detail: row.breed_detail,
    name: row.name,
    age_estimate: row.age_estimate,
    sex: row.sex,
    description: row.description,
    status: row.status,
    rejection_reason: row.rejection_reason,
    location_area: row.location_area,
    created_by_user_id: row.created_by_user_id,
    updated_by_user_id: row.updated_by_user_id,
    deleted_by_user_id: row.deleted_by_user_id,
    deleted_at: toISODate(row.deleted_at),
    created_at: toISODate(row.created_at) ?? '',
    updated_at: toISODate(row.updated_at) ?? '',
  };
}
