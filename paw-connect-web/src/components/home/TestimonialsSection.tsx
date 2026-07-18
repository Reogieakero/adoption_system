import { MessageCircle } from 'lucide-react';
import styles from './TestimonialsSection.module.css';
import { MOCK_TESTIMONIALS } from '@/lib/mock-data/testimonials';

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Happy adoption stories</h2>

        <div className={styles.grid}>
          {MOCK_TESTIMONIALS.map((t) => (
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
