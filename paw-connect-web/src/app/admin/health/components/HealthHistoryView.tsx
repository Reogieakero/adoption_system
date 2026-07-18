'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { X, Calendar, Activity, ShieldAlert, ArrowLeft, Syringe, HeartPulse } from 'lucide-react'
import type { HealthAnimal as Animal } from '@/types'
import Button from '@/components/ui/button'
import styles from './HealthHistoryView.module.css'

interface HealthHistoryViewProps {
  animal: Animal
  onClose: () => void
}

const FALLBACK_PHOTO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#170A0C"/>
      <text x="50%" y="50%" fill="#ffffff" fill-opacity="0.4" font-family="monospace"
            font-size="20" text-anchor="middle" dominant-baseline="middle">No Photo</text>
    </svg>`
  )

export default function HealthHistoryView({ animal, onClose }: HealthHistoryViewProps) {
  const router = useRouter()

  const photoSrc = animal.photo && animal.photo.trim() !== "" ? animal.photo : FALLBACK_PHOTO

  return (
    <div className={styles.historyFullPage}>
      <div className={styles.topBar}>
        <Button variant="admin-secondary" square onClick={onClose} aria-label="Back to all animals">
          <ArrowLeft size={16} />
        </Button>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close history">
          <X size={16} />
        </button>
      </div>

      <div className={styles.historyLayout}>
        {/* Profile Sidebar */}
        <aside className={styles.profileSidebar}>
          <div className={styles.heroImageContainer}>
            <img
              src={photoSrc}
              alt={animal.name}
              className={styles.historyHeroImage}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_PHOTO) {
                  e.currentTarget.src = FALLBACK_PHOTO
                }
              }}
            />
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileHeader}>
              <span className={styles.panelTag}>{animal.tag} • {animal.species}</span>
              <h2 className={styles.panelTitle}>{animal.name}</h2>
              <p className={styles.historyHeroBreed}>{animal.breed}</p>
            </div>
            
            <div className={styles.logVitalsAction}>
              <Button variant="admin-primary" onClick={() => router.push(`/admin/health/${animal.id}/log`)}>
                <HeartPulse size={16} />
                Log Vitals
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Vitals Dashboard Grid */}
          <div className={styles.vitalsDashboard}>
            <div className={styles.vitalCard}>
              <div className={styles.vitalHeader}>
                <div className={styles.vitalIcon}>
                  <Activity size={16} />
                </div>
                Heart Rate
              </div>
              <div className={styles.vitalValue}>{animal.heartRate} bpm</div>
            </div>
            
            <div className={styles.vitalCard}>
              <div className={styles.vitalHeader}>
                <div className={styles.vitalIcon}>
                  <ShieldAlert size={16} />
                </div>
                Health Status
              </div>
              <div className={styles.vitalValue}>{animal.healthStatus}</div>
            </div>

            <div className={styles.vitalCard}>
              <div className={styles.vitalHeader}>
                <div className={styles.vitalIcon}>
                  <Syringe size={16} />
                </div>
                Vaccination
              </div>
              <div className={styles.vitalValue}>{animal.vaccinationStatus}</div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className={styles.timelineSection}>
            <h3 className={styles.timelineTitle}>Medical History</h3>
            
            {animal.history.length > 0 ? (
              <div className={styles.timeline}>
                {animal.history.map((h, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <Calendar size={14} />
                    </div>
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineDate}>{h.date}</span>
                      <h4 className={styles.timelineEventTitle}>{h.event}</h4>
                      {h.notes && <p className={styles.timelineNotes}>{h.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyTimeline}>
                No medical events recorded for {animal.name}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
