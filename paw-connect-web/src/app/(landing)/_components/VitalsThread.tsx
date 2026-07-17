'use client';

import { useEffect, useRef } from 'react';
import styles from './VitalsThread.module.css';

export default function VitalsThread() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const path = pathRef.current;
        const dot = dotRef.current;
        if (!path || !dot) return;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const frac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        const len = path.getTotalLength();
        const pt = path.getPointAtLength(len * frac);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.vitalsThread} aria-hidden="true">
      <svg className={styles.vitalsSvg} viewBox="0 0 46 800" preserveAspectRatio="none">
        <path
          ref={pathRef}
          className={styles.vitalsPath}
          d="M23 0 V180 l-10 20 l10 -60 l10 40 l-10 20 V420 l-8 16 l8 -48 l8 32 l-8 16 V800"
        />
        <circle ref={dotRef} className={styles.vitalsDot} r="4.5" cx="23" cy="0" />
      </svg>
    </div>
  );
}

