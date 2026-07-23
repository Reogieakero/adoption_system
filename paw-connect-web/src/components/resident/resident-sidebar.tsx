"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PawPrint,
  ClipboardCheck,
  Siren,
  GraduationCap,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import styles from './resident-sidebar.module.css';

interface NavItem {
  label: string;
  fullLabel: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', fullLabel: 'Dashboard', href: '/home', icon: Home },
  { label: 'Animals', fullLabel: 'Browse Animals', href: '/animals', icon: PawPrint },
  { label: 'Applications', fullLabel: 'My Applications', href: '/applications', icon: ClipboardCheck },
  { label: 'Rescues', fullLabel: 'Report Rescue', href: '/rescues/report', icon: Siren },
  { label: 'Learning', fullLabel: 'Pet Care Guides', href: '/learning', icon: GraduationCap },
];

export default function ResidentSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, fullLabel, href, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={fullLabel}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={18} strokeWidth={2} className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
