import styles from './ImpactStats.module.css';
import { MOCK_IMPACT_STATS } from '@/lib/mock-data/impact-stats';

export default function ImpactStats() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {MOCK_IMPACT_STATS.map((stat) => (
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
