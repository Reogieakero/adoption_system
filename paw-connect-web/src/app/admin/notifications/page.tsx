'use client';

import { useState } from 'react';
import {
  Check,
  Trash2,
} from 'lucide-react';
import Button from '@/components/ui/button';
import styles from './page.module.css';
import { useNotifications } from '@/hooks/admin/use-notifications';
import { TYPE_LABELS, TYPE_ICONS, NOTIFICATION_TABS } from '@/lib/notifications/constants';
import { formatRelativeTime } from '@/lib/utils/format-time';
import type { NotificationType } from '@/types';

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
    { key: 'adoption_status', label: 'Adoptions' },
    { key: 'new_application', label: 'Applications' },
    { key: 'new_message', label: 'Messages' },
    { key: 'new_report', label: 'Reports' },
    { key: 'new_community_listing', label: 'Listings' },
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
          <Button variant="admin-primary" onClick={() => markAllAsRead()}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="admin-ghost"
            active={filter === tab.key}
            onClick={() => handleFilterChange(tab.key)}
          >
            {tab.label}
          </Button>
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
              <li key={n.notification_id} className={`${styles.card} ${!n.is_read ? styles.cardUnread : ''}`}>
                {!n.is_read && <span className={styles.unreadDot} />}
                <div className={styles.cardIcon}>
                  <Icon size={18} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardType}>{TYPE_LABELS[n.type]}</span>
                    <span className={styles.cardTime}>{formatRelativeTime(n.created_at)}</span>
                  </div>
                  <p className={styles.cardTitle}>{n.message_text}</p>
                </div>
                <div className={styles.cardActions}>
                  {!n.is_read && (
                    <Button
                      variant="admin-ghost"
                      square
                      onClick={() => markAsRead(n.notification_id)}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </Button>
                  )}
                  <Button
                    variant="admin-danger"
                    square
                    onClick={() => handleDelete(n.notification_id)}
                    title="Delete notification"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button variant="admin-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <Button variant="admin-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}