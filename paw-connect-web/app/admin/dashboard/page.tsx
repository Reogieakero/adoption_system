"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import styles from './dashboard.module.css';

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return sessionStorage.getItem('adminAuthToken');
}

function getServerSnapshot() {
  return null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      router.replace('/admin/admin-login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <AdminNavbar />
      <AdminSidebar />

      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>You&apos;re signed in. Nothing built here yet.</p>
        </main>
      </div>
    </div>
  );
}