"use client";

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/theme-toggle';
import styles from './admin-navbar.module.css';

export default function AdminNavbar() {
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem('adminAuthToken');
    router.push('/admin-login');
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandLabel}>Paw Patrol</span>
        <span className={styles.divider} />
      </div>

      <div className={styles.actions}>
        <ThemeToggle />
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
