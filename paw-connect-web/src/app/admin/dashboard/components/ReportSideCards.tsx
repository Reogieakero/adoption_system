'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, CheckCircle, Dog, Cat } from 'lucide-react';
import { createServiceClient } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';
import styles from './ReportSideCards.module.css';

const { request } = createServiceClient('/api/admin/dashboard');

interface ReportSideCard {
  report_id: number;
  species: string;
  photo_url: string;
  location_area: string | null;
  status: string;
  submitted_at: string;
  resident_name: string;
}

interface AdoptionSideCard {
  pet_name: string;
  photo_url: string | null;
  breed_detail: string | null;
  species: string;
  adopter_name: string;
  handover_confirmed_at: string;
}

function ReportCard({ r, idx }: { r: ReportSideCard; idx: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const onError = useCallback(() => setImgFailed(true), []);
  const firstPhoto = r.photo_url?.split(',')[0]?.trim();
  const imgSrc = firstPhoto ? `${API_BASE_URL}${firstPhoto}` : null;
  const showImg = imgSrc && !imgFailed;
  const Icon = r.species === 'cat' ? Cat : Dog;

  return (
    <div key={`report-${idx}`} className={styles.reportSideCard}>
      <div className={styles.sideCardHeader}>
        <div className={styles.headerTextGroup}>
          <span className={styles.sideCardLabel}>
            <ShieldAlert size={12} className={styles.iconReport} />
            LATEST FIELD REPORT
          </span>
          <h3 className={styles.animalName}>{r.resident_name ?? `Report #${r.report_id}`}</h3>
        </div>
        {showImg ? (
          <img src={imgSrc!} alt="" className={styles.avatarImage} onError={onError} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className={styles.animalDetails}>
        <span><strong>Reported:</strong> {r.submitted_at}</span><br />
        <span><strong>Location:</strong> {r.location_area ?? 'Unknown'}</span><br />
        <span><strong>Status:</strong> {r.status.replace('_', ' ')}</span>
      </p>
    </div>
  );
}

function AdoptedCard({ petName, imgSrc, Icon, breed, adopter, completed }: { petName: string; imgSrc: string | null; Icon: typeof Dog | typeof Cat; breed: string | null; adopter: string; completed: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const onError = useCallback(() => setImgFailed(true), []);
  const showImg = imgSrc && !imgFailed;

  return (
    <div className={styles.reportSideCard}>
      <div className={styles.sideCardHeader}>
        <div className={styles.headerTextGroup}>
          <span className={styles.sideCardLabel}>
            <CheckCircle size={12} className={styles.iconAdopted} />
            RECENTLY ADOPTED
          </span>
          <h3 className={styles.animalName}>{petName}</h3>
        </div>
        {showImg ? (
          <img src={imgSrc!} alt="" className={styles.avatarImage} onError={onError} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className={styles.animalDetails}>
        <span><strong>Breed:</strong> {breed ?? petName}</span><br />
        <span><strong>Adopter:</strong> {adopter}</span><br />
        <span><strong>Completed:</strong> {completed}</span>
      </p>
    </div>
  );
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
            <ReportCard key={idx} r={r} idx={idx} />
          ))}
        </div>
      </div>

      <div className={styles.carouselTrackContainer}>
        <div className={`${styles.carouselTrack} ${styles.trackAdopters}`}>
          {duplicatedAdopters.map((a, idx) => {
            const firstPhoto = a.photo_url?.split(',')[0]?.trim();
            const imgSrc = firstPhoto ? `${API_BASE_URL}${firstPhoto}` : null;
            const Icon = a.species === 'cat' ? Cat : Dog;
            return (
              <AdoptedCard key={`adopt-${idx}`} petName={a.pet_name} imgSrc={imgSrc} Icon={Icon} breed={a.breed_detail} adopter={a.adopter_name} completed={a.handover_confirmed_at} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
