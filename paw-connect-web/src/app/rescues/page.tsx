'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Dog, Cat } from 'lucide-react';
import Button from '@/components/ui/button';
import { residentFetch } from '@/lib/resident-api';
import { API_BASE_URL } from '@/lib/config';
import type { AnimalReport } from '@/types';
import styles from './page.module.css';

export default function MyRescuesPage() {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const failedImages = useRef(new Set<number>());

  useEffect(() => {
    residentFetch<{ reports: AnimalReport[] }>('/api/resident/reports')
      .then((data) => setReports(data.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Rescue Reports</h1>
        <Link href="/rescues/report">
          <Button variant="admin-primary">Report a rescue</Button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className={styles.muted}>You haven&apos;t submitted any rescue reports yet.</p>
      ) : (
        <div className={styles.list}>
          {reports.map((r) => {
            const showIcon = !r.photo_url || failedImages.current.has(r.report_id);

            return (
              <div key={r.report_id} className={styles.docCard}>
                <div className={styles.docHeader}>
                  {showIcon ? (
                    <div className={styles.noPhoto}>
                      {r.species === 'cat' ? <Cat size={20} /> : <Dog size={20} />}
                    </div>
                  ) : (
                    <img
                      src={`${API_BASE_URL}${r.photo_url.split(',')[0]}`}
                      alt=""
                      className={styles.docPhoto}
                      onError={() => failedImages.current.add(r.report_id)}
                    />
                  )}
                  <div className={styles.docHeaderInfo}>
                    <h2 className={styles.docPetName}>{r.species}</h2>
                    <p className={styles.docSpecies}>{r.location_area || 'Unknown location'}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[r.status] || ''}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>

                <div className={styles.docBody}>
                  <div className={styles.docRow}>
                    <span className={styles.docLabel}>Condition</span>
                    <p className={styles.docValue}>{r.condition_description}</p>
                  </div>
                  <div className={styles.docRow}>
                    <span className={styles.docLabel}>Location</span>
                    <p className={styles.docValue}>{r.latitude.toFixed(6)}, {r.longitude.toFixed(6)}</p>
                  </div>
                  {r.contact_preference && (
                    <div className={styles.docRow}>
                      <span className={styles.docLabel}>Contact</span>
                      <p className={styles.docValue}>{r.contact_preference}</p>
                    </div>
                  )}
                </div>

                <div className={styles.docFooter}>
                  <span className={styles.docDate}>Submitted: {r.submitted_at}</span>
                  <ChevronRight size={16} className={styles.docArrow} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
