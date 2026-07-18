'use client';

import Link from 'next/link';
import { PawPrint, Home, Heart } from 'lucide-react';
import Button from '@/components/ui/button';
import styles from './BentoHeroSection.module.css';

export default function BentoHeroSection() {
  return (
    <section className={styles.bento}>
      {/* Large feature tile — Adopt */}
      <div className={styles.featureLarge}>
        <div className={styles.featureIconWrap}>
          <PawPrint size={24} />
        </div>
        <h2 className={styles.featureTitle}>Adopt a pet</h2>
        <p className={styles.featureDesc}>
          Every pet deserves a loving home. Browse animals near you ready to meet their forever family.
        </p>
        <Link href="/animals">
          <Button variant="admin-primary">Browse pets</Button>
        </Link>
      </div>

      {/* Stacked side tiles */}
      <div className={styles.sideStack}>
        <div className={styles.sideTileFoster}>
          <Home size={22} />
          <div>
            <span className={styles.sideLabel}>Foster</span>
            <p className={styles.sideDesc}>Short-term care saves lives</p>
          </div>
        </div>
        <div className={styles.sideTileDonate}>
          <Heart size={22} />
          <div>
            <span className={styles.sideLabel}>Donate</span>
            <p className={styles.sideDesc}>Support shelters and rescues</p>
          </div>
        </div>
      </div>
    </section>
  );
}
