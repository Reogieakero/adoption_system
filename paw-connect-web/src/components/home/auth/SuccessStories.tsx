'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import type { Testimonial } from '@/types';
import styles from './SuccessStories.module.css';

export default function SuccessStories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/content/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setTestimonials(data.testimonials);
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
    return <section className={styles.section}><h2 className={styles.title}>Happy tails</h2></section>;
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Happy tails</h2>

      <div className={styles.track}>
        {testimonials.map((t) => (
          <article key={t.id} className={styles.card}>
            <div className={styles.quoteMark}>&ldquo;</div>
            <blockquote className={styles.quote}>{t.quote}</blockquote>
            <div className={styles.author}>
              <img src={t.photoUrl} alt={t.name} className={styles.avatar} />
              <div>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.pet}>Adopted {t.animalAdopted}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
