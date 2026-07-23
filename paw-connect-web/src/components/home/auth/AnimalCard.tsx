'use client';

import type { Pet } from '@/types';
import styles from './AnimalCard.module.css';

interface AnimalCardProps {
  animal: Pet;
  onView: (animal: Pet) => void;
}

function BadgeLabel(animal: Pet): string | null {
  if (animal.status === 'available') return null;
  if (animal.status === 'pending') return 'Pending';
  if (animal.status === 'adopted') return 'Adopted';
  if (animal.status === 'rejected') return 'Rejected';
  return null;
}

export default function AnimalCard({ animal, onView }: AnimalCardProps) {
  const badge = BadgeLabel(animal);

  return (
    <button type="button" className={styles.card} onClick={() => onView(animal)}>
      <div className={styles.imageWrap}>
        {animal.primary_photo_url ? (
          <img
            src={animal.primary_photo_url}
            alt={animal.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.image} />
        )}
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{animal.name}</h3>
        <p className={styles.meta}>{(animal.breed_detail ?? animal.breed_type)} · {animal.age_estimate}</p>
        <p className={styles.location}>{animal.location_area}</p>
      </div>
    </button>
  );
}
