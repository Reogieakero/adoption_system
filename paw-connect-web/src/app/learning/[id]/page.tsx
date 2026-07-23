'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { residentFetch } from '@/lib/resident-api';
import type { ElearningModule, ModuleProgress } from '@/types';
import styles from './page.module.css';

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mod, setMod] = useState<ElearningModule | null>(null);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    Promise.all([
      residentFetch<{ module: ElearningModule }>(`/api/resident/learning/modules/${id}`),
      residentFetch<{ progress: ModuleProgress | null }>(`/api/resident/learning/modules/${id}/progress`),
    ])
      .then(([modData, progData]) => {
        setMod(modData.module);
        setProgress(progData.progress);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMarkComplete() {
    setUpdating(true);
    try {
      await residentFetch(`/api/resident/learning/modules/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });
      setProgress((prev) => prev ? { ...prev, status: 'completed' } : null);
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className={styles.page}><p className={styles.muted}>Loading...</p></div>;
  if (!mod) return <div className={styles.page}><p className={styles.muted}>Module not found.</p></div>;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => router.push('/learning')}>
        &larr; Pet Care Guides
      </button>

      <article className={styles.article}>
        <h1 className={styles.title}>{mod.title}</h1>

        {mod.description && <p className={styles.description}>{mod.description}</p>}

        {mod.video_url && (
          <div className={styles.videoWrap}>
            <video src={mod.video_url} controls className={styles.video} />
          </div>
        )}

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: mod.content_body }} />

        <div className={styles.footer}>
          {progress?.status === 'completed' ? (
            <p className={styles.completedBadge}>&checkmark; Completed</p>
          ) : (
            <Button variant="admin-primary" onClick={handleMarkComplete} disabled={updating}>
              {updating ? 'Updating...' : 'Mark as Complete'}
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}
