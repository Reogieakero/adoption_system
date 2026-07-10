import React from 'react';
import styles from './AnimalDetail.module.css';
import { getAnimalById } from '../animalsData';
import TopBar from './components/TopBar';
import PhotoDossier from './components/PhotoDossier';
import RecordSection from './components/RecordSection';
import NotFound from './components/NotFound';

const ANIMALS_INDEX_HREF = '/admin/animals';

// `params` is a Promise in Next.js 15+ and a plain object in Next.js 13/14.
// Awaiting it works either way, so this component doesn't need to know
// which version of Next.js the project is on.
//
// NOTE ON LAYOUT: this page is meant to render standalone, with no admin
// navbar/sidebar. If it currently lives under a route segment that has an
// admin shell layout (e.g. app/admin/layout.tsx), move this route outside
// that segment's tree — e.g. into its own route group such as
// app/(standalone)/admin/animals/[id]/page.tsx — so it does not inherit
// that layout. Next.js layouts always nest, so opting out requires the
// page to live outside the shell layout's folder, not a page-level toggle.
export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const animal = getAnimalById(id);

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
        <TopBar backHref={ANIMALS_INDEX_HREF} />

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
