import Link from 'next/link';
import { PawPrint, Heart, Rabbit } from 'lucide-react';
import styles from './CategoryFilters.module.css';

const CATEGORIES = [
  {
    label: 'Dogs',
    desc: 'Loyal, playful, and ready to love',
    icon: PawPrint,
    href: '/animals?species=Dog',
  },
  {
    label: 'Cats',
    desc: 'Independent, curious, and cuddly',
    icon: Heart,
    href: '/animals?species=Cat',
  },
  {
    label: 'Small Pets',
    desc: 'Rabbits, hamsters, and more',
    icon: Rabbit,
    href: '/animals?type=small',
  },
  {
    label: 'Senior & Special Needs',
    desc: 'Extra love for extra-special pets',
    icon: Heart,
    href: '/animals?age=senior',
  },
];

export default function CategoryFilters() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.label} href={cat.href} className={styles.card}>
              <Icon size={28} strokeWidth={1.5} className={styles.icon} />
              <div>
                <h3 className={styles.cardTitle}>{cat.label}</h3>
                <p className={styles.cardDesc}>{cat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
