import { createServiceClient } from '@/lib/api-client';
import type { AppNotification, NotificationType, NotificationListResponse } from '@/types';

const { request } = createServiceClient('/api/admin/notifications');

export async function fetchNotifications(
  params: { page?: number; limit?: number; type?: NotificationType; unreadOnly?: boolean } = {}
): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.type) query.set('type', params.type);
  if (params.unreadOnly) query.set('unreadOnly', 'true');

  const qs = query.toString();
  return request<NotificationListResponse>(qs ? `?${qs}` : '');
}

export async function fetchUnreadCount(): Promise<number> {
  const data = await request<{ success: true; count: number }>('/unread-count');
  return data.count;
}

export async function markNotificationRead(id: number): Promise<AppNotification> {
  const data = await request<{ success: true; notification: AppNotification }>(
    `/${id}/read`,
    { method: 'PATCH' }
  );
  return data.notification;
}

export async function markAllNotificationsRead(): Promise<number> {
  const data = await request<{ success: true; updated: number }>('/read-all', {
    method: 'PATCH',
  });
  return data.updated;
}

export async function deleteNotification(id: number): Promise<void> {
  await request<{ success: true }>(`/${id}`, { method: 'DELETE' });
}
