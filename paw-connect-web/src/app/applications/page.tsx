'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { residentFetch } from '@/lib/resident-api';
import type { AdoptionApplication } from '@/types';
import styles from './page.module.css';

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
        <div className={styles.list}>
          {apps.map((app) => (
            <Link key={app.application_id} href={`/applications/${app.application_id}`} className={styles.docCard}>
              <div className={styles.docHeader}>
                {app.pet_photo_url && <img src={app.pet_photo_url} alt={app.pet_name} className={styles.docPhoto} />}
                <div className={styles.docHeaderInfo}>
                  <h2 className={styles.docPetName}>{app.pet_name}</h2>
                  <p className={styles.docSpecies}>{app.pet_species}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles[app.status] || ''}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              <div className={styles.docBody}>
                <div className={styles.docRow}>
                  <span className={styles.docLabel}>Reason for adopting</span>
                  <p className={styles.docValue}>{app.reason_for_adopting || 'Not provided'}</p>
                </div>
                <div className={styles.docRow}>
                  <span className={styles.docLabel}>Living situation</span>
                  <p className={styles.docValue}>{app.living_situation || 'Not provided'}</p>
                </div>
                <div className={styles.docRow}>
                  <span className={styles.docLabel}>Household</span>
                  <p className={styles.docValue}>
                    {app.household_members_count ? `${app.household_members_count} people` : 'Not provided'}
                    &nbsp;&middot;&nbsp;Has other pets: {app.has_other_pets ? 'Yes' : 'No'}
                  </p>
                </div>
                {app.additional_notes && (
                  <div className={styles.docRow}>
                    <span className={styles.docLabel}>Additional notes</span>
                    <p className={styles.docValue}>{app.additional_notes}</p>
                  </div>
                )}
              </div>

              <div className={styles.docFooter}>
                <span className={styles.docDate}>Submitted: {app.submitted_at}</span>
                <ChevronRight size={16} className={styles.docArrow} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
