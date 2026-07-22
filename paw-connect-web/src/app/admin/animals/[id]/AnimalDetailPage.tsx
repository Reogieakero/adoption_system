'use client';

import React from 'react';
import styles from './AnimalDetail.module.css';
import { useAnimal } from '@/hooks/admin/use-animals';
import { formatStatus } from '@/lib/format-status';
import TopBar from './components/TopBar';
import PhotoDossier from './components/PhotoDossier';
import RecordSection from './components/RecordSection';
import NotFound from './components/NotFound';

const ANIMALS_INDEX_HREF = '/admin/animals';

export default function AnimalDetailPage({ id }: { id: string }) {
  const { animal, isLoading, error, refetch } = useAnimal(id);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loadingState}>Loading animal record…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.errorState} role="alert">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <NotFound id={id} backHref={ANIMALS_INDEX_HREF} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <TopBar backHref={ANIMALS_INDEX_HREF} animal={animal} />

        <div className={styles.layout}>
          <PhotoDossier animal={animal} />

          <div className={styles.recordRail}>
            <RecordSection
              eyebrow="Record 01"
              title="Identification"
              fields={[
                { label: 'Species', value: formatStatus(animal.species) },
                { label: 'Breed', value: animal.breed_detail ?? animal.breed_type },
                { label: 'Sex', value: formatStatus(animal.sex) },
                { label: 'Estimated Age', value: animal.age_estimate ?? 'Unknown' },
                { label: 'Type', value: animal.source_type === 'shelter' ? 'Shelter' : 'Community' },
              ]}
            />

            <RecordSection
              eyebrow="Record 02"
              title="Status & Health"
              fields={[
                { label: 'Adoption Status', value: formatStatus(animal.status) },
                { label: 'Location', value: animal.location_area ?? 'Unknown' },
              ]}
            />

            <RecordSection
              eyebrow="Record 03"
              title="Timeline"
              fields={[
                { label: 'Created', value: animal.created_at, mono: true },
                { label: 'Last Updated', value: animal.updated_at, mono: true },
                { label: 'Pet ID', value: String(animal.pet_id), mono: true },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
