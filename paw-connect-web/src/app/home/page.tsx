'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { residentFetch } from '@/lib/resident-api';
import PersonalizedHeader from '@/components/home/auth/PersonalizedHeader';
import CategoryPillRail from '@/components/home/auth/CategoryPillRail';
import BentoHeroSection from '@/components/home/auth/BentoHeroSection';
import StatsCards from '@/components/home/auth/StatsCards';
import PickedForYouSection from '@/components/home/auth/PickedForYouSection';
import RecentRescues from '@/components/home/auth/RecentRescues';
import SuccessStories from '@/components/home/auth/SuccessStories';
import styles from './home.module.css';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    residentFetch<{ user: UserProfile }>('/api/auth/me')
      .then((data) => setProfile(data.user))
      .catch(() => {});
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PersonalizedHeader name={profile?.fullName} />
        <CategoryPillRail />
        <BentoHeroSection />
        <StatsCards />
        <PickedForYouSection />
        <RecentRescues />
        <SuccessStories />
      </div>
    </main>
  );
}
