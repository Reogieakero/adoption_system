'use client';

import Link from 'next/link';
import { Search, ShieldCheck, ClipboardList, BookOpen } from 'lucide-react';
import styles from './QuickActionsStrip.module.css';

const ACTIONS = [
  {
    href: '/animals',
    icon: Search,
    label: 'Browse animals',
    desc: 'Find your perfect match',
  },
  {
    href: '/rescues/report',
    icon: ShieldCheck,
    label: 'Report a rescue',
    desc: 'Help an animal in need',
  },
  {
    href: '/applications',
    icon: ClipboardList,
    label: 'My applications',
    desc: 'Track your adoptions',
  },
  {
    href: '/learning',
    icon: BookOpen,
    label: 'Pet care guides',
    desc: 'Tips & best practices',
  },
];

export default function QuickActionsStrip() {
  return (
    <div className={styles.strip}>
      {ACTIONS.map((action) => (
        <Link key={action.href} href={action.href} className={styles.card}>
          <span className={styles.iconWrap}>
            <action.icon size={20} />
          </span>
          <span className={styles.label}>{action.label}</span>
          <span className={styles.desc}>{action.desc}</span>
        </Link>
      ))}
    </div>
  );
}
