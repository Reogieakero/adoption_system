import {
    deleteUserById,
    findAllUsersForAdmin,
    findUserByIdForAdmin,
    updateUserStatus,
  } from '../repositories/user.repository';
  import { toAdminUserSummary } from '../utils/userMapper';
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
    status: UserStatus
  ): Promise<AdminUserSummary> {
    const existing = await findUserByIdForAdmin(id);
    if (!existing) {
      throw new UserServiceError(404, 'User not found');
    }
  
    await updateUserStatus(id, status);
    const updated = await findUserByIdForAdmin(id);
    return toAdminUserSummary(updated!);
  }
  
  export async function removeUser(id: number): Promise<void> {
    const existing = await findUserByIdForAdmin(id);
    if (!existing) {
      throw new UserServiceError(404, 'User not found');
    }
    await deleteUserById(id);
  }