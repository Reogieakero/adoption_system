import bcrypt from "bcryptjs";
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2/promise';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { signAdminToken } from '../utils/jwt';
import { findByEmail } from '../repositories/user.repository';
import { logService } from './log.service';

export interface AdminLoginResult {
  token: string;
  admin: { id: number; email: string };
}

export const adminAuthService = {
  async login(email: string, password: string, ipAddress?: string): Promise<AdminLoginResult> {
    if (!env.adminEmail || !env.adminPasswordHash) {
      throw new AppError(500, 'Admin credentials are not configured');
    }

    if (email !== env.adminEmail) {
      throw new AppError(401, 'Invalid email or password');
    }

    let adminUser = await findByEmail(env.adminEmail);

    if (adminUser) {
      // User exists — compare against the stored hash (supports password changes)
      const passwordMatches = await bcrypt.compare(password, adminUser.password_hash ?? '');
      if (!passwordMatches) {
        throw new AppError(401, 'Invalid email or password');
      }
    } else {
      // First-time login — compare against the env-configured hash
      const passwordMatches = await bcrypt.compare(password, env.adminPasswordHash);
      if (!passwordMatches) {
        throw new AppError(401, 'Invalid email or password');
      }

      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (full_name, email, password_hash, auth_provider, role, status, email_verified)
         VALUES (?, ?, ?, 'local', 'admin', 'active', TRUE)`,
        ['Admin User', env.adminEmail, env.adminPasswordHash]
      );
      adminUser = await findByEmail(env.adminEmail);
    }

    const adminId = adminUser?.user_id ?? 0;

    const token = signAdminToken(adminId, env.adminEmail);

    await logService.logAction({
      userId: adminId,
      action: 'Logged In',
      entityType: 'Authentication',
      description: `Admin login by ${env.adminEmail}`,
      ipAddress,
    });

    return {
      token,
      admin: { id: adminId, email: env.adminEmail },
    };
  },
};
