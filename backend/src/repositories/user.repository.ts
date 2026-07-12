import  pool  from '../config/db'; // TODO: adjust to your actual db pool import path
import { AdminUserRow, UserStatus } from '../types/user.types';

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