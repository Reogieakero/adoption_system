'use client';

import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import CtaSection from './components/CtaSection';
import HeroSection from './components/HeroSection';
import PlansSection from './components/PlansSection';
import ProcessSection from './components/ProcessSection';
import ProductsSection from './components/ProductsSection';
import styles from './page.module.css';

export default function Page() {
  const [navScrolled, setNavScrolled] = useState(false);
  const heroBlobRef = useRef<HTMLDivElement | null>(null);
  const heroArchRef = useRef<HTMLDivElement | null>(null);
  const featureRef = useRef<HTMLDivElement | null>(null);
  const statRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const onScroll = () => {
      setNavScrolled(window.scrollY > 12);
      if (reduce) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroBlobRef.current) {
          heroBlobRef.current.style.transform = `translateY(${y * 0.18}px)`;
        }
        if (heroArchRef.current) {
          const t = Math.min(y * 0.05, 24);
          heroArchRef.current.style.transform = `translateY(${-t}px) scale(${1 + Math.min(y, 300) * 0.00012})`;
        }
        if (featureRef.current) {
          featureRef.current.style.transform = `translateY(${Math.min(y * 0.08, 20)}px)`;
        }
        if (statRef.current) {
          statRef.current.style.transform = `translateY(${-Math.min(y * 0.06, 16)}px)`;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const plans = [
    {
      key: 'anxiety' as const,
      name: "Calm homecoming — Anxiety plan",
      tag: 'Noise · Shelter stress · New home',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      description: 'Help newly adopted dogs and cats settle in with calm routines, safe spaces, and reassuring care.',
      href: '/plans/anxiety',
    },
    {
      key: 'allergy' as const,
      name: 'Clear skin, happy coat — Allergy plan',
      tag: 'Itch relief · Sensitive skin · gentle grooming',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80',
      description: 'Support adopted pets with skin sensitivities using gentle grooming, nutrition, and comfort-first care.',
      href: '/plans/allergy',
    },
    {
      key: 'mobility' as const,
      name: 'Move with comfort — Mobility plan',
      tag: 'Joint care · Gentle exercise · senior support',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
      description: 'Keep dogs and cats active and comfortable with joint-friendly routines and low-impact movement support.',
      href: '/plans/mobility',
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar navScrolled={navScrolled} />
      <HeroSection
        heroBlobRef={heroBlobRef}
        heroArchRef={heroArchRef}
        featureRef={featureRef}
        statRef={statRef}
      />
      <ProcessSection />
      <ProductsSection />
      <PlansSection plans={plans} />
      <CtaSection />
      <Footer />
    </div>
  );
}
