import { API_BASE_URL } from '../config';

export type UserRole = 'Administrator' | 'Rescuer' | 'Adopter' | 'Citizen';
export type UserStatusType = 'Active' | 'Pending' | 'Suspended';

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  status: UserStatusType;
  dateRegistered: string;
  lastLogin: string;
  initials: string;
  address: string | null;
  adoptionApps: number;
  rescueReports: number;
  animalsPosted: number;
  completedModules: number;
}

const USERS_BASE = `${API_BASE_URL}/api/admin/users`;

class UsersApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'UsersApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new UsersApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${USERS_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new UsersApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

export async function fetchUsers(): Promise<AdminUserSummary[]> {
  const data = await adminRequest<{ success: true; users: AdminUserSummary[] }>('');
  return data.users;
}

export async function updateUserStatus(
  id: string,
  status: UserStatusType
): Promise<AdminUserSummary> {
  const data = await adminRequest<{ success: true; user: AdminUserSummary }>(
    `/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  await adminRequest<{ success: true }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}