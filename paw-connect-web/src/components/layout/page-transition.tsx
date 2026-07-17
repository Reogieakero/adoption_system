"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './page-transition.module.css';

/**
 * Wrap {children} with this in your ROOT layout.tsx:
 *
 *   <body>
 *     <PageTransition>{children}</PageTransition>
 *   </body>
 *
 * Without it, Next.js unmounts the old page and mounts the new one
 * instantly, so the shared `layoutId="auth-image"` panel in AuthLayout
 * never gets to animate between /login and /register â€” it would just
 * pop from one side to the other.
 *
 * AnimatePresence's default "sync" mode keeps the outgoing and incoming
 * page mounted at the same time for the duration of the exit/enter
 * animations, which is what lets the image panel visually travel across
 * the screen instead of cutting.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      <motion.div key={pathname} className={styles.wrapper}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
