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
  BarChart3,
  Bell,
  MessageSquare,
  GraduationCap,
  Settings,
  History,
  type LucideIcon,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface NavItem {
  label: string;
  fullLabel: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', fullLabel: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', fullLabel: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Clinics', fullLabel: 'Clinic Management', href: '/admin/clinics', icon: Building2 },
  { label: 'Animals', fullLabel: 'Animal Records', href: '/admin/animals', icon: PawPrint },
  { label: 'Adoptions', fullLabel: 'Adoption Requests', href: '/admin/adoptions', icon: ClipboardCheck },
  { label: 'Rescues', fullLabel: 'Rescue Reports', href: '/admin/rescues', icon: Siren },
  { label: 'Health', fullLabel: 'Health Monitoring', href: '/admin/health', icon: HeartPulse },
  { label: 'Heatmap', fullLabel: 'Heatmap & Mapping', href: '/admin/heatmap', icon: Map },
  { label: 'Analytics', fullLabel: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Notifications', fullLabel: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Messaging', fullLabel: 'Messaging', href: '/admin/messages', icon: MessageSquare },
  { label: 'Learning', fullLabel: 'E-learning Management', href: '/admin/e-learning', icon: GraduationCap },
  { label: 'Settings', fullLabel: 'System Settings', href: '/admin/settings', icon: Settings },
  { label: 'Logs', fullLabel: 'Activity Logs', href: '/admin/activity-logs', icon: History },
];

export default function AdminSidebar() {
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