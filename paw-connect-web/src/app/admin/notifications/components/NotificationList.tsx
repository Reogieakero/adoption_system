'use client';

import type { AppNotification } from '@/types';
import NotificationCard from './NotificationCard';
import styles from './NotificationList.module.css';

interface NotificationListProps {
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationList({
  notifications,
  isLoading,
  error,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (error) {
    return <div className={styles.errorBanner}>{error}</div>;
  }

  if (isLoading) {
    return <div className={styles.stateMessage}>Loading notifications…</div>;
  }

  if (notifications.length === 0) {
    return <div className={styles.stateMessage}>No notifications here.</div>;
  }

  return (
    <ul className={styles.list}>
      {notifications.map((n) => (
        <NotificationCard
          key={n.notification_id}
          notification={n}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
