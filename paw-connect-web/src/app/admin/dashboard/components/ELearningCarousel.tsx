'use client';

import { useState, useEffect } from 'react';
import { createServiceClient } from '@/lib/api-client';
import styles from './ELearningCarousel.module.css';

const { request } = createServiceClient('/api/admin/learning-modules');

interface Module {
  module_id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  category_name?: string;
}

export default function ELearningCarousel() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    request<{ success: true; modules: Module[] }>('')
      .then((data) => { setModules(data.modules ?? []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || modules.length === 0) return null;

  return (
    <section className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>E-Learning Framework</h2>
          <p className={styles.sectionSubtitle}>Active professional development certifications</p>
        </div>
      </div>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          {[...modules, ...modules, ...modules].map((mod, idx) => (
            <div key={`${mod.module_id}-${idx}`} className={styles.learningCard}>
              <div className={styles.imageWrapper}>
                <img src={mod.cover_image_url ?? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400'} alt={mod.title} className={styles.moduleImage} />
                <span className={styles.moduleTag}>{mod.category_name ?? 'MODULE'}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.moduleFooter}>
                  <span className={styles.moduleLength}>{mod.description ?? ''}</span>
                  <span className={styles.moduleTitle}>{mod.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
