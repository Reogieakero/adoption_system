'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Button from '@/components/ui/button';
import { publicFetch } from '@/lib/resident-api';
import styles from './BentoHeroSection.module.css';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80';

interface LatestModule {
  module_id: number;
  title: string;
  description: string | null;
  category_name: string;
}

export default function BentoHeroSection() {
  const [mod, setMod] = useState<LatestModule | null>(null);

  useEffect(() => {
    publicFetch<{ module: LatestModule | null }>('/api/public/content/latest-module')
      .then((data) => setMod(data.module))
      .catch(() => {});
  }, []);

  return (
    <section className={styles.bento}>
      <div className={styles.heroCard}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Adopt a pet</h2>
          <p className={styles.heroDesc}>
            Every pet deserves a loving home. Browse animals near you ready to meet their forever family.
          </p>
          <Link href="/animals">
            <Button variant="admin-primary">Browse pets</Button>
          </Link>
        </div>
      </div>

      {mod && (
        <Link href={`/learning/${mod.module_id}`} className={styles.learningCard}>
          <div className={styles.learningIcon}>
            <BookOpen size={20} />
          </div>
          <div className={styles.learningBody}>
            <span className={styles.learningEyebrow}>Latest guide</span>
            <h3 className={styles.learningTitle}>{mod.title}</h3>
            {mod.description && <p className={styles.learningDesc}>{mod.description}</p>}
          </div>
        </Link>
      )}
    </section>
  );
}
