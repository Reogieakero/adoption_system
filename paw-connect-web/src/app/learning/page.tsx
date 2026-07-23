'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { residentFetch } from '@/lib/resident-api';
import type { ElearningModule } from '@/types';
import styles from './page.module.css';

export default function LearningPage() {
  const [modules, setModules] = useState<ElearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    residentFetch<{ modules: ElearningModule[] }>('/api/resident/learning/modules')
      .then((data) => setModules(data.modules))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pet Care Guides</h1>

      {modules.length === 0 ? (
        <p className={styles.muted}>No learning modules available yet.</p>
      ) : (
        <div className={styles.grid}>
          {modules.map((mod) => (
            <Link key={mod.module_id} href={`/learning/${mod.module_id}`} className={styles.card}>
              {mod.cover_image_url && (
                <div className={styles.coverWrap}>
                  <img src={mod.cover_image_url} alt={mod.title} className={styles.cover} />
                </div>
              )}
              <div className={styles.body}>
                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                {mod.description && <p className={styles.desc}>{mod.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
