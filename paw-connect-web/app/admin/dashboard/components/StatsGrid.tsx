import {
  ClipboardCheck,
  Siren,
  HeartPulse,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import styles from './StatsGrid.module.css';

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
}

const ATTENTION_CARDS: StatCard[] = [
  { label: 'Pending Adoptions', value: '37', subtext: 'Awaiting coordinator review', icon: ClipboardCheck },
  { label: 'Rescue Reports', value: '12', subtext: 'Active dispatch cases', icon: Siren },
  { label: 'Health Alerts', value: '5', subtext: 'Critical medical updates', icon: HeartPulse },
  { label: 'Notifications', value: '18', subtext: 'Unread administrative updates', icon: Bell },
];

export default function StatsGrid() {
  return (
    <section className={styles.statsGrid} aria-label="Key Administrative Metrics">
      {ATTENTION_CARDS.map(({ label, value, subtext, icon: Icon }) => (
        <div key={label} className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statIconContainer}>
              <Icon size={16} strokeWidth={2} />
            </span>
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