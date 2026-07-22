'use client';

import { Check, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { TYPE_LABELS, TYPE_ICONS } from '@/lib/notifications/constants';
import { formatRelativeTime } from '@/lib/utils/format-time';
import type { AppNotification } from '@/types';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const Icon = TYPE_ICONS[notification.type];

  return (
    <li className={`${styles.card} ${!notification.is_read ? styles.cardUnread : ''}`}>
      {!notification.is_read && <span className={styles.unreadDot} />}
      <div className={styles.cardIcon}>
        <Icon size={18} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTopRow}>
          <span className={styles.cardType}>{TYPE_LABELS[notification.type]}</span>
          <span className={styles.cardTime}>{formatRelativeTime(notification.created_at)}</span>
        </div>
        <p className={styles.cardTitle}>{notification.message_text}</p>
      </div>
      <div className={styles.cardActions}>
        {!notification.is_read && (
          <Button
            variant="admin-ghost"
            square
            onClick={() => onMarkAsRead(notification.notification_id)}
            title="Mark as read"
          >
            <Check size={14} />
          </Button>
        )}
        <Button
          variant="admin-danger"
          square
          onClick={() => onDelete(notification.notification_id)}
          title="Delete notification"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </li>
  );
}
