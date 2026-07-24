'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Dog, Cat, MapPin } from 'lucide-react';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/lib/format-status';
import { residentFetch } from '@/lib/resident-api';
import { API_BASE_URL } from '@/lib/config';
import type { AnimalReport } from '@/types';
import styles from './page.module.css';

const STATUS_VARIANT: Record<string, 'warning' | 'info' | 'default' | 'success'> = {
  submitted: 'warning',
  in_progress: 'info',
  dispatched: 'default',
  resolved: 'success',
};

export default function MyRescuesPage() {
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className={styles.grid}>
          {reports.map((r) => (
            <div key={r.report_id} className={styles.card}>
              <div className={styles.photoWrap}>
                <div className={styles.noPhoto}>
                  {r.species === 'cat' ? <Cat size={24} /> : <Dog size={24} />}
                </div>
                {r.photo_url && (
                  <img
                    src={`${API_BASE_URL}${r.photo_url.split(',')[0]}`}
                    alt=""
                    className={styles.photo}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <span className={styles.badgePosition}>
                  <Badge variant={STATUS_VARIANT[r.status] ?? 'default'}>{formatStatus(r.status)}</Badge>
                </span>
              </div>
              <div className={styles.body}>
                <h2 className={styles.name}>{r.species}</h2>
                <p className={styles.location}><MapPin size={12} /> {r.location_area || 'Unknown'}</p>
                <p className={styles.condition}>{r.condition_description}</p>
                <div className={styles.footer}>
                  <span className={styles.date}>{r.submitted_at}</span>
                  <ChevronRight size={14} className={styles.arrow} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
