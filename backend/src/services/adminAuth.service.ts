import bcrypt from 'bcrypt';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2/promise';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { signAdminToken } from '../utils/jwt';
import { findByEmail } from '../repositories/user.repository';

export interface AdminLoginResult {
  token: string;
  admin: { id: number; email: string };
}

export const adminAuthService = {
  async login(email: string, password: string): Promise<AdminLoginResult> {
    if (!env.adminEmail || !env.adminPasswordHash) {
      throw new AppError(500, 'Admin credentials are not configured');
    }

    if (email !== env.adminEmail) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, env.adminPasswordHash);
    if (!passwordMatches) {
      throw new AppError(401, 'Invalid email or password');
    }

    let adminUser = await findByEmail(env.adminEmail);

    if (!adminUser) {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (full_name, email, password_hash, auth_provider, role, status, email_verified)
         VALUES (?, ?, ?, 'local', 'admin', 'active', TRUE)`,
        ['Admin User', env.adminEmail, env.adminPasswordHash]
      );
      adminUser = await findByEmail(env.adminEmail);
    }

    const adminId = adminUser?.user_id ?? 0;

    const token = signAdminToken(adminId, env.adminEmail);

    return {
      token,
      admin: { id: adminId, email: env.adminEmail },
    };
  },
};
