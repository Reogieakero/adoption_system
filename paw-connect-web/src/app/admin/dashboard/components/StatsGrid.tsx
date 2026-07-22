'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, Siren, HeartPulse, Bell, type LucideIcon } from 'lucide-react';
import { createServiceClient } from '@/lib/api-client';
import styles from './StatsGrid.module.css';

const { request } = createServiceClient('/api/admin/dashboard');

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardCheck, Siren, HeartPulse, Bell,
};

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
}

export default function StatsGrid() {
  const [cards, setCards] = useState<StatCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    request<{ success: true; stats: { label: string; value: string; subtext: string; icon: string }[] }>('/stats')
      .then((data) => {
        setCards(data.stats.map((s) => ({ ...s, icon: ICON_MAP[s.icon] ?? Bell })));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <section className={styles.statsGrid} aria-label="Key Administrative Metrics">
      {cards.map(({ label, value, subtext, icon: Icon }) => (
        <div key={label} className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statIconContainer}><Icon size={16} strokeWidth={2} /></span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statSubtext}>{subtext}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
