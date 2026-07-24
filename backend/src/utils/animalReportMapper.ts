import { RowDataPacket } from 'mysql2/promise';
import { AnimalReport, AnimalReportRow, ReportSpecies, ReportStatus } from '../types/animalReport.types';

export interface ReportRow extends RowDataPacket {
  report_id: number;
  resident_id: number;
  species: ReportSpecies;
  condition_description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  location_area: string | null;
  contact_preference: string | null;
  status: ReportStatus;
  resolution_notes: string | null;
  is_synced: number;
  is_valid_for_heatmap: number;
  submitted_at: Date;
  resolved_at: Date | null;
  updated_at: Date;
  resident_name?: string;
  resident_email?: string;
  resident_phone?: string;
}

function toISODate(value: Date | string | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function toISODateTime(value: Date | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function rowToAnimalReport(row: ReportRow): AnimalReport {
  return {
    report_id: row.report_id,
    resident_id: row.resident_id,
    species: row.species,
    condition_description: row.condition_description,
    photo_url: row.photo_url,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    location_area: row.location_area,
    contact_preference: row.contact_preference,
    status: row.status,
    resolution_notes: row.resolution_notes,
    is_synced: Boolean(row.is_synced),
    is_valid_for_heatmap: Boolean(row.is_valid_for_heatmap),
    submitted_at: toISODate(row.submitted_at),
    resolved_at: toISODateTime(row.resolved_at),
    updated_at: toISODate(row.updated_at),
    resident_name: row.resident_name ?? null,
    resident_email: row.resident_email ?? null,
    resident_phone: row.resident_phone ?? null,
  };
}
