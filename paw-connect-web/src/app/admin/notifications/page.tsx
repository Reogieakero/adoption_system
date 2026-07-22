'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useNotifications } from '@/hooks/admin/use-notifications';
import type { NotificationType } from '@/types';
import NotificationHeader from './components/NotificationHeader';
import NotificationTabs from './components/NotificationTabs';
import type { Tab } from './components/NotificationTabs';
import NotificationList from './components/NotificationList';
import Pagination from './components/Pagination';

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

  const tabs: Tab[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
    { key: 'adoption_status', label: 'Adoptions' },
    { key: 'new_application', label: 'Applications' },
    { key: 'new_message', label: 'Messages' },
    { key: 'new_report', label: 'Reports' },
    { key: 'new_community_listing', label: 'Listings' },
  ];

  function handleFilterChange(key: string) {
    setFilter(key as FilterTab);
    setPage(1);
  }

  function handleDelete(id: number) {
    remove(id);
  }

  return (
    <div className={styles.container}>
      <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={() => markAllAsRead()} />
      <NotificationTabs tabs={tabs} activeKey={filter} onChange={handleFilterChange} />
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        error={error}
        onMarkAsRead={(id) => markAsRead(id)}
        onDelete={handleDelete}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
