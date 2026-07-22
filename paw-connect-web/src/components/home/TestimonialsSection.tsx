'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './TestimonialsSection.module.css';
import { API_BASE_URL } from '@/lib/config';
import type { Testimonial } from '@/types';

export default function TestimonialsSection() {
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
    return <section className={styles.section}><div className={styles.inner}><h2 className={styles.title}>Happy adoption stories</h2></div></section>;
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Happy adoption stories</h2>

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <MessageCircle size={28} strokeWidth={1.5} className={styles.quoteIcon} />
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.author}>
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className={styles.avatar}
                  loading="lazy"
                />
                <div>
                  <p className={styles.authorName}>{t.name}</p>
                  <p className={styles.authorPet}>Adopted {t.animalAdopted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
