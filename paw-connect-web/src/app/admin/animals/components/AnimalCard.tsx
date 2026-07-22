import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import styles from './AnimalCard.module.css';
import { resolvePhotoUrl } from '@/services/resolve-photo-url';
import { formatStatus } from '@/lib/format-status';
import type { Pet } from '@/types';

interface AnimalCardProps {
  animal: Pet;
  href: string;
}

function adoptionBadgeClass(status: string) {
  switch (status) {
    case 'available':
      return styles.bgTeal;
    case 'pending':
      return styles.bgOrange;
    case 'adopted':
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
  const router = useRouter()
  const photoSrc = resolvePhotoUrl(animal.primary_photo_url ?? '');

  return (
    <Link href={href} className={styles.cardLink}>
      <div className={styles.animalCard}>
        <div className={styles.imageWrapper}>
          {photoSrc ? (
            <img src={photoSrc} alt={animal.name} className={styles.cardPhoto} />
          ) : (
            <div className={styles.cardPhotoPlaceholder}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          )}
          <div className={styles.overlayInfo}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>{animal.name}</h3>
              <span className={styles.cardSpecies}>{formatStatus(animal.species)}</span>
            </div>
            <div className={styles.cardId}>{animal.pet_id}</div>

            <div className={styles.hoverContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Breed:</span>
                <span className={styles.detailValue}>{animal.breed_detail ?? animal.breed_type}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Age/Sex:</span>
                <span className={styles.detailValue}>{animal.age_estimate} / {formatStatus(animal.sex)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Health:</span>
                <span className={styles.detailValue}>Healthy</span>
              </div>
            </div>

            <div className={styles.cardBadge}>
              <span className={`${styles.badge} ${adoptionBadgeClass(animal.status)}`}>
                {formatStatus(animal.status)}
              </span>
              <span className={`${styles.badge} ${healthBadgeClass('Healthy')}`}>
                Healthy
              </span>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="admin-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/admin/health/${animal.pet_id}/log`)
                }}
              >
                Log Vitals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
