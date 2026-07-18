import { Gift, Home, Heart } from 'lucide-react';
import styles from './WaysToHelpSection.module.css';
import Button from '@/components/ui/button';

const WAYS = [
  {
    icon: Gift,
    title: 'Donate',
    desc: 'Your contribution helps us provide food, medical care, and shelter for rescued animals.',
    href: '#',
  },
  {
    icon: Home,
    title: 'Foster',
    desc: 'Open your home temporarily and give an animal a safe space while they wait for adoption.',
    href: '#',
  },
  {
    icon: Heart,
    title: 'Volunteer',
    desc: 'Join our team of dedicated volunteers and make a difference in your community.',
    href: '#',
  },
];

export default function WaysToHelpSection() {
  const handleClick = (label: string) => {
    alert(`"${label}" page — needs to be built separately.`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Other ways to help</h2>
        <p className={styles.subtitle}>Not ready to adopt yet? There are still many ways you can make a difference.</p>

        <div className={styles.grid}>
          {WAYS.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.title} className={styles.card}>
                <Icon size={36} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cardTitle}>{w.title}</h3>
                <p className={styles.cardDesc}>{w.desc}</p>
                <Button variant="outline" onClick={() => handleClick(w.title)}>
                  {w.title}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
