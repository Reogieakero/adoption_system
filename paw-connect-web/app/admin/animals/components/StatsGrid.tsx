import React from 'react';
import styles from './StatsGrid.module.css';

export interface StatItem {
  label: string;
  value: number | string;
  /** Optional CSS color value (e.g. 'var(--ocean)') for the number. */
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div className={styles.statCard} key={stat.label}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={styles.statValue} style={stat.color ? { color: stat.color } : undefined}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
