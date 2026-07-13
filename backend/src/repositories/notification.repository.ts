import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import { CreateNotificationInput, NotificationListQuery } from '../types/notification.types';
import { NotificationRow } from '../utils/notificationMapper';

interface CountRow extends RowDataPacket {
  count: number;
}

export const notificationRepository = {
  async findAll(query: NotificationListQuery): Promise<{ rows: NotificationRow[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.type) {
      conditions.push('type = ?');
      params.push(query.type);
    }
    if (query.unreadOnly) {
      conditions.push('is_read = 0');
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT id, type, title, message, entity_type, entity_id, priority, is_read, read_at, created_by, link, created_at
       FROM notifications
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) as count FROM notifications ${whereClause}`,
      params
    );

    return { rows, total: Number(countRows[0].count) };
  },

  async countUnread(): Promise<number> {
    const [rows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) as count FROM notifications WHERE is_read = 0`
    );
    return Number(rows[0].count);
  },

  async findById(id: number): Promise<NotificationRow | undefined> {
    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT id, type, title, message, entity_type, entity_id, priority, is_read, read_at, created_by, link, created_at
       FROM notifications WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(input: CreateNotificationInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO notifications (type, title, message, entity_type, entity_id, priority, created_by, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.type,
        input.title,
        input.message,
        input.entityType ?? null,
        input.entityId ?? null,
        input.priority ?? 'normal',
        input.createdBy ?? null,
        input.link ?? null,
      ]
    );
    return result.insertId;
  },

  async markAsRead(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  async markAllAsRead(): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE is_read = 0`
    );
    return result.affectedRows;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(`DELETE FROM notifications WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },
};