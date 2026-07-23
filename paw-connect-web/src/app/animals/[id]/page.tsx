'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import { publicFetch } from '@/lib/resident-api';
import type { Pet } from '@/types';
import styles from './page.module.css';

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [animal, setAnimal] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicFetch<{ pet: Pet }>(`/api/public/pets/${id}`)
      .then((data) => setAnimal(data.pet))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;
  if (!animal) return <div className={styles.page}><p className={styles.muted}>Animal not found.</p></div>;

  const hr = animal.health_record;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => router.back()}>
        <ChevronLeft size={16} /> Back
      </button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.imageWrap}>
            {animal.primary_photo_url ? (
              <img src={animal.primary_photo_url} alt={animal.name} className={styles.mainImage} />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
            {animal.description && (
              <div className={styles.imageOverlay}>
                <p className={styles.overlayText}>{animal.description}</p>
              </div>
            )}
          </div>
          {animal.photos && animal.photos.length > 1 && (
            <div className={styles.thumbs}>
              {animal.photos.map((p) => (
                <img key={p.photo_id} src={p.file_url} alt="" className={styles.thumb} />
              ))}
            </div>
          )}
          {hr?.medical_history && (
            <div className={styles.healthBlock}>
              <p className={styles.healthValue}>{hr.medical_history}</p>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{animal.name}</h1>
          <div className={styles.infoContent}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Source</span>
              <span className={styles.detailValue}>{animal.source_type}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Species</span>
              <span className={styles.detailValue}>{animal.species}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Breed</span>
              <span className={styles.detailValue}>{animal.breed_detail ?? animal.breed_type}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Age</span>
              <span className={styles.detailValue}>{animal.age_estimate ?? 'Unknown'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Sex</span>
              <span className={styles.detailValue}>{animal.sex}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>{animal.location_area ?? 'Unknown'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Vaccination</span>
              <span className={styles.detailValue}>{hr?.vaccination_status ?? 'Unknown'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>{animal.status.replace('_', ' ')}</span>
            </div>
          </div>

          {animal.status === 'available' && (
          <Button
            variant="admin-primary"
            className={styles.applyBtn}
            onClick={() => router.push(`/animals/${animal.pet_id}/apply`)}
          >
            Apply to Adopt
          </Button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
