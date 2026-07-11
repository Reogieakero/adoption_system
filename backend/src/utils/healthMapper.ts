import { RowDataPacket } from 'mysql2/promise';
import { AnimalHealth, HealthHistoryEntry } from '../types/health.types';

export interface AnimalHealthRow extends RowDataPacket {
  id: string;
  name: string;
  species: string;
  breed: string;
  photo_url: string;
  heart_rate_bpm: number | null;
  vaccination_status: AnimalHealth['vaccinationStatus'];
  health_status: AnimalHealth['healthStatus'];
}

export interface HealthHistoryRow extends RowDataPacket {
  event_date: string | Date;
  event_title: string;
  notes: string;
}

function toIsoDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  // mysql2 can also return DATE columns as 'YYYY-MM-DD' strings depending on config
  return String(value).slice(0, 10);
}

export function rowToAnimalHealth(row: AnimalHealthRow, history: HealthHistoryEntry[] = []): AnimalHealth {
  return {
    id: row.id,
    tag: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    photo: row.photo_url,
    heartRate: row.heart_rate_bpm ?? 0,
    vaccinationStatus: row.vaccination_status,
    healthStatus: row.health_status,
    history,
  };
}

export function rowToHistoryEntry(row: HealthHistoryRow): HealthHistoryEntry {
  return {
    date: toIsoDate(row.event_date),
    event: row.event_title,
    notes: row.notes,
  };
}