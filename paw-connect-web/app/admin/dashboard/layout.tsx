"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import styles from './layout.module.css';

function subscribe() { return () => {}; }
function getSnapshot() { return sessionStorage.getItem('adminAuthToken'); }
function getServerSnapshot() { return null; }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      router.replace('/admin/admin-login');
    }
  }, [token, router]);

  // Avoid flashing protected content before the auth check resolves
  if (!token) return null;

  return (
    <div className={styles.layout}>
      <AdminNavbar />
      <AdminSidebar />

      <div className={styles.page}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}