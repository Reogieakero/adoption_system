'use client';

import type { Animal } from '@/types';
import styles from './AnimalCard.module.css';

interface AnimalCardProps {
  animal: Animal;
  onView: (animal: Animal) => void;
}

function BadgeLabel(animal: Animal): string | null {
  if (animal.adoptionStatus === 'Available' && animal.healthStatus === 'Healthy') return null;
  if (animal.healthStatus === 'Recovering' || animal.healthStatus === 'Under Treatment') return 'Needs care';
  if (animal.adoptionStatus === 'Pending') return 'Pending';
  if (animal.adoptionStatus === 'Adopted') return 'Adopted';
  return null;
}

export default function AnimalCard({ animal, onView }: AnimalCardProps) {
  const badge = BadgeLabel(animal);

  return (
    <button type="button" className={styles.card} onClick={() => onView(animal)}>
      <div className={styles.imageWrap}>
        <img
          src={animal.photo}
          alt={animal.name}
          className={styles.image}
          loading="lazy"
        />
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{animal.name}</h3>
        <p className={styles.meta}>{animal.breed} · {animal.age}</p>
        <p className={styles.location}>{animal.location}</p>
      </div>
    </button>
  );
}
