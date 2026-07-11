import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { CreateHealthHistoryInput, UpdateVitalsInput } from '../types/health.types';
import { AnimalHealthRow, HealthHistoryRow } from '../utils/healthMapper';

const LIST_QUERY = `
  SELECT
    id,
    name,
    species,
    breed,
    photo_url,
    heart_rate_bpm,
    vaccination_status,
    health_status
  FROM animals
  ORDER BY name ASC
`;

const BY_ID_QUERY = `
  SELECT
    id,
    name,
    species,
    breed,
    photo_url,
    heart_rate_bpm,
    vaccination_status,
    health_status
  FROM animals
  WHERE id = ?
`;

const HISTORY_QUERY = `
  SELECT event_date, event_title, notes
  FROM animal_health_history
  WHERE animal_id = ?
  ORDER BY event_date DESC, id DESC
`;

export const healthRepository = {
  async findAllAnimals(): Promise<AnimalHealthRow[]> {
    const [rows] = await pool.query<AnimalHealthRow[]>(LIST_QUERY);
    return rows;
  },

  async findAnimalById(id: string): Promise<AnimalHealthRow | undefined> {
    const [rows] = await pool.query<AnimalHealthRow[]>(BY_ID_QUERY, [id]);
    return rows[0];
  },

  async findHistoryByAnimalId(animalId: string): Promise<HealthHistoryRow[]> {
    const [rows] = await pool.query<HealthHistoryRow[]>(HISTORY_QUERY, [animalId]);
    return rows;
  },

  async addHistoryEntry(animalId: string, input: CreateHealthHistoryInput): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO animal_health_history (animal_id, event_date, event_title, notes)
       VALUES (?, ?, ?, ?)`,
      [animalId, input.date, input.event, input.notes]
    );
  },

  async updateVitals(id: string, input: UpdateVitalsInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.heartRate !== undefined) {
      fields.push('heart_rate_bpm = ?', 'heart_rate = ?');
      values.push(input.heartRate, String(input.heartRate));
    }
    if (input.healthStatus !== undefined) {
      fields.push('health_status = ?');
      values.push(input.healthStatus);
    }
    if (input.vaccinationStatus !== undefined) {
      fields.push('vaccination_status = ?');
      values.push(input.vaccinationStatus);
    }

    if (fields.length === 0) return true;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE animals SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  },

  async exists(id: string): Promise<boolean> {
    const [rows] = await pool.query<AnimalHealthRow[]>('SELECT id FROM animals WHERE id = ?', [id]);
    return rows.length > 0;
  },
};