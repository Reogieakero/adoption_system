import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import { NotificationType } from '../types/notification.types';

interface NotificationPreferenceRow extends RowDataPacket {
  preference_id: number;
  user_id: number;
  notification_type: NotificationType;
  in_app_enabled: boolean | 0 | 1;
  email_enabled: boolean | 0 | 1;
}

export interface NotificationPreference {
  notification_type: NotificationType;
  in_app_enabled: boolean;
  email_enabled: boolean;
}

export const notificationPreferenceRepository = {
  async findByUserId(userId: number): Promise<NotificationPreference[]> {
    const [rows] = await pool.query<NotificationPreferenceRow[]>(
      'SELECT * FROM notification_preferences WHERE user_id = ?',
      [userId]
    );
    return rows.map((r) => ({
      notification_type: r.notification_type,
      in_app_enabled: Boolean(r.in_app_enabled),
      email_enabled: Boolean(r.email_enabled),
    }));
  },

  async upsert(userId: number, type: NotificationType, inApp: boolean, email: boolean): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO notification_preferences (user_id, notification_type, in_app_enabled, email_enabled)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE in_app_enabled = VALUES(in_app_enabled), email_enabled = VALUES(email_enabled)`,
      [userId, type, inApp, email]
    );
  },

  async setDefaults(userId: number): Promise<void> {
    const types: NotificationType[] = [
      'adoption_status', 'report_status', 'new_message',
      'new_report', 'new_community_listing', 'new_application',
    ];
    for (const type of types) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO notification_preferences (user_id, notification_type, in_app_enabled, email_enabled)
         VALUES (?, ?, TRUE, TRUE)
         ON DUPLICATE KEY UPDATE in_app_enabled = in_app_enabled, email_enabled = email_enabled`,
        [userId, type]
      );
    }
  },
};
