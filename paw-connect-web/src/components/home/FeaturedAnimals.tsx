'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './FeaturedAnimals.module.css';
import Button from '@/components/ui/button';
import { formatStatus } from '@/lib/format-status';
import { API_BASE_URL } from '@/lib/config';
import type { Pet } from '@/types';

export default function FeaturedAnimals() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/pets/featured`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setPets(data.pets.slice(0, 4));
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
    return <section className={styles.section}><div className={styles.header}><h2 className={styles.title}>Needs a home urgently</h2></div></section>;
  }

  if (error || pets.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Needs a home urgently</h2>
        <p className={styles.subtitle}>These pets have been waiting the longest for their forever family.</p>
      </div>

      <div className={styles.grid}>
        {pets.map((animal) => (
          <Link key={animal.pet_id} href={`/animals/${animal.pet_id}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img
                src={animal.primary_photo_url ?? ''}
                alt={animal.name}
                className={styles.image}
                loading="lazy"
              />
              <span className={styles.species}>{formatStatus(animal.species)}</span>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.name}>{animal.name}</h3>
              <p className={styles.detail}>{animal.breed_detail ?? animal.breed_type}</p>
              <p className={styles.detail}>{animal.age_estimate}</p>

              <Button variant="admin-primary" className={styles.meetBtn}>
                Meet me
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
