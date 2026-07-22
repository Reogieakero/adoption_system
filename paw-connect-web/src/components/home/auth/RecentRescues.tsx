'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, MapPin, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import type { AnimalReport } from '@/types';
import styles from './RecentRescues.module.css';

export default function RecentRescues() {
  const [cases, setCases] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/reports/recent`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setCases(data.reports);
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
    return <section className={styles.section}><div className={styles.header}><h2 className={styles.title}>Rescues needing attention</h2></div></section>;
  }

  if (error || cases.length === 0) {
    return null;
  }

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
          <Link key={rc.report_id} href={`/admin/rescues/${rc.report_id}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={rc.photo_url} alt={rc.species} className={styles.image} loading="lazy" />
              <span className={`${styles.priority} ${styles.critical}`}>
                {rc.status}
              </span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.animalType}>{rc.species}</h3>
              <p className={styles.condition}>{rc.condition_description}</p>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <MapPin size={12} />
                  {rc.location_area}
                </span>
                <span className={styles.metaItem}>
                  <Clock size={12} />
                  {rc.submitted_at}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
