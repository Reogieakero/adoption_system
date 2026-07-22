'use client';

import Button from '@/components/ui/button';
import styles from './NotificationHeader.module.css';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export default function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.subtitle}>
          Updates from adoptions, rescues, messages, and animal health
        </p>
      </div>
      {unreadCount > 0 && (
        <Button variant="admin-primary" onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      )}
    </div>
  );
}
