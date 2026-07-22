import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signUserToken(userId: number, email: string): string {
  return jwt.sign({ id: userId, email }, env.jwtSecret, { expiresIn: '7d' });
}

export function signAdminToken(userId: number, email: string): string {
  return jwt.sign({ id: userId, email, role: 'admin' }, env.jwtSecret, { expiresIn: '12h' });
}

export interface PendingGooglePayload {
  email: string;
  googleUid: string;
  firstName: string;
  lastName: string;
}

export function signPendingGoogleToken(payload: PendingGooglePayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '15m' });
}

export function verifyPendingGoogleToken(token: string): PendingGooglePayload {
  return jwt.verify(token, env.jwtSecret) as PendingGooglePayload;
}
