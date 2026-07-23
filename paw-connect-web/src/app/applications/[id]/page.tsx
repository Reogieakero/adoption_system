'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import { residentFetch } from '@/lib/resident-api';
import type { AdoptionApplication } from '@/types';
import styles from './page.module.css';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<AdoptionApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    residentFetch<{ application: AdoptionApplication }>(`/api/resident/adoptions/${id}`)
      .then((data) => setApp(data.application))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;
  if (!app) return <div className={styles.page}><p className={styles.muted}>Application not found.</p></div>;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => router.push('/applications')}>
        <ChevronLeft size={16} /> My Applications
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          {app.pet_photo_url && <img src={app.pet_photo_url} alt={app.pet_name} className={styles.photo} />}
          <div>
            <h1 className={styles.petName}>{app.pet_name}</h1>
            <p className={styles.meta}>{app.pet_species}</p>
          </div>
        </div>

        <div className={styles.statusBar}>
          Status: <strong>{app.status.replace('_', ' ')}</strong>
        </div>

        <div className={styles.section}>
          <h3>Reason for adopting</h3>
          <p>{app.reason_for_adopting || 'Not provided'}</p>
        </div>

        <div className={styles.section}>
          <h3>Living situation</h3>
          <p>{app.living_situation || 'Not provided'}</p>
        </div>

        <div className={styles.section}>
          <h3>Household</h3>
          <p>{app.household_members_count ? `${app.household_members_count} people` : 'Not provided'}</p>
          <p>Has other pets: {app.has_other_pets ? 'Yes' : 'No'}</p>
        </div>

        {app.rejection_reason && (
          <div className={styles.section}>
            <h3>Notes from shelter</h3>
            <p>{app.rejection_reason}</p>
          </div>
        )}

        <p className={styles.date}>Submitted: {app.submitted_at}</p>

        <Button variant="admin-secondary" onClick={() => router.push(`/animals/${app.pet_id}`)}>
          View Pet
        </Button>
      </div>
    </div>
  );
}
