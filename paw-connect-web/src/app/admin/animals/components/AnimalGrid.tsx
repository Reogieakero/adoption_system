import React from 'react';
import styles from './AnimalGrid.module.css';
import AnimalCard from './AnimalCard';
import EmptyState from './EmptyState';
import type { Pet } from '@/types';

interface AnimalGridProps {
  animals: Pet[];
  getHref: (animal: Pet) => string;
  emptyMessage?: string;
}

export default function AnimalGrid({ animals, getHref, emptyMessage }: AnimalGridProps) {
  if (animals.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={styles.gridContainer}>
      {animals.map((animal) => (
        <AnimalCard key={animal.pet_id} animal={animal} href={getHref(animal)} />
      ))}
    </div>
  );
}
