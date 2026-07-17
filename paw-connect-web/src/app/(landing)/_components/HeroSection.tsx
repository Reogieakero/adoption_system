'use client';

import type { RefObject } from 'react';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/button';

type HeroSectionProps = {
  heroBlobRef: RefObject<HTMLDivElement | null>;
  heroArchRef: RefObject<HTMLDivElement | null>;
  featureRef: RefObject<HTMLDivElement | null>;
  statRef: RefObject<HTMLDivElement | null>;
};

export default function HeroSection({
  heroBlobRef,
  heroArchRef,
  featureRef,
  statRef,
}: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div ref={heroBlobRef} className={styles.heroBlob} />
      
      <div className={styles.heroInner}>
        <span className={styles.eyebrow}>
          <span className={styles.pulseDotSmall} />
          Active Rescue Network
        </span>
        
        <h1 className={styles.heroTitle}>
          Save a life. <em>Adopt</em> or report a stray in need.
        </h1>
        
        <p className={styles.heroSub}>
          Connect lost or stray dogs and cats with local rescue teams instantly, 
          or browse loving animals waiting for their forever homes.
        </p>
        
        <div className={styles.heroCtas}>
          <Button variant="inverse">Report a Stray</Button>
          <Button variant="ghost">Find a Pet to Adopt</Button>
        </div>

      </div>
    </section>
  );
}

