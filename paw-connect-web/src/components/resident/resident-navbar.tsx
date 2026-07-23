"use client";

import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Home, PawPrint, ClipboardCheck, Siren, GraduationCap } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';
import Button from '@/components/ui/button';
import styles from './resident-navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Animals', href: '/animals', icon: PawPrint },
  { label: 'Applications', href: '/applications', icon: ClipboardCheck },
  { label: 'Rescues', href: '/rescues', icon: Siren },
  { label: 'Learning', href: '/learning', icon: GraduationCap },
];

export default function ResidentNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    router.push('/login');
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandLabel}>PawConnect</span>
      </div>

      <nav className={styles.nav}>
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <ThemeToggle />
        <div className={styles.avatarWrapper} ref={ref}>
          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => setOpen(!open)}
          >
            <User size={18} />
          </button>

          {open && (
            <div className={styles.dropdown}>
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
