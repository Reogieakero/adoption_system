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
      router.replace('/admin-login');
    }
  }, [token, router]);

  // Avoid flashing protected content before the auth check resolves
  if (!token) return null;

  // Inside layout.tsx
  return (
    <div className={styles.layout}>
      {/* Navbar is typically fixed, keep it outside the flex container or adjust accordingly */}
      <AdminNavbar />
      
      {/* Sidebar and Page content sit side-by-side */}
      <AdminSidebar />

      <div className={styles.page}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}