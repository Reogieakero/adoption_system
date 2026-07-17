"use client";

import { ReactNode, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import styles from './auth-layout.module.css';

interface AuthLayoutProps {
  mode: 'login' | 'register';
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  brandName?: string;
  heading?: string;
  tagline?: string;
}

const FLIP_DURATION = 0.7;
const FLIP_EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Persistent two-pane shell for /login and /register.
 *
 * IMPORTANT: this only produces a real "flip" transition if a single
 * instance of AuthLayout stays mounted across the /login <-> /register
 * navigation (see app/(auth)/layout.tsx, which renders this once and
 * just swaps `mode` as the route changes). If each page renders its own
 * <AuthLayout>, React remounts it on navigation and there's nothing to
 * animate between.
 *
 * On every mode change, the marketing panel rotates through 90Â° (fading
 * out right at the edge-on point) while sliding to its new side, and the
 * form panel does the mirror-image rotation in the opposite direction â€”
 * like two facing pages of a book turning at once.
 */
export default function AuthLayout({
  mode,
  children,
  imageSrc = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000&h=1500',
  imageAlt = 'Pet Portrait',
  brandName = 'spot.',
  heading = 'Find your new best friend',
  tagline = 'The most trusted platform for pet adoption and rescue, connecting shelters and loving homes nationwide.',
}: AuthLayoutProps) {
  const imageOnLeft = mode === 'login';
  const imageControls = useAnimationControls();
  const formControls = useAnimationControls();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const dir = imageOnLeft ? 1 : -1;
    imageControls.start({
      rotateY: [0, 90 * dir, 0],
      opacity: [1, 0, 1],
      transition: { duration: FLIP_DURATION, ease: FLIP_EASE, times: [0, 0.5, 1] },
    });
    formControls.start({
      rotateY: [0, -90 * dir, 0],
      opacity: [1, 0, 1],
      transition: { duration: FLIP_DURATION, ease: FLIP_EASE, times: [0, 0.5, 1] },
    });
  }, [mode, imageOnLeft, imageControls, formControls]);

  return (
    <main className={styles.container}>
      <motion.div
        layout
        className={`${styles.imageSide} ${imageOnLeft ? styles.orderFirst : styles.orderSecond}`}
        animate={imageControls}
        transition={{ layout: { duration: FLIP_DURATION, ease: FLIP_EASE } }}
      >
        <div className={styles.imageCard}>
          <img src={imageSrc} alt={imageAlt} className={styles.petImage} />
          <div className={styles.gradientOverlay} aria-hidden="true" />

          <span className={styles.panelBrand}>{brandName}</span>

          <div className={styles.panelText}>
            <h2 className={styles.panelHeading}>{heading}</h2>
            <p className={styles.panelTagline}>{tagline}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        layout
        className={`${styles.formSide} ${imageOnLeft ? styles.orderSecond : styles.orderFirst}`}
        animate={formControls}
        transition={{ layout: { duration: FLIP_DURATION, ease: FLIP_EASE } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            className={styles.formWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
