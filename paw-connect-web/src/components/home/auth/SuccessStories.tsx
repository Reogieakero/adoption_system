'use client';

import { MOCK_TESTIMONIALS } from '@/lib/mock-data';
import styles from './SuccessStories.module.css';

export default function SuccessStories() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Happy tails</h2>

      <div className={styles.track}>
        {MOCK_TESTIMONIALS.map((t) => (
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
