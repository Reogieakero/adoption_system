import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { UserRow } from '../types/user.types';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  verificationCode: string;
  verificationExpires: Date;
}

export interface UpdateUnverifiedUserInput {
  firstName: string;
  lastName: string;
  passwordHash: string;
  verificationCode: string;
  verificationExpires: Date;
}

export interface CreateGoogleUserInput {
  firstName: string;
  lastName: string;
  email: string;
  googleUid: string;
}

export const userRepository = {
  async findByEmail(email: string): Promise<UserRow | undefined> {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findVerificationFieldsByEmail(email: string): Promise<UserRow | undefined> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, is_verified, verification_code, verification_code_expires FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findLoginFieldsByEmail(email: string): Promise<UserRow | undefined> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, first_name, last_name, email, password_hash, is_verified, provider FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findById(id: number): Promise<UserRow | undefined> {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async createUser(input: CreateUserInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (first_name, last_name, email, password_hash, is_verified, verification_code, verification_code_expires)
       VALUES (?, ?, ?, ?, FALSE, ?, ?)`,
      [
        input.firstName,
        input.lastName,
        input.email,
        input.passwordHash,
        input.verificationCode,
        input.verificationExpires,
      ]
    );
    return result.insertId;
  },

  async updateUnverifiedUser(userId: number, input: UpdateUnverifiedUserInput): Promise<void> {
    await pool.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, password_hash = ?, verification_code = ?, verification_code_expires = ?
       WHERE id = ?`,
      [
        input.firstName,
        input.lastName,
        input.passwordHash,
        input.verificationCode,
        input.verificationExpires,
        userId,
      ]
    );
  },

  async markVerified(userId: number): Promise<void> {
    await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_code_expires = NULL WHERE id = ?',
      [userId]
    );
  },

  async updateVerificationCode(
    userId: number,
    code: string,
    expires: Date
  ): Promise<void> {
    await pool.query(
      'UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE id = ?',
      [code, expires, userId]
    );
  },

  async createGoogleUser(input: CreateGoogleUserInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (first_name, last_name, email, provider, google_uid, is_verified)
       VALUES (?, ?, ?, 'google', ?, TRUE)`,
      [input.firstName, input.lastName, input.email, input.googleUid]
    );
    return result.insertId;
  },

  async linkGoogleUid(userId: number, googleUid: string): Promise<void> {
    await pool.query('UPDATE users SET google_uid = ? WHERE id = ?', [googleUid, userId]);
  },
};
