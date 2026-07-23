'use client';

import { useEffect, useState } from 'react';
import { Heart, PawPrint, ShieldCheck, ClipboardList } from 'lucide-react';
import { publicFetch } from '@/lib/resident-api';
import type { ImpactStat } from '@/types';
import styles from './StatsCards.module.css';

const ICON_MAP: Record<string, typeof Heart> = {
  'Pets Adopted': Heart,
  'Available Pets': PawPrint,
  'Rescues Completed': ShieldCheck,
  'Applications': ClipboardList,
};

export default function StatsCards() {
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    publicFetch<{ stats: ImpactStat[] }>('/api/public/content/stats')
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.label] ?? Heart;
        return (
          <div key={stat.label} className={styles.card}>
            <span className={styles.iconWrap}>
              <Icon size={20} />
            </span>
            <span className={styles.value}>{stat.value}{stat.suffix ?? ''}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
