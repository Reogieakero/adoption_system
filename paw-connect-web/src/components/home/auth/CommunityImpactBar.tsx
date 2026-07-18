'use client';

import { Heart, Home, ShieldCheck, Users } from 'lucide-react';
import styles from './CommunityImpactBar.module.css';

const STATS = [
  { icon: Heart, value: '1,247', label: 'Pets adopted' },
  { icon: ShieldCheck, value: '583', label: 'Rescues completed' },
  { icon: Home, value: '12', label: 'Partner shelters' },
  { icon: Users, value: '3.2k', label: 'Active members' },
];

export default function CommunityImpactBar() {
  return (
    <section className={styles.bar}>
      {STATS.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.iconWrap}>
            <stat.icon size={18} />
          </span>
          <div>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
