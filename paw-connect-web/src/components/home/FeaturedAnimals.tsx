import Link from 'next/link';
import styles from './FeaturedAnimals.module.css';
import Button from '@/components/ui/button';
import { FEATURED_ANIMALS } from '@/lib/mock-data/featured-animals';

export default function FeaturedAnimals() {
  const featured = FEATURED_ANIMALS.slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Needs a home urgently</h2>
        <p className={styles.subtitle}>These pets have been waiting the longest for their forever family.</p>
      </div>

      <div className={styles.grid}>
        {featured.map((animal) => (
          <Link key={animal.id} href={`/animals/${animal.id}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img
                src={animal.photo}
                alt={animal.name}
                className={styles.image}
                loading="lazy"
              />
              <span className={styles.species}>{animal.species}</span>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.name}>{animal.name}</h3>
              <p className={styles.detail}>{animal.breed}</p>
              <p className={styles.detail}>{animal.age}</p>

              <Button variant="admin-primary" className={styles.meetBtn}>
                Meet me
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
