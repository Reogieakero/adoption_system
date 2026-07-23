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
  user_name: string | null;
  user_role: string | null;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export const logRepository = {
  async findLogs(params: {
    page: number;
    limit: number;
    search?: string;
    module?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ rows: ActivityLogRow[]; total: number }> {
    const { page, limit, search, module, dateFrom, dateTo } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];

    if (search) {
      conditions.push('(al.action LIKE ? OR u.full_name LIKE ? OR CAST(al.log_id AS CHAR) LIKE ?)');
      const like = `%${search}%`;
      bindings.push(like, like, like);
    }

    if (module && module !== 'All') {
      conditions.push('al.entity_type = ?');
      bindings.push(module);
    }

    if (dateFrom) {
      conditions.push('al.created_at >= ?');
      bindings.push(dateFrom);
    }

    if (dateTo) {
      conditions.push('al.created_at <= ?');
      bindings.push(`${dateTo} 23:59:59`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM activity_logs al LEFT JOIN users u ON u.user_id = al.user_id ${whereClause}`,
      bindings
    );
    const total = countRows[0].total;

    const [rows] = await pool.query<ActivityLogRow[]>(
      `SELECT al.*, u.full_name AS user_name, u.role AS user_role
       FROM activity_logs al
       LEFT JOIN users u ON u.user_id = al.user_id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [...bindings, limit, offset]
    );

    return { rows, total };
  },

  async create(data: {
    userId: number | null;
    action: string;
    entityType: string;
    entityId: number | null;
    description: string | null;
    ipAddress: string | null;
  }): Promise<void> {
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.userId, data.action, data.entityType, data.entityId, data.description, data.ipAddress]
    );
  },

  async getSummary(): Promise<{ total: number; today: number }> {
    const [totalRows] = await pool.query<CountRow[]>('SELECT COUNT(*) AS total FROM activity_logs');
    const [todayRows] = await pool.query<CountRow[]>(
      "SELECT COUNT(*) AS total FROM activity_logs WHERE DATE(created_at) = CURDATE()"
    );
    return { total: totalRows[0].total, today: todayRows[0].total };
  },
};
