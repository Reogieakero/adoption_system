import { RowDataPacket } from 'mysql2/promise';
import { AdoptionApplication, AdoptionApplicationWithDetails, AdoptionStatus } from '../types/adoption.types';

export interface AdoptionListRow extends RowDataPacket {
  application_id: number;
  pet_id: number;
  resident_id: number;
  status: AdoptionStatus;
  rejection_reason: string | null;
  reason_for_adopting: string | null;
  living_situation: string | null;
  has_other_pets: number | null;
  household_members_count: number | null;
  additional_notes: string | null;
  submitted_at: Date;
  decided_at: Date | null;
  decided_by_admin_id: number | null;
  handover_confirmed_at: Date | null;
  updated_at: Date;
  pet_name: string;
  pet_species: string;
  pet_photo_url: string | null;
  resident_name: string;
  resident_email: string;
}

export interface AdoptionDetailsRow extends AdoptionListRow {}

function toISODate(value: Date | string | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

function toISODateTime(value: Date | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function rowToAdoptionApplication(row: AdoptionListRow): AdoptionApplicationWithDetails {
  return {
    application_id: row.application_id,
    pet_id: row.pet_id,
    resident_id: row.resident_id,
    status: row.status,
    rejection_reason: row.rejection_reason,
    reason_for_adopting: row.reason_for_adopting,
    living_situation: row.living_situation,
    has_other_pets: Boolean(row.has_other_pets),
    household_members_count: row.household_members_count,
    additional_notes: row.additional_notes,
    submitted_at: toISODate(row.submitted_at),
    decided_at: toISODateTime(row.decided_at),
    decided_by_admin_id: row.decided_by_admin_id,
    handover_confirmed_at: toISODateTime(row.handover_confirmed_at),
    updated_at: toISODate(row.updated_at),
    pet_name: row.pet_name,
    pet_species: row.pet_species,
    pet_photo_url: row.pet_photo_url,
    resident_name: row.resident_name,
    resident_email: row.resident_email,
  };
}
