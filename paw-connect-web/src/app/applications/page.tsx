'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/lib/format-status';
import { residentFetch } from '@/lib/resident-api';
import type { AdoptionApplication } from '@/types';
import styles from './page.module.css';

const STATUS_VARIANT: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
  pending_review: 'warning',
  approved: 'success',
  rejected: 'danger',
  pet_unavailable: 'default',
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    residentFetch<{ applications: AdoptionApplication[] }>('/api/resident/adoptions')
      .then((data) => setApps(data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Applications</h1>

      {apps.length === 0 ? (
        <p className={styles.muted}>You haven&apos;t submitted any adoption applications yet.</p>
      ) : (
        <div className={styles.grid}>
          {apps.map((app) => (
            <Link key={app.application_id} href={`/applications/${app.application_id}`} className={styles.card}>
              <div className={styles.photoWrap}>
                {app.pet_photo_url ? (
                  <img src={app.pet_photo_url} alt={app.pet_name} className={styles.photo} />
                ) : (
                  <div className={styles.noPhoto} />
                )}
                <span className={styles.badgePosition}>
                  <Badge variant={STATUS_VARIANT[app.status] ?? 'default'}>{formatStatus(app.status)}</Badge>
                </span>
              </div>
              <div className={styles.body}>
                <h2 className={styles.name}>{app.pet_name}</h2>
                <p className={styles.species}>{app.pet_species}</p>
                <p className={styles.reason}>{app.reason_for_adopting || 'No reason provided'}</p>
                <div className={styles.meta}>
                  <span>{app.living_situation}</span>
                  <span>&middot;</span>
                  <span>{app.household_members_count || '?'} people</span>
                </div>
                <div className={styles.footer}>
                  <span className={styles.date}>{app.submitted_at}</span>
                  <ChevronRight size={14} className={styles.arrow} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
