import pool from '../config/db';
import { AdminUserRow, UserRow, UserStatus, AuthProvider } from '../types/user.types';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const ADMIN_USER_LIST_QUERY = `
  SELECT * FROM users u
  ORDER BY u.created_at DESC
`;

export async function findAllUsersForAdmin(): Promise<AdminUserRow[]> {
  const [rows] = await pool.query<AdminUserRow[]>(ADMIN_USER_LIST_QUERY);
  return rows;
}

export async function findUserByIdForAdmin(id: number): Promise<AdminUserRow | null> {
  const [rows] = await pool.query<AdminUserRow[]>(
    `${ADMIN_USER_LIST_QUERY.replace('ORDER BY u.created_at DESC', 'WHERE u.user_id = ?')}`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateUserStatus(id: number, status: UserStatus): Promise<void> {
  await pool.query('UPDATE users SET status = ? WHERE user_id = ?', [status, id]);
}

export async function deleteUserById(id: number): Promise<void> {
  await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
}

// ─── Auth-related queries ────────────────────────────────────────────

export async function findByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] ?? null;
}

export async function findById(id: number): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT * FROM users WHERE user_id = ?',
    [id]
  );
  return rows[0] ?? null;
}

export async function findLoginFieldsByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT user_id, email, password_hash, email_verified, full_name, auth_provider FROM users WHERE email = ?',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(params: {
  fullName: string;
  email: string;
  passwordHash: string;
  verificationCode: string;
  verificationExpires: Date;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (full_name, email, password_hash, auth_provider, role, status)
     VALUES (?, ?, ?, 'local', 'resident', 'pending_verification')`,
    [params.fullName, params.email, params.passwordHash]
  );
  return result.insertId;
}

export async function createVerificationCode(userId: number, code: string, purpose: 'registration' | 'password_reset', expiresAt: Date): Promise<void> {
  await pool.query(
    `INSERT INTO email_verification_codes (user_id, code, purpose, expires_at)
     VALUES (?, ?, ?, ?)`,
    [userId, code, purpose, expiresAt]
  );
}

export async function findValidVerificationCode(userId: number, code: string, purpose: 'registration' | 'password_reset'): Promise<RowDataPacket | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM email_verification_codes
     WHERE user_id = ? AND code = ? AND purpose = ? AND is_used = 0 AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [userId, code, purpose]
  );
  return rows[0] ?? null;
}

export async function markVerificationCodeUsed(verificationId: number): Promise<void> {
  await pool.query(
    'UPDATE email_verification_codes SET is_used = 1 WHERE verification_id = ?',
    [verificationId]
  );
}

export async function markVerified(id: number): Promise<void> {
  await pool.query(
    'UPDATE users SET email_verified = TRUE, status = ? WHERE user_id = ?',
    ['active', id]
  );
}

export async function createGoogleUser(params: {
  fullName: string;
  email: string;
  googleId: string;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (full_name, email, google_id, auth_provider, email_verified, role, status)
     VALUES (?, ?, ?, 'google', TRUE, 'resident', 'active')`,
    [params.fullName, params.email, params.googleId]
  );
  return result.insertId;
}

export async function createGoogleUserWithAgreement(params: {
  fullName: string;
  email: string;
  googleId: string;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (full_name, email, google_id, auth_provider, email_verified, role, status)
     VALUES (?, ?, ?, 'google', TRUE, 'resident', 'active')`,
    [params.fullName, params.email, params.googleId]
  );
  return result.insertId;
}

export async function linkGoogleUid(id: number, googleId: string): Promise<void> {
  await pool.query(
    'UPDATE users SET google_id = ?, auth_provider = ?, google_linked_at = NOW() WHERE user_id = ?',
    [googleId, 'google', id]
  );
}

export const userRepository = {
  findByEmail,
  findById,
  findLoginFieldsByEmail,
  createUser,
  markVerified,
  createGoogleUser,
  createGoogleUserWithAgreement,
  linkGoogleUid,
  findAllUsersForAdmin,
  findUserByIdForAdmin,
  updateUserStatus,
  deleteUserById,
  createVerificationCode,
  findValidVerificationCode,
  markVerificationCodeUsed,
};
