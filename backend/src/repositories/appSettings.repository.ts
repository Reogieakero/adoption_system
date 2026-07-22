import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';

interface AppSettingRow extends RowDataPacket {
  setting_key: string;
  setting_value: string;
}

export const appSettingsRepository = {
  async getAll(): Promise<Record<string, string>> {
    const [rows] = await pool.query<AppSettingRow[]>(
      'SELECT setting_key, setting_value FROM app_settings'
    );
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.setting_key] = r.setting_value;
    }
    return map;
  },

  async set(key: string, value: string): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [key, value]
    );
  },

  async setMany(entries: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(entries)) {
      await this.set(key, value);
    }
  },
};
