'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicFetch } from '@/lib/resident-api';
import type { Pet } from '@/types';
import styles from './page.module.css';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState('');

  useEffect(() => {
    publicFetch<{ pets: Pet[] }>('/api/public/pets')
      .then((data) => setAnimals(data.pets))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = species ? animals.filter((a) => a.species === species) : animals;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Find your new best friend</h1>

      <div className={styles.filters}>
        {['', 'dog', 'cat'].map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.pill} ${species === s ? styles.pillActive : ''}`}
            onClick={() => setSpecies(s)}
          >
            {s ? (s === 'dog' ? 'Dogs' : 'Cats') : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.muted}>Loading animals...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.muted}>No animals found.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((animal) => (
            <Link key={animal.pet_id} href={`/animals/${animal.pet_id}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {animal.primary_photo_url ? (
                  <img src={animal.primary_photo_url} alt={animal.name} className={styles.image} loading="lazy" />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{animal.name}</h3>
                <p className={styles.meta}>{(animal.breed_detail ?? animal.breed_type)} &middot; {animal.age_estimate}</p>
                <p className={styles.location}>{animal.location_area}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
