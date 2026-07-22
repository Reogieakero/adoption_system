import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

interface ActivityLogRow extends RowDataPacket {
  log_id: number;
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  description: string | null;
  ip_address: string | null;
  created_at: Date;
}

export async function findAllLogs(): Promise<ActivityLogRow[]> {
  const [rows] = await pool.query<ActivityLogRow[]>(
    `SELECT al.*, u.full_name AS user_name, u.role AS user_role
     FROM activity_logs al
     LEFT JOIN users u ON u.user_id = al.user_id
     ORDER BY al.created_at DESC
     LIMIT 200`
  );
  return rows;
}

export const logRepository = { findAllLogs };
