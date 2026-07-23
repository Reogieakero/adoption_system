import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import { AdoptionStatus } from '../types/adoption.types';
import { AdoptionListRow } from '../utils/adoptionMapper';

export const adoptionRepository = {
  async findAll(): Promise<AdoptionListRow[]> {
    const [rows] = await pool.query<AdoptionListRow[]>(
      `SELECT
        aa.application_id, aa.pet_id, aa.resident_id, aa.status,
        aa.rejection_reason, aa.reason_for_adopting, aa.living_situation,
        aa.has_other_pets, aa.household_members_count, aa.additional_notes,
        aa.submitted_at, aa.decided_at, aa.decided_by_admin_id, aa.handover_confirmed_at,
        aa.updated_at,
        p.name AS pet_name, p.species AS pet_species,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url,
        u.full_name AS resident_name, u.email AS resident_email
      FROM adoption_applications aa
      JOIN pets p ON p.pet_id = aa.pet_id
      JOIN users u ON u.user_id = aa.resident_id
      ORDER BY aa.submitted_at DESC`
    );
    return rows;
  },

  async findById(id: number): Promise<AdoptionListRow | undefined> {
    const [rows] = await pool.query<AdoptionListRow[]>(
      `SELECT
        aa.application_id, aa.pet_id, aa.resident_id, aa.status,
        aa.rejection_reason, aa.reason_for_adopting, aa.living_situation,
        aa.has_other_pets, aa.household_members_count, aa.additional_notes,
        aa.submitted_at, aa.decided_at, aa.decided_by_admin_id, aa.handover_confirmed_at,
        aa.updated_at,
        p.name AS pet_name, p.species AS pet_species,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url,
        u.full_name AS resident_name, u.email AS resident_email
      FROM adoption_applications aa
      JOIN pets p ON p.pet_id = aa.pet_id
      JOIN users u ON u.user_id = aa.resident_id
      WHERE aa.application_id = ?`,
      [id]
    );
    return rows[0];
  },

  async exists(id: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT application_id FROM adoption_applications WHERE application_id = ?',
      [id]
    );
    return rows.length > 0;
  },

  async findPendingByPetId(petId: number): Promise<AdoptionListRow[]> {
    const [rows] = await pool.query<AdoptionListRow[]>(
      `SELECT
        aa.application_id, aa.pet_id, aa.resident_id, aa.status,
        aa.rejection_reason, aa.reason_for_adopting, aa.living_situation,
        aa.has_other_pets, aa.household_members_count, aa.additional_notes,
        aa.submitted_at, aa.decided_at, aa.decided_by_admin_id, aa.handover_confirmed_at,
        aa.updated_at,
        p.name AS pet_name, p.species AS pet_species,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url,
        u.full_name AS resident_name, u.email AS resident_email
      FROM adoption_applications aa
      JOIN pets p ON p.pet_id = aa.pet_id
      JOIN users u ON u.user_id = aa.resident_id
      WHERE aa.pet_id = ? AND aa.status = 'pending_review'`,
      [petId]
    );
    return rows;
  },

  async create(input: { pet_id: number; resident_id: number; reason_for_adopting?: string | null; living_situation?: string | null; has_other_pets?: boolean | null; household_members_count?: number | null; additional_notes?: string | null }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO adoption_applications (pet_id, resident_id, reason_for_adopting, living_situation, has_other_pets, household_members_count, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.pet_id,
        input.resident_id,
        input.reason_for_adopting ?? null,
        input.living_situation ?? null,
        input.has_other_pets ?? null,
        input.household_members_count ?? null,
        input.additional_notes ?? null,
      ]
    );
    return result.insertId;
  },

  async findByResidentId(residentId: number): Promise<AdoptionListRow[]> {
    const [rows] = await pool.query<AdoptionListRow[]>(
      `SELECT
        aa.application_id, aa.pet_id, aa.resident_id, aa.status,
        aa.rejection_reason, aa.reason_for_adopting, aa.living_situation,
        aa.has_other_pets, aa.household_members_count, aa.additional_notes,
        aa.submitted_at, aa.decided_at, aa.decided_by_admin_id, aa.handover_confirmed_at,
        aa.updated_at,
        p.name AS pet_name, p.species AS pet_species,
        (SELECT pp.file_url FROM pet_photos pp WHERE pp.pet_id = p.pet_id AND pp.is_primary = 1 LIMIT 1) AS pet_photo_url,
        u.full_name AS resident_name, u.email AS resident_email
      FROM adoption_applications aa
      JOIN pets p ON p.pet_id = aa.pet_id
      JOIN users u ON u.user_id = aa.resident_id
      WHERE aa.resident_id = ?
      ORDER BY aa.submitted_at DESC`,
      [residentId]
    );
    return rows;
  },

  async updateStatus(id: number, status: AdoptionStatus, decidedByAdminId?: number, rejectionReason?: string | null): Promise<boolean> {
    const fields = ['status = ?'];
    const values: unknown[] = [status];

    if (decidedByAdminId !== undefined) {
      fields.push('decided_by_admin_id = ?');
      values.push(decidedByAdminId);
      fields.push('decided_at = NOW()');
    }
    if (rejectionReason !== undefined) {
      fields.push('rejection_reason = ?');
      values.push(rejectionReason);
    }

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE adoption_applications SET ${fields.join(', ')} WHERE application_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async updatePetStatus(petId: number, status: string): Promise<void> {
    await pool.query('UPDATE pets SET status = ? WHERE pet_id = ?', [status, petId]);
  },
};
