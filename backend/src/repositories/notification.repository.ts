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
    if (query.recipient_id) {
      conditions.push('recipient_id = ?');
      params.push(query.recipient_id);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT notification_id, recipient_id, type, linked_type, linked_id, message_text, is_read, is_emailed, emailed_at, created_at
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
      'SELECT COUNT(*) as count FROM notifications WHERE is_read = 0'
    );
    return Number(rows[0].count);
  },

  async findById(id: number): Promise<NotificationRow | undefined> {
    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT notification_id, recipient_id, type, linked_type, linked_id, message_text, is_read, is_emailed, emailed_at, created_at
       FROM notifications WHERE notification_id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(input: CreateNotificationInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO notifications (recipient_id, type, linked_type, linked_id, message_text, is_emailed)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.recipient_id,
        input.type,
        input.linked_type ?? null,
        input.linked_id ?? null,
        input.message_text,
        input.is_emailed ?? false,
      ]
    );
    return result.insertId;
  },

  async markAsRead(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async markAllAsRead(): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE notifications SET is_read = 1 WHERE is_read = 0'
    );
    return result.affectedRows;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM notifications WHERE notification_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};
