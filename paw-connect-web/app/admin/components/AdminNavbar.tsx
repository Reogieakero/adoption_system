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
        <span className={styles.brandMark}>PC</span>
        <span className={styles.brandLabel}>PawConnect</span>
        <span className={styles.divider} />
        <span className={styles.eyebrow}>Admin Console</span>
      </div>

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}