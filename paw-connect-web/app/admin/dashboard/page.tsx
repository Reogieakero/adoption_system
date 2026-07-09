"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck,
  Siren,
  HeartPulse,
  Bell,
  ShieldAlert,
  CheckCircle,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import styles from './dashboard.module.css';

function subscribe() { return () => {}; }
function getSnapshot() { return sessionStorage.getItem('adminAuthToken'); }
function getServerSnapshot() { return null; }

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
}

const ATTENTION_CARDS: StatCard[] = [
  { label: 'Pending Adoptions', value: '37', subtext: 'Awaiting coordinator review', icon: ClipboardCheck },
  { label: 'Rescue Reports', value: '12', subtext: 'Active dispatch cases', icon: Siren },
  { label: 'Health Alerts', value: '5', subtext: 'Critical medical updates', icon: HeartPulse },
  { label: 'Notifications', value: '18', subtext: 'Unread administrative updates', icon: Bell },
];

const E_LEARNING_MODULES = [
  { id: 1, tag: 'ANIMAL CARE', title: 'Advanced Canine Dietary Protocols', length: '45 mins', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400' },
  { id: 2, tag: 'LEGAL', title: 'Understanding Local Animal Welfare Laws', length: '60 mins', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400' },
  { id: 3, tag: 'RESCUE', title: 'Safe Field Capture & Handling Tactics', length: '30 mins', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400' },
  { id: 4, tag: 'ADOPTION', title: 'Applicant Screening Best Practices', length: '40 mins', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400' },
  { id: 5, tag: 'MEDICAL', title: 'Identifying Early Feline Viral Symptoms', length: '50 mins', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      router.replace('/admin/admin-login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className={styles.layout}>
      <AdminNavbar />
      <AdminSidebar />

      <div className={styles.page}>
        <main className={styles.main}>
          
          <div className={styles.workspace}>
            
            {/* 1. Metric Cards */}
            <section className={styles.statsGrid} aria-label="Key Administrative Metrics">
              {ATTENTION_CARDS.map(({ label, value, subtext, icon: Icon }) => (
                <div key={label} className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>{label}</span>
                    <span className={styles.statIconContainer}>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                  </div>
                  <div className={styles.statBody}>
                    <span className={styles.statValue}>{value}</span>
                    <span className={styles.statSubtext}>{subtext}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* 2. Seamless E-Learning Infinite Loop */}
            <section className={styles.carouselSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>E-Learning Framework</h2>
                  <p className={styles.sectionSubtitle}>Active professional development certifications</p>
                </div>
              </div>

              <div className={styles.carouselWrapper}>
                <div className={styles.carouselTrack}>
                  {/* We duplicate the maps array elements back-to-back to assure pixel perfect looping track coverage */}
                  {[...E_LEARNING_MODULES, ...E_LEARNING_MODULES, ...E_LEARNING_MODULES].map((module, index) => (
                    <div key={`${module.id}-${index}`} className={styles.learningCard}>
                      <div className={styles.imageWrapper}>
                        <img src={module.image} alt={module.title} className={styles.moduleImage} />
                        <span className={styles.moduleTag}>{module.tag}</span>
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={module.title.length > 32 ? styles.moduleTitleLong : styles.moduleTitle}>
                          {module.title}
                        </h3>
                        <div className={styles.moduleFooter}>
                          <span className={styles.moduleLength}>{module.length}</span>
                          <span className={styles.moduleLink}>Launch Module</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Row split: Analytics & Reports */}
            <div className={styles.dataSplit}>
              
              {/* 3. Analytics Section */}
              <section className={styles.analyticsPanel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>Operational Analytics</h2>
                    <p className={styles.sectionSubtitle}>Monthly intake vs resolution velocity</p>
                  </div>
                  <div className={styles.trendBadge}>
                    <TrendingUp size={14} />
                    <span>+12.4%</span>
                  </div>
                </div>
                
                <div className={styles.mockChartContainer}>
                  <div className={styles.chartBars}>
                    <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '40%' }}></div><span>Jan</span></div>
                    <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '65%' }}></div><span>Feb</span></div>
                    <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '50%' }}></div><span>Mar</span></div>
                    <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '85%' }}></div><span>Apr</span></div>
                    <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '70%' }}></div><span>May</span></div>
                  </div>
                </div>
              </section>

              {/* 4. Latest Activities Sidecards */}
              <div className={styles.sideCardsColumn}>
                
                <div className={styles.reportSideCard}>
                  <div className={styles.sideCardHeader}>
                    <span className={styles.sideCardLabel}>LATEST FIELD REPORT</span>
                    <ShieldAlert size={14} className={styles.iconReport} />
                  </div>
                  <h3 className={styles.animalName}>Case #4092: Hunter</h3>
                  <p className={styles.animalDetails}>
                    <strong>Breed/Type:</strong> German Shepherd Mix<br />
                    <strong>Location:</strong> Barangay Central Market<br />
                    <strong>Status:</strong> Dispatch unit en route
                  </p>
                </div>

                <div className={styles.reportSideCard}>
                  <div className={styles.sideCardHeader}>
                    <span className={styles.sideCardLabel}>RECENTLY ADOPTED</span>
                    <CheckCircle size={14} className={styles.iconAdopted} />
                  </div>
                  <h3 className={styles.animalName}>Bella</h3>
                  <p className={styles.animalDetails}>
                    <strong>Breed/Type:</strong> Golden Retriever Tail<br />
                    <strong>Adopter:</strong> Dr. Ramirez & Family<br />
                    <strong>Completed:</strong> 2 hours ago
                  </p>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}