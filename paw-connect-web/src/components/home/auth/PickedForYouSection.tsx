'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimalCard from './AnimalCard';
import Animal3DOverlay from './Animal3DOverlay';
import { API_BASE_URL } from '@/lib/config';
import type { Pet } from '@/types';
import styles from './PickedForYouSection.module.css';

export default function PickedForYouSection() {
  const [selectedAnimal, setSelectedAnimal] = useState<Pet | null>(null);
  const [animals, setAnimals] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/pets`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setAnimals(data.pets.filter((a: Pet) => a.status === 'available').slice(0, 5));
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <section className={styles.section}><div className={styles.header}><h2 className={styles.title}>Picked for you</h2></div></section>;
  }

  if (error || animals.length === 0) {
    return null;
  }

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
          <AnimalCard key={animal.pet_id} animal={animal} onView={setSelectedAnimal} />
        ))}
      </div>

      {selectedAnimal && (
        <Animal3DOverlay animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      )}
    </section>
  );
}
