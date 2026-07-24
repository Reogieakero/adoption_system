import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import {
  CreateElearningModuleInput, UpdateElearningModuleInput, CreateCategoryInput,
  ModuleStatus, ProgressStatus
} from '../types/learningModule.types';
import { ElearningModuleRow, ElearningCategoryRow, ModuleProgressRow } from '../utils/learningModuleMapper';

export const learningModuleRepository = {
  // ── Categories ──────────────────────────────────────────────────────
  async findAllCategories(): Promise<ElearningCategoryRow[]> {
    const [rows] = await pool.query<ElearningCategoryRow[]>(
      'SELECT * FROM elearning_categories ORDER BY order_index ASC'
    );
    return rows;
  },

  async findCategoryById(id: number): Promise<ElearningCategoryRow | undefined> {
    const [rows] = await pool.query<ElearningCategoryRow[]>(
      'SELECT * FROM elearning_categories WHERE category_id = ?',
      [id]
    );
    return rows[0];
  },

  async createCategory(input: CreateCategoryInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO elearning_categories (name, description, order_index) VALUES (?, ?, ?)',
      [input.name, input.description ?? null, input.order_index]
    );
    return result.insertId;
  },

  // ── Modules ─────────────────────────────────────────────────────────
  async findAllModules(): Promise<ElearningModuleRow[]> {
    const [rows] = await pool.query<ElearningModuleRow[]>(
      `SELECT m.*, c.name AS category_name
       FROM elearning_modules m
       LEFT JOIN elearning_categories c ON c.category_id = m.category_id
       ORDER BY m.order_index ASC, m.title ASC`
    );
    return rows;
  },

  async findPublishedModulesWithProgress(residentId: number): Promise<ElearningModuleRow[]> {
    const [rows] = await pool.query<ElearningModuleRow[]>(
      `SELECT m.*, mp.status AS progress_status
       FROM elearning_modules m
       LEFT JOIN module_progress mp ON mp.module_id = m.module_id AND mp.resident_id = ?
       WHERE m.status = 'published'
       ORDER BY m.order_index ASC, m.title ASC`,
      [residentId]
    );
    return rows;
  },

  async findModulesByCategory(categoryId: number): Promise<ElearningModuleRow[]> {
    const [rows] = await pool.query<ElearningModuleRow[]>(
      'SELECT * FROM elearning_modules WHERE category_id = ? ORDER BY order_index ASC',
      [categoryId]
    );
    return rows;
  },

  async findModuleById(id: number): Promise<ElearningModuleRow | undefined> {
    const [rows] = await pool.query<ElearningModuleRow[]>(
      'SELECT * FROM elearning_modules WHERE module_id = ?',
      [id]
    );
    return rows[0];
  },

  async createModule(input: CreateElearningModuleInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO elearning_modules (category_id, title, description, content_body, video_url, cover_image_url, order_index, status, created_by_admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.category_id,
        input.title,
        input.description ?? null,
        input.content_body,
        input.video_url ?? null,
        input.cover_image_url ?? null,
        input.order_index,
        input.status ?? 'draft',
        input.created_by_admin_id,
      ]
    );
    return result.insertId;
  },

  async updateModule(id: number, input: UpdateElearningModuleInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const setField = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (input.category_id !== undefined) setField('category_id', input.category_id);
    if (input.title !== undefined) setField('title', input.title);
    if (input.description !== undefined) setField('description', input.description);
    if (input.content_body !== undefined) setField('content_body', input.content_body);
    if (input.video_url !== undefined) setField('video_url', input.video_url);
    if (input.cover_image_url !== undefined) setField('cover_image_url', input.cover_image_url);
    if (input.order_index !== undefined) setField('order_index', input.order_index);
    if (input.status !== undefined) setField('status', input.status);

    if (fields.length === 0) return true;

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE elearning_modules SET ${fields.join(', ')} WHERE module_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async deleteModule(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM elearning_modules WHERE module_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // ── Progress ────────────────────────────────────────────────────────
  async findCompletedCounts(): Promise<{ module_id: number; completed_count: number }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT module_id, COUNT(*) AS completed_count
       FROM module_progress
       WHERE status = 'completed'
       GROUP BY module_id`
    );
    return (rows as any[]).map((r: any) => ({
      module_id: r.module_id,
      completed_count: Number(r.completed_count),
    }));
  },

  async findProgressByModuleAndResident(moduleId: number, residentId: number): Promise<ModuleProgressRow | undefined> {
    const [rows] = await pool.query<ModuleProgressRow[]>(
      'SELECT * FROM module_progress WHERE module_id = ? AND resident_id = ?',
      [moduleId, residentId]
    );
    return rows[0];
  },

  async upsertProgress(moduleId: number, residentId: number, status: ProgressStatus): Promise<void> {
    const now = new Date();
    await pool.query(
      `INSERT INTO module_progress (module_id, resident_id, status, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         started_at = CASE WHEN VALUES(status) = 'in_progress' AND started_at IS NULL THEN NOW() ELSE started_at END,
         completed_at = CASE WHEN VALUES(status) = 'completed' THEN NOW() ELSE NULL END`,
      [
        moduleId,
        residentId,
        status,
        status === 'in_progress' ? now : null,
        status === 'completed' ? now : null,
      ]
    );
  },
};
