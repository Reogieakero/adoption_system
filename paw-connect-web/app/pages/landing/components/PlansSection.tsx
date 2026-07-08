'use client';

import Image from 'next/image';
import styles from './PlansSection.module.css';
import Reveal from './Reveal';

type Plan = {
  key: 'anxiety' | 'allergy' | 'mobility';
  name: string;
  tag: string;
  image: string;
  description: string;
  href: string;
};

type PlansSectionProps = {
  plans: Plan[];
};

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlansSection({ plans }: PlansSectionProps) {
  return (
    <section id="plans" className={styles.section}>
      <div className={styles.plansGrid}>
        {plans.map((p, i) => (
          <Reveal
            key={p.key}
            delay={i * 90}
            className={i === 0 ? styles.largeCard : styles.smallCard}
          >
            <a
              href={p.href}
              className={styles.planCard}
              aria-label={`Start the ${p.name} course`}
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 980px) 100vw, 45vw"
                className={styles.planImage}
              />

              <div className={styles.planContent}>
                <span className={styles.planTag}>{p.tag}</span>
                <div className={styles.planName}>{p.name}</div>

                <p className={styles.planDescription}>{p.description}</p>

                <span className={styles.planButton}>
                  Start course
                  <ArrowIcon />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}