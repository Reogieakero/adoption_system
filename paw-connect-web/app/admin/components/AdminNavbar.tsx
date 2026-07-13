"use client";

import { useRouter } from 'next/navigation';
import styles from './AdminNavbar.module.css';

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

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}