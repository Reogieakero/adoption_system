'use client';

import { useEffect, useState } from 'react';
import { Heart, Home, ShieldCheck, Users } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import type { ImpactStat } from '@/types';
import styles from './CommunityImpactBar.module.css';

const ICON_MAP: Record<string, typeof Heart> = {
  'Pets Adopted': Heart,
  'Rescues Completed': ShieldCheck,
  'Partner Shelters': Home,
  'Active Members': Users,
};

export default function CommunityImpactBar() {
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/content/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className={styles.bar}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.label] ?? Heart;
        return (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.iconWrap}>
              <Icon size={18} />
            </span>
            <div>
              <span className={styles.value}>{stat.value}{stat.suffix ?? ''}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
