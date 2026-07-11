import { RowDataPacket } from 'mysql2/promise';
import {
  AdoptionStatus,
  Animal,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  HealthStatus,
  RescueStatus,
  VaccinationStatus,
} from '../types/animal.types';

export interface AnimalRow extends RowDataPacket {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  age: string;
  size: AnimalSize;
  color_markings: string;
  rescue_status: RescueStatus;
  adoption_status: AdoptionStatus;
  health_status: HealthStatus;
  vaccination_status: VaccinationStatus;
  heart_rate: string | null;
  heart_rate_bpm: number | null;
  location: string;
  date_rescued: Date | null;
  date_added: Date;
  last_updated: Date;
  bio: string;
  photo_url: string;
}

export function toDisplayDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseDisplayDate(value: string): string | null {
  if (!value.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function parseHeartRateBpm(heartRate: string): number | null {
  const match = heartRate.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function rowToAnimal(row: AnimalRow): Animal {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    sex: row.sex,
    age: row.age,
    size: row.size,
    colorMarkings: row.color_markings,
    rescueStatus: row.rescue_status,
    adoptionStatus: row.adoption_status,
    healthStatus: row.health_status,
    vaccinationStatus: row.vaccination_status,
    heartRate: row.heart_rate ?? 'No Data',
    location: row.location,
    dateRescued: toDisplayDate(row.date_rescued),
    dateAdded: toDisplayDate(row.date_added),
    lastUpdated: toDisplayDate(row.last_updated),
    bio: row.bio,
    photo: row.photo_url,
  };
}
