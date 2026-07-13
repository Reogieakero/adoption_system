'use client';

import { useState } from 'react';
import {
  PawPrint,
  AlertTriangle,
  MessageSquare,
  HeartPulse,
  UserPlus,
  Settings,
  Check,
  Trash2,
} from 'lucide-react';
import styles from './Notifications.module.css';
import { useNotifications } from '../../hooks/admin/useNotifications';
import type { NotificationType } from './types';

const TYPE_LABELS: Record<NotificationType, string> = {
  adoption_application: 'Adoption',
  rescue_case: 'Rescue',
  message: 'Message',
  health_alert: 'Health',
  user_registration: 'New User',
  system: 'System',
};

const TYPE_ICONS: Record<NotificationType, React.ComponentType<{ size?: number; className?: string }>> = {
  adoption_application: PawPrint,
  rescue_case: AlertTriangle,
  message: MessageSquare,
  health_alert: HeartPulse,
  user_registration: UserPlus,
  system: Settings,
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

type FilterTab = 'all' | 'unread' | NotificationType;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { notifications, total, unreadCount, isLoading, error, markAsRead, markAllAsRead, remove } =
    useNotifications({
      unreadOnly: filter === 'unread',
      type: filter !== 'all' && filter !== 'unread' ? filter : undefined,
      page,
      limit,
    });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
    { key: 'adoption_application', label: 'Adoptions' },
    { key: 'rescue_case', label: 'Rescues' },
    { key: 'message', label: 'Messages' },
    { key: 'health_alert', label: 'Health' },
    { key: 'system', label: 'System' },
  ];

  function handleFilterChange(next: FilterTab) {
    setFilter(next);
    setPage(1);
  }

  function handleDelete(id: number) {
    remove(id);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>
            Updates from adoptions, rescues, messages, and animal health
          </p>
        </div>
        {unreadCount > 0 && (
          <button className={styles.buttonPrimary} onClick={() => markAllAsRead()}>
            Mark all as read
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${filter === tab.key ? styles.tabActive : ''}`}
            onClick={() => handleFilterChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {isLoading ? (
        <div className={styles.stateMessage}>Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className={styles.stateMessage}>No notifications here.</div>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type];
            return (
              <li key={n.id} className={`${styles.card} ${!n.isRead ? styles.cardUnread : ''}`}>
                {!n.isRead && <span className={styles.unreadDot} />}
                <div className={styles.cardIcon}>
                  <Icon size={18} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardType}>{TYPE_LABELS[n.type]}</span>
                    <span className={styles.cardTime}>{formatRelativeTime(n.createdAt)}</span>
                  </div>
                  <p className={styles.cardTitle}>{n.title}</p>
                  <p className={styles.cardMessage}>{n.message}</p>
                  {(n.priority === 'high' || n.priority === 'urgent') && (
                    <span className={`${styles.priorityBadge} ${styles[`priority-${n.priority}`]}`}>
                      {n.priority}
                    </span>
                  )}
                </div>
                <div className={styles.cardActions}>
                  {!n.isRead && (
                    <button
                      className={styles.buttonIcon}
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    className={styles.buttonIconDanger}
                    onClick={() => handleDelete(n.id)}
                    title="Delete notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={styles.buttonOutline}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={styles.buttonOutline}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}