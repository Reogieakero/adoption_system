import {
  deleteUserById,
  findAllUsersForAdmin,
  findUserByIdForAdmin,
  updateUserStatus,
} from '../repositories/user.repository';
import { toAdminUserSummary } from '../utils/userMapper';
import { logService } from './log.service';
import { AdminUserSummary, UserStatus } from '../types/user.types';

export class UserServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'UserServiceError';
    this.status = status;
  }
}

export async function getAllUsers(): Promise<AdminUserSummary[]> {
  const rows = await findAllUsersForAdmin();
  return rows.map(toAdminUserSummary);
}

export async function setUserStatus(
  id: number,
  status: UserStatus,
  adminId?: number
): Promise<AdminUserSummary> {
  const existing = await findUserByIdForAdmin(id);
  if (!existing) {
    throw new UserServiceError(404, 'User not found');
  }

  await updateUserStatus(id, status);

  await logService.logAction({
    userId: adminId ?? null,
    action: 'Updated Status',
    entityType: 'User',
    entityId: id,
    description: `User "${existing.full_name}" status changed to "${status}"`,
  });

  const updated = await findUserByIdForAdmin(id);
  return toAdminUserSummary(updated!);
}

export async function removeUser(id: number, adminId?: number): Promise<void> {
  const existing = await findUserByIdForAdmin(id);
  if (!existing) {
    throw new UserServiceError(404, 'User not found');
  }
  await deleteUserById(id);

  await logService.logAction({
    userId: adminId ?? null,
    action: 'Deleted',
    entityType: 'User',
    entityId: id,
    description: `User "${existing.full_name}" permanently deleted`,
  });
}
