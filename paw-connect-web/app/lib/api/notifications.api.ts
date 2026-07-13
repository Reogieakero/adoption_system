import { API_BASE_URL } from '../config';
import type { AppNotification, NotificationType } from '../../admin/notifications/types';

const NOTIFICATIONS_BASE = `${API_BASE_URL}/api/admin/notifications`;

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  success: true;
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

class NotificationApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'NotificationApiError';
    this.status = status;
  }
}

function getAdminToken(): string {
  const token = sessionStorage.getItem('adminAuthToken');
  if (!token) {
    throw new NotificationApiError(401, 'Admin session expired. Please sign in again.');
  }
  return token;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${NOTIFICATIONS_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new NotificationApiError(
      res.status,
      typeof data.message === 'string' ? data.message : 'Request failed'
    );
  }

  return data as T;
}

export async function fetchNotifications(
  params: NotificationListParams = {}
): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.type) query.set('type', params.type);
  if (params.unreadOnly) query.set('unreadOnly', 'true');

  const qs = query.toString();
  return adminRequest<NotificationListResponse>(qs ? `?${qs}` : '');
}

export async function fetchUnreadCount(): Promise<number> {
  const data = await adminRequest<{ success: true; count: number }>('/unread-count');
  return data.count;
}

export async function markNotificationRead(id: number): Promise<AppNotification> {
  const data = await adminRequest<{ success: true; notification: AppNotification }>(
    `/${id}/read`,
    { method: 'PATCH' }
  );
  return data.notification;
}

export async function markAllNotificationsRead(): Promise<number> {
  const data = await adminRequest<{ success: true; updated: number }>('/read-all', {
    method: 'PATCH',
  });
  return data.updated;
}

export async function deleteNotification(id: number): Promise<void> {
  await adminRequest<{ success: true }>(`/${id}`, { method: 'DELETE' });
}