import { RowDataPacket } from 'mysql2/promise';
import { HealthRecord, HealthRecordWithPet } from '../types/health.types';

export interface HealthRecordRow extends RowDataPacket {
  record_id: number;
  pet_id: number;
  medical_history: string | null;
  vaccination_status: string | null;
  heart_rate_bpm: number | null;
  created_by_user_id: number;
  last_updated_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface HealthRecordWithPetRow extends HealthRecordRow {
  pet_name: string;
  pet_species: string;
  pet_breed_type: string;
  pet_photo_url: string | null;
}

function toISODate(value: Date | null | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function rowToHealthRecord(row: HealthRecordWithPetRow): HealthRecordWithPet {
  return {
    record_id: row.record_id,
    pet_id: row.pet_id,
    medical_history: row.medical_history,
    vaccination_status: row.vaccination_status,
    heart_rate_bpm: row.heart_rate_bpm,
    created_by_user_id: row.created_by_user_id,
    last_updated_by: row.last_updated_by,
    created_at: toISODate(row.created_at),
    updated_at: toISODate(row.updated_at),
    pet_name: row.pet_name,
    pet_species: row.pet_species,
    pet_breed_type: row.pet_breed_type,
    pet_photo_url: row.pet_photo_url,
  };
}
