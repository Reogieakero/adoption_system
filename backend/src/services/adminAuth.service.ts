import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { signAdminToken } from '../utils/jwt';

export interface AdminLoginResult {
  token: string;
  admin: { email: string };
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

    const token = signAdminToken(env.adminEmail);

    return {
      token,
      admin: { email: env.adminEmail },
    };
  },
};
