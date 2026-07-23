'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ResidentNavbar from './resident-navbar';
import styles from './resident-layout.module.css';

interface ResidentLayoutProps {
  children: ReactNode;
}

export default function ResidentLayout({ children }: ResidentLayoutProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    setAuthed(true);
  }, [router]);

  if (!authed) return null;

  return (
    <div className={styles.layoutWrapper}>
      <ResidentNavbar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
