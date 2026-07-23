"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  PawPrint,
  ClipboardCheck,
  Siren,
  HeartPulse,
  Map,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import styles from './admin-sidebar.module.css';

interface NavItem {
  label: string;
  fullLabel: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Management',
    items: [
      { label: 'Dashboard', fullLabel: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', fullLabel: 'User Management', href: '/admin/user', icon: Users },
      { label: 'Animals', fullLabel: 'Animal Records', href: '/admin/animals', icon: PawPrint },
      { label: 'Adoptions', fullLabel: 'Adoption Requests', href: '/admin/adoptions', icon: ClipboardCheck },
      { label: 'Rescues', fullLabel: 'Rescue Reports', href: '/admin/rescues', icon: Siren },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Health', fullLabel: 'Health Monitoring', href: '/admin/health', icon: HeartPulse },
      { label: 'Heatmap', fullLabel: 'Heatmap & Mapping', href: '/admin/heatmap', icon: Map },
    ],
  },
  {
    title: 'Education',
    items: [
      { label: 'Learning', fullLabel: 'E-learning Management', href: '/admin/learning', icon: GraduationCap },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          {NAV_SECTIONS.map((section, i) => (
            <div key={section.title} className={styles.section}>
              {i > 0 && <hr className={styles.divider} />}
              {section.items.map(({ label, fullLabel, href, icon: Icon }) => {
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
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
