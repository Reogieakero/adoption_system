import { createServiceClient } from '@/lib/api-client';
import type { AdminUserSummary, UserStatus } from '@/types';

const { request } = createServiceClient('/api/admin/users');

export async function fetchUsers(): Promise<AdminUserSummary[]> {
  const data = await request<{ success: true; users: AdminUserSummary[] }>('');
  return data.users;
}

export async function updateUserStatus(
  id: string,
  status: UserStatus
): Promise<AdminUserSummary> {
  const data = await request<{ success: true; user: AdminUserSummary }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  await request<{ success: true }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
