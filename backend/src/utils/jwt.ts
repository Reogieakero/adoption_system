import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signUserToken(userId: number, email: string): string {
  return jwt.sign({ id: userId, email }, env.jwtSecret, { expiresIn: '7d' });
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email, role: 'admin' }, env.jwtSecret, { expiresIn: '12h' });
}
