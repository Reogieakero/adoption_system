'use client';

import { useState } from 'react';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/button';
import ShadcnSelect from '@/components/ui/shadcn-select';

const SPECIES_OPTIONS = [
  { label: 'All Pets', value: 'all' },
  { label: 'Dogs', value: 'Dog' },
  { label: 'Cats', value: 'Cat' },
];

export default function HeroSection() {
  const [species, setSpecies] = useState('all');

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroInner}>
        <span className={styles.statBadge}>1,200+ happy adoptions this year</span>

        <h1 className={styles.heroTitle}>
          Find your new best friend —<br />
          <em>adopt, don&apos;t shop</em>
        </h1>

        <p className={styles.heroSub}>
          Every pet deserves a loving home. Browse hundreds of rescued dogs and cats
          waiting for their forever family.
        </p>

        <div className={styles.quickSearch}>
          <ShadcnSelect
            options={SPECIES_OPTIONS}
            value={species}
            onChange={setSpecies}
            width={160}
          />
          <Button variant="admin-primary">Search</Button>
        </div>
      </div>
    </section>
  );
}
