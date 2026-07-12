import React from 'react';
import styles from './AnimalGrid.module.css';
import AnimalCard, { AnimalCardData } from './AnimalCard';
import EmptyState from './EmptyState';

interface AnimalGridProps {
  animals: AnimalCardData[];
  getHref: (animal: AnimalCardData) => string;
  emptyMessage?: string;
}

export default function AnimalGrid({ animals, getHref, emptyMessage }: AnimalGridProps) {
  if (animals.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={styles.gridContainer}>
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} href={getHref(animal)} />
      ))}
    </div>
  );
}