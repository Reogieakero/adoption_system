'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnimalCard from './AnimalCard';
import Animal3DOverlay from './Animal3DOverlay';
import { FEATURED_ANIMALS } from '@/lib/mock-data/featured-animals';
import type { Animal } from '@/types';
import styles from './PickedForYouSection.module.css';

export default function PickedForYouSection() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const animals = FEATURED_ANIMALS.filter((a) => a.adoptionStatus === 'Available');

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Picked for you</h2>
        <Link href="/animals" className={styles.viewAll}>
          View all
        </Link>
      </div>

      <div className={styles.grid}>
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} onView={setSelectedAnimal} />
        ))}
      </div>

      {selectedAnimal && (
        <Animal3DOverlay animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      )}
    </section>
  );
}
