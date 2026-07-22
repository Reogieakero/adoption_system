import React from 'react';
import styles from './PhotoDossier.module.css';
import { resolvePhotoUrl } from '@/services/resolve-photo-url';
import { formatStatus } from '@/lib/format-status';
import type { Pet } from '@/types';

interface PhotoDossierProps {
  animal: Pet;
}

function adoptionBadgeClass(status: string) {
  switch (status) {
    case 'available':
      return styles.bgOcean;
    case 'pending':
      return styles.bgRoyal;
    case 'adopted':
      return styles.bgNavy;
    default:
      return styles.bgSlate;
  }
}

export default function PhotoDossier({ animal }: PhotoDossierProps) {
  const photoSrc = resolvePhotoUrl(animal.primary_photo_url ?? '');

  return (
    <div className={styles.photoPane}>
      <div className={styles.photoCard}>
        <div className={styles.photoFrame}>
          {photoSrc ? (
            <img src={photoSrc} alt={animal.name} className={styles.heroPhoto} />
          ) : (
            <div className={styles.photoPlaceholder}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          )}
        </div>
        <div className={styles.idStamp}>{animal.pet_id}</div>
      </div>

      <div className={styles.nameBlock}>
        <h1 className={styles.heroName}>{animal.name}</h1>
        <div className={styles.heroMeta}>
          <span>{formatStatus(animal.species)} &middot; {animal.breed_detail ?? animal.breed_type}</span>
          <span className={styles.heroId}>&middot; {animal.pet_id}</span>
        </div>
      </div>

      <div className={styles.heroBadges}>
        <span className={`${styles.badge} ${adoptionBadgeClass(animal.status)}`}>
          {formatStatus(animal.status)}
        </span>
      </div>

      <p className={styles.bio}>{animal.description}</p>
    </div>
  );
}
