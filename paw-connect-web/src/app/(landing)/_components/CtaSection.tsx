'use client';

import styles from './CtaSection.module.css';
import Reveal from './Reveal';
import Button from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.sectionGrid}>
        
        {/* Left Panel: Primary CTA Info */}
        <Reveal className={styles.leftContent}>
          <h2 className={styles.ctaTitle}>Ready to welcome a new furry family member?</h2>
          
          <div className={styles.perksRow}>
            <span>Adopt cats and dogs</span>
            <span className={styles.dot}>â€¢</span>
            <span>Trusted local shelters</span>
            <span className={styles.dot}>â€¢</span>
            <span>Easy adoption support</span>
          </div>

          <Button variant="solid">Start your adoption journey</Button>
        </Reveal>

        {/* Right Panel: Stray Report Card Component */}
        <Reveal className={styles.rightPanel} delay={120}>
          <div className={styles.reportCard}>
            <h3 className={styles.reportTitle}>See a stray animal?</h3>
            <p className={styles.reportText}>
              Help us keep local dogs and cats safe. Drop a location report with notes on their condition so field volunteers can step in quickly.
            </p>
            <Button variant="outline">Report a Stray</Button>
          </div>
        </Reveal>

      </div>

      {/* Baseline Line Art */}
      <svg className={styles.dividerSvg} viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100" x2="800" y2="100" stroke="#171717" strokeWidth="2"/>
        {/* Dog 1 */}
        <path d="M150 100 C150 60, 190 40, 220 40 C250 40, 290 60, 290 100" stroke="#171717" strokeWidth="2" fill="none"/>
        <circle cx="195" cy="75" r="3" fill="#171717"/>
        <circle cx="245" cy="75" r="3" fill="#171717"/>
        <path d="M220 80 Q220 88, 224 88 Q228 88, 228 80" stroke="#171717" strokeWidth="2" fill="none"/>
        <path d="M165 65 C155 50, 145 65, 155 75" fill="#E0532B"/>
        <path d="M175 50 Q165 30, 180 35" stroke="#171717" strokeWidth="2" fill="none"/>
        <path d="M265 50 Q275 30, 260 35" stroke="#171717" strokeWidth="2" fill="none"/>
        {/* Cat 1 */}
        <path d="M320 100 C320 70, 340 55, 370 55 C400 55, 420 70, 420 100" stroke="#171717" strokeWidth="2" fill="none"/>
        <circle cx="350" cy="80" r="3" fill="#171717"/>
        <circle cx="390" cy="80" r="3" fill="#171717"/>
        <path d="M370 84 L366 88 L374 88 Z" fill="#171717"/>
        <path d="M345 72 C338 65, 342 82, 352 82" fill="#E0532B"/>
        <path d="M325 65 L320 45 L340 55" stroke="#171717" strokeWidth="2" fill="none"/>
        <path d="M415 65 L420 45 L400 55" stroke="#171717" strokeWidth="2" fill="none"/>
        {/* Cat 2 */}
        <path d="M450 100 C450 75, 470 60, 500 60 C530 60, 550 75, 550 100" stroke="#171717" strokeWidth="2" fill="none"/>
        <circle cx="480" cy="82" r="3" fill="#171717"/>
        <circle cx="520" cy="82" r="3" fill="#171717"/>
        <path d="M500 86 Q500 90, 504 90" stroke="#171717" strokeWidth="1.5"/>
        <path d="M490 68 C470 68, 475 88, 510 84" fill="#E0532B"/>
        <path d="M455 70 L450 50 L468 62" stroke="#171717" strokeWidth="2" fill="none"/>
        <path d="M545 70 L550 50 L532 62" stroke="#171717" strokeWidth="2" fill="none"/>
        {/* Dog 2 */}
        <path d="M580 100 C580 60, 620 45, 650 45 C680 45, 720 60, 720 100" stroke="#171717" strokeWidth="2" fill="none"/>
        <circle cx="625" cy="78" r="3" fill="#171717"/>
        <circle cx="675" cy="78" r="3" fill="#171717"/>
        <path d="M650 84 C645 88, 655 92, 650 96" stroke="#171717" strokeWidth="1.5" fill="none"/>
        <circle cx="682" cy="72" r="10" fill="#E0532B"/>
        <path d="M595 55 Q585 35, 600 40" stroke="#171717" strokeWidth="2" fill="none"/>
        <path d="M705 55 Q715 35, 700 40" stroke="#171717" strokeWidth="2" fill="none"/>
      </svg>
    </section>
  );
}

