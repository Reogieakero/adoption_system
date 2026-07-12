import React from 'react';
import Link from 'next/link';
import styles from './AnimalCard.module.css';
import { resolvePhotoUrl } from '../../../lib/api/resolvePhotoUrl';

export interface AnimalCardData {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: string;
  photo: string;
  bio: string;
  healthStatus: string;
  adoptionStatus: string;
}

interface AnimalCardProps {
  animal: AnimalCardData;
  href: string;
}

function adoptionBadgeClass(status: string) {
  switch (status) {
    case 'Available':
      return styles.bgTeal;
    case 'Pending':
      return styles.bgOrange;
    case 'Adopted':
      return styles.bgPrimary;
    default:
      return styles.bgSlate;
  }
}

function healthBadgeClass(status: string) {
  switch (status) {
    case 'Healthy':
      return styles.bgTeal;
    case 'Recovering':
      return styles.bgOrange;
    case 'Under Treatment':
      return styles.bgPrimary;
    case 'Critical':
      return styles.bgWhite;
    default:
      return styles.bgSlate;
  }
}

export default function AnimalCard({ animal, href }: AnimalCardProps) {
  const photoSrc = resolvePhotoUrl(animal.photo);

  return (
    <Link href={href} className={styles.cardLink}>
      <div className={styles.animalCard}>
        <div className={styles.imageWrapper}>
          {photoSrc ? (
            <img src={photoSrc} alt={animal.name} className={styles.cardPhoto} />
          ) : (
            <div
              className={styles.cardPhoto}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e2e8f0',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              No photo
            </div>
          )}
          <div className={styles.overlayInfo}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>{animal.name}</h3>
              <span className={styles.cardSpecies}>{animal.species}</span>
            </div>
            <div className={styles.cardId}>{animal.id}</div>

            <div className={styles.hoverContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Breed:</span>
                <span className={styles.detailValue}>{animal.breed}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Age/Sex:</span>
                <span className={styles.detailValue}>{animal.age} / {animal.sex}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Health:</span>
                <span className={styles.detailValue}>{animal.healthStatus}</span>
              </div>
            </div>

            <div className={styles.cardBadge}>
              <span className={`${styles.badge} ${adoptionBadgeClass(animal.adoptionStatus)}`}>
                {animal.adoptionStatus}
              </span>
              <span className={`${styles.badge} ${healthBadgeClass(animal.healthStatus)}`}>
                {animal.healthStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}