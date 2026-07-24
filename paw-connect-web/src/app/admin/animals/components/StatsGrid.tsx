import React from 'react';
import { PawPrint, CheckCircle2, Siren, HeartPulse, Home, Ban } from 'lucide-react';
import styles from './StatsGrid.module.css';

export interface StatItem {
  label: string;
  value: number | string;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Total Animals': <PawPrint size={16} strokeWidth={2} />,
  'Healthy': <CheckCircle2 size={16} strokeWidth={2} />,
  'Recovering': <HeartPulse size={16} strokeWidth={2} />,
  'Under Treatment': <Siren size={16} strokeWidth={2} />,
  'Critical': <Ban size={16} strokeWidth={2} />,
};

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div className={styles.statCard} key={stat.label}>
          <div className={styles.statHeader}>
            <p className={styles.statLabel}>{stat.label}</p>
            <span className={styles.statIconContainer}>
              {ICON_MAP[stat.label] || <PawPrint size={16} strokeWidth={2} />}
            </span>
          </div>
          <div className={styles.statBody}>
            <span className={styles.statValue} style={stat.color ? { color: stat.color } : undefined}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
