'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppNotification, NotificationType } from '@/types';
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notifications.api';

interface UseNotificationsOptions {
  type?: NotificationType;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

interface UseNotificationsResult {
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(options);
      setNotifications(data.notifications);
      setTotal(data.total);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setNotifications([]);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.type, options.unreadOnly, options.page, options.limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const markAsRead = useCallback(async (id: number) => {
    const updated = await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.notification_id === id ? updated : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
  }, []);

  return {
    notifications,
    total,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    remove,
  };
}
