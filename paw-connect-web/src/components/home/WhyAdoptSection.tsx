import { Heart, Stethoscope, Handshake, Home } from 'lucide-react';
import styles from './WhyAdoptSection.module.css';

const REASONS = [
  {
    icon: Heart,
    title: 'Save a life',
    desc: 'Give a second chance to a rescued animal in need of a loving home.',
  },
  {
    icon: Stethoscope,
    title: 'Vetted & healthy',
    desc: 'All pets are vaccinated, microchipped, and given a full health check.',
  },
  {
    icon: Handshake,
    title: 'Ongoing support',
    desc: 'Post-adoption guidance and resources to help you and your pet settle in.',
  },
  {
    icon: Home,
    title: 'Lifetime match',
    desc: 'We help you find the perfect pet that fits your lifestyle and home.',
  },
];

export default function WhyAdoptSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Why adopt through PawConnect?</h2>

        <div className={styles.grid}>
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className={styles.card}>
                <Icon size={32} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardDesc}>{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
