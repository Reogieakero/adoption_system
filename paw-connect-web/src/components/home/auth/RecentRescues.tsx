'use client';

import Link from 'next/link';
import { AlertCircle, MapPin, Clock } from 'lucide-react';
import { INITIAL_DATA } from '@/lib/mock-data';
import styles from './RecentRescues.module.css';

export default function RecentRescues() {
  const cases = INITIAL_DATA.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Rescues needing attention</h2>
        <Link href="/admin/rescues" className={styles.viewAll}>
          View all
        </Link>
      </div>

      <div className={styles.feed}>
        {cases.map((rc) => (
          <Link key={rc.id} href={`/admin/rescues/${rc.id}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={rc.imageUrl} alt={rc.animalType} className={styles.image} loading="lazy" />
              <span className={`${styles.priority} ${styles[rc.priority.toLowerCase() as 'critical' | 'high' | 'medium' | 'low']}`}>
                {rc.priority}
              </span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.animalType}>{rc.animalType}</h3>
              <p className={styles.condition}>{rc.condition}</p>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <MapPin size={12} />
                  {rc.barangay}
                </span>
                <span className={styles.metaItem}>
                  <Clock size={12} />
                  {rc.reportedDate}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
