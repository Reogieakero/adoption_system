import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { PriorityType, RescueCaseRow, RescueStage, RescueTimelineStepRow } from '../types/rescue.types';

const LIST_QUERY = `SELECT * FROM rescue_cases ORDER BY reported_at DESC, id DESC`;
const BY_ID_QUERY = `SELECT * FROM rescue_cases WHERE id = ?`;
const TIMELINE_BY_CASE_QUERY = `
  SELECT * FROM rescue_case_timeline_steps WHERE rescue_case_id = ? ORDER BY step_order ASC
`;
const ALL_TIMELINE_QUERY = `
  SELECT * FROM rescue_case_timeline_steps ORDER BY rescue_case_id, step_order ASC
`;

export const rescueRepository = {
  async findAll(): Promise<{
    cases: RescueCaseRow[];
    timelineByCase: Map<string, RescueTimelineStepRow[]>;
  }> {
    const [cases] = await pool.query<RescueCaseRow[]>(LIST_QUERY);
    const [steps] = await pool.query<RescueTimelineStepRow[]>(ALL_TIMELINE_QUERY);

    const timelineByCase = new Map<string, RescueTimelineStepRow[]>();
    for (const step of steps) {
      const list = timelineByCase.get(step.rescue_case_id) ?? [];
      list.push(step);
      timelineByCase.set(step.rescue_case_id, list);
    }

    return { cases, timelineByCase };
  },

  async findById(
    id: string
  ): Promise<{ case: RescueCaseRow | undefined; timeline: RescueTimelineStepRow[] }> {
    const [rows] = await pool.query<RescueCaseRow[]>(BY_ID_QUERY, [id]);
    const [timeline] = await pool.query<RescueTimelineStepRow[]>(TIMELINE_BY_CASE_QUERY, [id]);
    return { case: rows[0], timeline };
  },

  async exists(id: string): Promise<boolean> {
    const [rows] = await pool.query<RescueCaseRow[]>('SELECT id FROM rescue_cases WHERE id = ?', [id]);
    return rows.length > 0;
  },

  async updateStage(id: string, stage: RescueStage): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rescue_cases SET stage = ? WHERE id = ?',
      [stage, id]
    );
    return result.affectedRows > 0;
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rescue_cases SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  },

  async assignRescuer(
    id: string,
    assignedRescuer: string,
    rescueTeam: string,
    eta: string | null
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE rescue_cases
       SET assigned_rescuer = ?, rescue_team = ?, eta = ?, assigned_at = NOW()
       WHERE id = ?`,
      [assignedRescuer, rescueTeam, eta, id]
    );
    return result.affectedRows > 0;
  },

  async updatePriority(id: string, priority: PriorityType): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rescue_cases SET priority = ? WHERE id = ?',
      [priority, id]
    );
    return result.affectedRows > 0;
  },

  async updateInternalNotes(id: string, internalNotes: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rescue_cases SET internal_notes = ? WHERE id = ?',
      [internalNotes, id]
    );
    return result.affectedRows > 0;
  },

  async upsertTimelineStep(
    rescueCaseId: string,
    stepOrder: number,
    title: string,
    timestamp: string,
    isActive: boolean
  ): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO rescue_case_timeline_steps (rescue_case_id, step_order, title, step_timestamp, is_active)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         step_timestamp = VALUES(step_timestamp),
         is_active = VALUES(is_active)`,
      [rescueCaseId, stepOrder, title, timestamp, isActive]
    );
  },
};