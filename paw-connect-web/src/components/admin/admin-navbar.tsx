"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, BarChart3, History, Settings as SettingsIcon, LogOut, Bell, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';
import Button from '@/components/ui/button';
import type { AppNotification } from '@/types';
import { fetchNotifications, fetchUnreadCount } from '@/services/notifications.api';
import styles from './admin-navbar.module.css';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function AdminNavbar() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch { /* ignore */ }
    try {
      const data = await fetchNotifications({ limit: 5 });
      setRecentNotifications(data.notifications);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem('adminAuthToken');
    router.push('/admin-login');
  }

  async function handleBellClick() {
    setBellOpen((prev) => !prev);
    if (!bellOpen) {
      try {
        const count = await fetchUnreadCount();
        setUnreadCount(count);
      } catch { /* ignore */ }
      try {
        const data = await fetchNotifications({ limit: 5 });
        setRecentNotifications(data.notifications);
      } catch { /* ignore */ }
    }
  }

  async function handleNotificationClick(n: AppNotification) {
    if (!n.is_read) {
      try {
        const { markNotificationRead } = await import('@/services/notifications.api');
        await markNotificationRead(n.notification_id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setRecentNotifications((prev) =>
          prev.map((item) => (item.notification_id === n.notification_id ? { ...item, is_read: true } : item))
        );
      } catch { /* ignore */ }
    }
    setBellOpen(false);
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandLabel}>Paw Patrol</span>
        <span className={styles.divider} />
      </div>

      <div className={styles.actions}>
        <div className={styles.bellWrapper} ref={bellRef}>
          <button
            type="button"
            className={styles.bellBtn}
            onClick={handleBellClick}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className={styles.bellBadge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>

          {bellOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>Notifications</span>
                <Link href="/admin/notifications" className={styles.viewAllLink} onClick={() => setBellOpen(false)}>
                  View all <ExternalLink size={12} />
                </Link>
              </div>
              <div className={styles.notifList}>
                {recentNotifications.length === 0 ? (
                  <div className={styles.notifEmpty}>No notifications yet</div>
                ) : (
                  recentNotifications.map((n) => (
                    <Link
                      key={n.notification_id}
                      href="/admin/notifications"
                      className={`${styles.notifItem} ${!n.is_read ? styles.notifUnread : ''}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className={styles.notifText}>{n.message_text}</div>
                      <div className={styles.notifTime}>{formatTime(n.created_at)}</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.avatarWrapper} ref={profileRef}>
          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User size={18} />
          </button>

          {profileOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem}>
                <ThemeToggle />
              </div>
              <div className={styles.dropdownDivider} />
              <Link href="/admin/logs" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                <History size={15} />
                Logs
              </Link>
              <Link href="/admin/settings" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                <SettingsIcon size={15} />
                Settings
              </Link>
              <div className={styles.dropdownDivider} />
              <div className={styles.dropdownItem}>
                <Button variant="admin-secondary" onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={14} />
                  Log out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}