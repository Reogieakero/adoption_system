'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Dog, Cat } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import type { AnimalReport } from '@/types';
import styles from './RecentRescues.module.css';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Resolved', value: 'resolved' },
];

export default function RecentRescues() {
  const [allCases, setAllCases] = useState<AnimalReport[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/reports/recent`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setAllCases(data.reports);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = activeTab ? allCases.filter((rc) => rc.status === activeTab) : allCases;
  const duplicated = [...filtered, ...filtered];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || filtered.length === 0) return;

    let animationId: number;
    let pos = 0;
    const speed = 0.5;

    function step() {
      pos -= speed;
      const half = track!.scrollWidth / 2;
      if (Math.abs(pos) >= half) {
        pos = 0;
      }
      track!.scrollLeft = Math.abs(pos);
      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [filtered.length]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}><h2 className={styles.title}>Rescue Transactions</h2></div>
      </section>
    );
  }

  if (allCases.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Rescue Transactions</h2>
        <Link href="/rescues/report" className={styles.viewAll}>Report a rescue</Link>
      </div>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.track} ref={trackRef}>
        {duplicated.map((rc, i) => (
          <Link key={`${rc.report_id}-${i}`} href="/rescues/report" className={styles.card}>
            <span className={`${styles.badge} ${styles[rc.status] || ''}`}>{rc.status.replace('_', ' ')}</span>
            <div className={styles.imageWrap}>
              <div className={styles.noImageLabel}>
                {rc.species === 'cat' ? <Cat size={24} /> : <Dog size={24} />}
              </div>
              {rc.photo_url && (
                <img
                  src={`${API_BASE_URL}${rc.photo_url.split(',')[0]}`}
                  alt={rc.species}
                  className={styles.image}
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
            <div className={styles.body}>
              <h3 className={styles.animalType}>{rc.species}</h3>
              <p className={styles.condition}>{rc.condition_description}</p>
              <div className={styles.metaRow}>
                {rc.location_area && (
                  <span className={styles.metaItem}><MapPin size={11} />{rc.location_area}</span>
                )}
                <span className={styles.metaItem}><Clock size={11} />{rc.submitted_at}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
