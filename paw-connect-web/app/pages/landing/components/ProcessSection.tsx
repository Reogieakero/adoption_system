'use client';

import { type MouseEvent } from 'react';
import styles from './ProcessSection.module.css';
import Reveal from './Reveal';

const steps = [
  { n: '01', t: 'Pick a membership plan', d: 'Choose an annual or monthly plan — starting from just $7/month.' },
  { n: '02', t: 'Video chat with a vet today', d: 'Pick a time and get care from a licensed vet from home.' },
  { n: '03', t: 'Get prescriptions shipped free', d: 'Your vet customizes a treatment plan and we ship it to your door.' },
];

export default function ProcessSection() {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  return (
    <section className={styles.section}>
      {/* Decorative Background SVG Pattern */}
      <svg className={styles.bgPattern} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 440" fill="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ocean)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--royal)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--ocean)" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="softGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,119,182,0.24)" />
            <stop offset="100%" stopColor="rgba(0,119,182,0)" />
          </radialGradient>
        </defs>
        <circle cx="240" cy="84" r="96" fill="url(#softGlow)" opacity="0.28" />
        <circle cx="1180" cy="70" r="78" fill="url(#softGlow)" opacity="0.22" />
        <path opacity="0.4" d="M-120 280C200 350 400 120 700 230C1000 340 1170 100 1560 180" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="10 10" />
        <path opacity="0.2" d="M-60 200C260 260 420 90 760 180C1110 270 1260 100 1610 150" stroke="url(#lineGradient)" strokeWidth="1.5" />
        <path opacity="0.3" d="M420 0C480 68 540 92 620 84C700 76 760 34 840 18C920 2 980 34 1040 60C1100 86 1160 94 1220 82C1280 70 1340 50 1400 32" stroke="rgba(65,105,225,0.22)" strokeWidth="2" />
      </svg>

      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHead}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2 className={styles.sectionTitle}>The faster, easier way to get care and prescriptions</h2>
        </Reveal>

        <div className={styles.processGrid}>
          {steps.map((s, i) => (
            <Reveal 
              key={s.n} 
              delay={i * 90} 
              className={styles.processItem}
              onMouseMove={handleMouseMove}
            >
              {/* The individual ambient glow */}
              <div className={styles.glowEffect} />
              
              <div className={styles.processNumber}>{s.n}</div>
              <div className={styles.processTitle}>{s.t}</div>
              <p className={styles.processText}>{s.d}</p>
              {i < 2 && <span className={styles.processConnector} />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}