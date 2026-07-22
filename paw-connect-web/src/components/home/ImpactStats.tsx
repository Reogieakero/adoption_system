'use client';

import { useState, useEffect } from 'react';
import styles from './ImpactStats.module.css';
import { API_BASE_URL } from '@/lib/config';
import type { ImpactStat } from '@/types';

export default function ImpactStats() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/content/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <section className={styles.section}><div className={styles.grid}></div></section>;
  }

  if (error || stats.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <span className={styles.value}>
              {stat.value.toLocaleString()}
              {stat.suffix}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
