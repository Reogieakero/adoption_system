import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { UpdateHealthRecordInput } from '../types/health.types';
import { HealthRecordWithPetRow } from '../utils/healthMapper';

export const healthRepository = {
  async findAll(): Promise<HealthRecordWithPetRow[]> {
    const [rows] = await pool.query<HealthRecordWithPetRow[]>(
      `SELECT
        hr.record_id, hr.pet_id, hr.medical_history, hr.vaccination_status,
        hr.heart_rate_bpm, hr.created_by_user_id, hr.last_updated_by,
        hr.created_at, hr.updated_at,
        p.name AS pet_name, p.species AS pet_species, p.breed_type AS pet_breed_type,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url
      FROM health_records hr
      JOIN pets p ON p.pet_id = hr.pet_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.name ASC`
    );
    return rows;
  },

  async findByPetId(petId: number): Promise<HealthRecordWithPetRow | undefined> {
    const [rows] = await pool.query<HealthRecordWithPetRow[]>(
      `SELECT
        hr.record_id, hr.pet_id, hr.medical_history, hr.vaccination_status,
        hr.heart_rate_bpm, hr.created_by_user_id, hr.last_updated_by,
        hr.created_at, hr.updated_at,
        p.name AS pet_name, p.species AS pet_species, p.breed_type AS pet_breed_type,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url
      FROM health_records hr
      JOIN pets p ON p.pet_id = hr.pet_id
      WHERE hr.pet_id = ?`,
      [petId]
    );
    return rows[0];
  },

  async exists(petId: number): Promise<boolean> {
    const [rows] = await pool.query<HealthRecordWithPetRow[]>(
      'SELECT pet_id FROM health_records WHERE pet_id = ?',
      [petId]
    );
    return rows.length > 0;
  },

  async petExists(petId: number): Promise<boolean> {
    const [rows] = await pool.query<HealthRecordWithPetRow[]>(
      'SELECT pet_id FROM pets WHERE pet_id = ? AND deleted_at IS NULL',
      [petId]
    );
    return rows.length > 0;
  },

  async upsert(petId: number, medicalHistory: string | null, vaccinationStatus: string | null, heartRateBpm: number | null, createdByUserId: number): Promise<void> {
    await pool.query(
      `INSERT INTO health_records (pet_id, medical_history, vaccination_status, heart_rate_bpm, created_by_user_id, last_updated_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         medical_history = VALUES(medical_history),
         vaccination_status = VALUES(vaccination_status),
         heart_rate_bpm = VALUES(heart_rate_bpm),
         last_updated_by = VALUES(last_updated_by)`,
      [petId, medicalHistory, vaccinationStatus, heartRateBpm, createdByUserId, createdByUserId]
    );
  },

  async update(petId: number, input: UpdateHealthRecordInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.medical_history !== undefined) {
      fields.push('medical_history = ?');
      values.push(input.medical_history);
    }
    if (input.vaccination_status !== undefined) {
      fields.push('vaccination_status = ?');
      values.push(input.vaccination_status);
    }
    if (input.heart_rate_bpm !== undefined) {
      fields.push('heart_rate_bpm = ?');
      values.push(input.heart_rate_bpm);
    }
    if (input.last_updated_by !== undefined) {
      fields.push('last_updated_by = ?');
      values.push(input.last_updated_by);
    }

    if (fields.length === 0) return true;

    values.push(petId);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE health_records SET ${fields.join(', ')} WHERE pet_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },
};
