import { Search, FileText, Home } from 'lucide-react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    step: '1',
    icon: Search,
    title: 'Browse',
    desc: 'Search through hundreds of dogs, cats, and small pets waiting for a home.',
  },
  {
    step: '2',
    icon: FileText,
    title: 'Apply',
    desc: 'Submit an adoption application and our team will guide you through the process.',
  },
  {
    step: '3',
    icon: Home,
    title: 'Adopt',
    desc: 'Meet your new pet, complete the adoption, and bring them home!',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>How it works</h2>

        <div className={styles.grid}>
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className={styles.card}>
                <span className={styles.stepNum}>Step {s.step}</span>
                <Icon size={36} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
