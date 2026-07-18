'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryFilters from '@/components/home/CategoryFilters';
import FeaturedAnimals from '@/components/home/FeaturedAnimals';
import WhyAdoptSection from '@/components/home/WhyAdoptSection';
import HowItWorks from '@/components/home/HowItWorks';
import ImpactStats from '@/components/home/ImpactStats';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WaysToHelpSection from '@/components/home/WaysToHelpSection';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import styles from './(landing)/page.module.css';

export default function HomePage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar navScrolled={navScrolled} />
      <HeroSection />
      <CategoryFilters />
      <FeaturedAnimals />
      <WhyAdoptSection />
      <HowItWorks />
      <ImpactStats />
      <TestimonialsSection />
      <WaysToHelpSection />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
