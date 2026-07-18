'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalizedHeader from '@/components/home/auth/PersonalizedHeader';
import QuickActionsStrip from '@/components/home/auth/QuickActionsStrip';
import CategoryPillRail from '@/components/home/auth/CategoryPillRail';
import BentoHeroSection from '@/components/home/auth/BentoHeroSection';
import PickedForYouSection from '@/components/home/auth/PickedForYouSection';
import SuccessStories from '@/components/home/auth/SuccessStories';
import RecentRescues from '@/components/home/auth/RecentRescues';
import CommunityImpactBar from '@/components/home/auth/CommunityImpactBar';
import styles from './home.module.css';

export default function HomePage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    setAuthed(true);
  }, [router]);

  if (!authed) return null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PersonalizedHeader name="Alex" />
        <QuickActionsStrip />
        <CategoryPillRail />
        <BentoHeroSection />
        <CommunityImpactBar />
        <PickedForYouSection />
        <RecentRescues />
        <SuccessStories />
      </div>
    </main>
  );
}
