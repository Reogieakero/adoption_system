"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';

function subscribe() { return () => {}; }
function getSnapshot() { return sessionStorage.getItem('adminAuthToken'); }
function getServerSnapshot() { return null; }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      router.replace('/admin-login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <main className={styles.main}>{children}</main>
  );
}
