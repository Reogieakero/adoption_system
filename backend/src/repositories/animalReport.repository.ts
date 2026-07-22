import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { CreateAnimalReportInput, ReportStatus, UpdateAnimalReportInput } from '../types/animalReport.types';
import { ReportRow } from '../utils/animalReportMapper';

export const animalReportRepository = {
  async findAll(): Promise<ReportRow[]> {
    const [rows] = await pool.query<ReportRow[]>(
      'SELECT * FROM animal_reports ORDER BY submitted_at DESC'
    );
    return rows;
  },

  async findById(id: number): Promise<ReportRow | undefined> {
    const [rows] = await pool.query<ReportRow[]>(
      'SELECT * FROM animal_reports WHERE report_id = ?',
      [id]
    );
    return rows[0];
  },

  async exists(id: number): Promise<boolean> {
    const [rows] = await pool.query<ReportRow[]>(
      'SELECT report_id FROM animal_reports WHERE report_id = ?',
      [id]
    );
    return rows.length > 0;
  },

  async create(input: CreateAnimalReportInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO animal_reports (resident_id, species, condition_description, photo_url, latitude, longitude, location_area, contact_preference, is_valid_for_heatmap)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.resident_id,
        input.species,
        input.condition_description,
        input.photo_url,
        input.latitude,
        input.longitude,
        input.location_area ?? null,
        input.contact_preference ?? null,
        input.is_valid_for_heatmap ?? true,
      ]
    );
    return result.insertId;
  },

  async updateStatus(id: number, status: ReportStatus, resolutionNotes?: string | null): Promise<boolean> {
    const fields: string[] = ['status = ?'];
    const values: unknown[] = [status];

    if (status === 'resolved') {
      fields.push('resolved_at = NOW()');
    }
    if (resolutionNotes !== undefined) {
      fields.push('resolution_notes = ?');
      values.push(resolutionNotes);
    }

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE animal_reports SET ${fields.join(', ')} WHERE report_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async update(id: number, input: UpdateAnimalReportInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.status !== undefined) {
      fields.push('status = ?');
      values.push(input.status);
      if (input.status === 'resolved') {
        fields.push('resolved_at = NOW()');
      }
    }
    if (input.resolution_notes !== undefined) {
      fields.push('resolution_notes = ?');
      values.push(input.resolution_notes);
    }
    if (input.resolved_at !== undefined) {
      fields.push('resolved_at = ?');
      values.push(input.resolved_at);
    }

    if (fields.length === 0) return true;

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE animal_reports SET ${fields.join(', ')} WHERE report_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },
};
