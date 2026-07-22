'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, type LucideIcon } from 'lucide-react';
import { createServiceClient } from '@/lib/api-client';
import styles from './ReportSideCards.module.css';

const { request } = createServiceClient('/api/admin/dashboard');

interface ReportSideCard {
  name: string;
  photo_url: string;
  species: string;
  location_area: string | null;
  status: string;
}

interface AdoptionSideCard {
  pet_name: string;
  photo_url: string | null;
  breed_detail: string | null;
  adopter_name: string;
  handover_confirmed_at: string;
}

export default function ReportSideCards() {
  const [reports, setReports] = useState<ReportSideCard[]>([]);
  const [adoptions, setAdoptions] = useState<AdoptionSideCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      request<{ success: true; reports: ReportSideCard[] }>('/reports/recent'),
      request<{ success: true; adoptions: AdoptionSideCard[] }>('/adoptions/recent'),
    ])
      .then(([r, a]) => { setReports(r.reports); setAdoptions(a.adoptions); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const duplicatedReports = [...reports, ...reports];
  const duplicatedAdopters = [...adoptions, ...adoptions];

  return (
    <div className={styles.sideCardsColumn}>
      <div className={styles.carouselTrackContainer}>
        <div className={`${styles.carouselTrack} ${styles.trackReports}`}>
          {duplicatedReports.map((r, idx) => (
            <div key={`report-${idx}`} className={styles.reportSideCard}>
              <div className={styles.sideCardHeader}>
                <div className={styles.headerTextGroup}>
                  <span className={styles.sideCardLabel}>
                    <ShieldAlert size={12} className={styles.iconReport} />
                    LATEST FIELD REPORT
                  </span>
                  <h3 className={styles.animalName}>{r.name ?? `${r.species} #${idx}`}</h3>
                </div>
                <img src={r.photo_url} alt="" className={styles.avatarImage} />
              </div>
              <p className={styles.animalDetails}>
                <span><strong>Species:</strong> {r.species}</span><br />
                <span><strong>Location:</strong> {r.location_area ?? 'Unknown'}</span><br />
                <span><strong>Status:</strong> {r.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.carouselTrackContainer}>
        <div className={`${styles.carouselTrack} ${styles.trackAdopters}`}>
          {duplicatedAdopters.map((a, idx) => (
            <div key={`adopt-${idx}`} className={styles.reportSideCard}>
              <div className={styles.sideCardHeader}>
                <div className={styles.headerTextGroup}>
                  <span className={styles.sideCardLabel}>
                    <CheckCircle size={12} className={styles.iconAdopted} />
                    RECENTLY ADOPTED
                  </span>
                  <h3 className={styles.animalName}>{a.pet_name}</h3>
                </div>
                <img src={a.photo_url ?? ''} alt="" className={styles.avatarImage} />
              </div>
              <p className={styles.animalDetails}>
                <span><strong>Breed/Type:</strong> {a.breed_detail ?? a.pet_name}</span><br />
                <span><strong>Adopter:</strong> {a.adopter_name}</span><br />
                <span><strong>Completed:</strong> {a.handover_confirmed_at}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
