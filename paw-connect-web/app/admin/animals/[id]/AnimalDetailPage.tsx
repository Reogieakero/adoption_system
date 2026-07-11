'use client';

import React from 'react';
import styles from './AnimalDetail.module.css';
import { useAnimal } from '../../../hooks/admin/useAnimals';
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
        <TopBar backHref={ANIMALS_INDEX_HREF} animal={animal} onUpdated={refetch} />

        <div className={styles.layout}>
          <PhotoDossier animal={animal} />

          <div className={styles.recordRail}>
            <RecordSection
              eyebrow="Record 01"
              title="Identification"
              spine="ocean"
              fields={[
                { label: 'Species', value: animal.species },
                { label: 'Breed', value: animal.breed },
                { label: 'Sex', value: animal.sex },
                { label: 'Estimated Age', value: animal.age },
                { label: 'Size', value: animal.size },
                { label: 'Color / Markings', value: animal.colorMarkings },
              ]}
            />

            <RecordSection
              eyebrow="Record 02"
              title="Status & Health"
              spine="royal"
              fields={[
                { label: 'Rescue Status', value: animal.rescueStatus },
                { label: 'Adoption Status', value: animal.adoptionStatus },
                { label: 'Health Status', value: animal.healthStatus },
                { label: 'Vaccination Status', value: animal.vaccinationStatus },
                {
                  label: 'Heart Rate',
                  value: animal.heartRate,
                  mono: true,
                  showPulse: animal.heartRate !== 'No Data',
                },
              ]}
            />

            <RecordSection
              eyebrow="Record 03"
              title="Location & Timeline"
              spine="navy"
              fields={[
                { label: 'Current Shelter / Location', value: animal.location },
                { label: 'Date Rescued', value: animal.dateRescued, mono: true },
                { label: 'Date Added', value: animal.dateAdded, mono: true },
                { label: 'Last Updated', value: animal.lastUpdated, mono: true },
                { label: 'Animal ID', value: animal.id, mono: true },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}