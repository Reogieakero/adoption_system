import pool from '../config/db';
import { AdminUserRow, UserRow, UserStatus } from '../types/user.types';
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
    `${ADMIN_USER_LIST_QUERY.replace('ORDER BY u.created_at DESC', 'WHERE u.id = ?')}`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateUserStatus(id: number, status: UserStatus): Promise<void> {
  await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteUserById(id: number): Promise<void> {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
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
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] ?? null;
}

export async function findLoginFieldsByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, email, password_hash, is_verified, first_name, last_name, provider FROM users WHERE email = ?',
    [email]
  );
  return rows[0] ?? null;
}

export async function findVerificationFieldsByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, email, is_verified, verification_code, verification_code_expires FROM users WHERE email = ?',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  verificationCode: string;
  verificationExpires: Date;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (first_name, last_name, email, password_hash, verification_code, verification_code_expires, provider, role, status)
     VALUES (?, ?, ?, ?, ?, ?, 'local', 'Citizen', 'Pending')`,
    [params.firstName, params.lastName, params.email, params.passwordHash, params.verificationCode, params.verificationExpires]
  );
  return result.insertId;
}

export async function updateUnverifiedUser(
  id: number,
  params: {
    firstName: string;
    lastName: string;
    passwordHash: string;
    verificationCode: string;
    verificationExpires: Date;
  }
): Promise<void> {
  await pool.query(
    `UPDATE users SET first_name = ?, last_name = ?, password_hash = ?, verification_code = ?, verification_code_expires = ? WHERE id = ?`,
    [params.firstName, params.lastName, params.passwordHash, params.verificationCode, params.verificationExpires, id]
  );
}

export async function markVerified(id: number): Promise<void> {
  await pool.query('UPDATE users SET is_verified = TRUE, status = ? WHERE id = ?', ['Active', id]);
}

export async function updateVerificationCode(id: number, code: string, expires: Date): Promise<void> {
  await pool.query(
    'UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE id = ?',
    [code, expires, id]
  );
}

export async function createGoogleUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  googleUid: string;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (first_name, last_name, email, google_uid, provider, is_verified, role, status)
     VALUES (?, ?, ?, ?, 'google', TRUE, 'Citizen', 'Active')`,
    [params.firstName, params.lastName, params.email, params.googleUid]
  );
  return result.insertId;
}

export async function createGoogleUserWithAgreement(params: {
  firstName: string;
  lastName: string;
  email: string;
  googleUid: string;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (first_name, last_name, email, google_uid, provider, is_verified, role, status, agreed_terms, agreed_terms_at)
     VALUES (?, ?, ?, ?, 'google', TRUE, 'Citizen', 'Active', TRUE, NOW())`,
    [params.firstName, params.lastName, params.email, params.googleUid]
  );
  return result.insertId;
}

export async function linkGoogleUid(id: number, googleUid: string): Promise<void> {
  await pool.query('UPDATE users SET google_uid = ?, provider = ? WHERE id = ?', [googleUid, 'google', id]);
}

export const userRepository = {
  findByEmail,
  findById,
  findLoginFieldsByEmail,
  findVerificationFieldsByEmail,
  createUser,
  updateUnverifiedUser,
  markVerified,
  updateVerificationCode,
  createGoogleUser,
  createGoogleUserWithAgreement,
  linkGoogleUid,
  findAllUsersForAdmin,
  findUserByIdForAdmin,
  updateUserStatus,
  deleteUserById,
};
