'use client'
import React, { useState } from 'react'
import { X, Calendar, Activity, ShieldAlert, ArrowLeft, Syringe } from 'lucide-react'
import { Animal } from '../types'
import LogVitalsModal from './LogVitalsModal'
import Button from '@/components/ui/button'
import styles from './HealthHistoryView.module.css'

interface HealthHistoryViewProps {
  animal: Animal
  onClose: () => void
  onVitalsUpdated?: (updatedAnimal: Animal) => void
}

// Self-contained fallback so a missing photo_url never renders <img src="">
const FALLBACK_PHOTO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox=" 0 400 400">
      <rect width="400" height="400" fill="#170A0C"/>
      <text x="50%" y="50%" fill="#ffffff" fill-opacity="0.4" font-family="monospace"
            font-size="20" text-anchor="middle" dominant-baseline="middle">No Photo</text>
    </svg>`
  )

export default function HealthHistoryView({ animal, onClose, onVitalsUpdated }: HealthHistoryViewProps) {
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false)

  const photoSrc = animal.photo && animal.photo.trim() !== "" ? animal.photo : FALLBACK_PHOTO

  return (
    <div className={styles.historyFullPage}>
      <Button variant="admin-secondary" onClick={onClose}>
        <ArrowLeft size={14} />
        Back to all animals
      </Button>

      <div className={styles.historyHero}>
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
        <div className={styles.historyHeroOverlay} />
        <div className={styles.historyHeroContent}>
          <span className={styles.panelTag}>{animal.tag} Â· {animal.species}</span>
          <h2 className={styles.panelTitle}>{animal.name}'s Health Log</h2>
          <p className={styles.historyHeroBreed}>{animal.breed}</p>
        </div>
        <Button variant="admin-primary" onClick={() => setIsLogVitalsOpen(true)}>
          Log Vitals
        </Button>
        <Button variant="admin-ghost" square className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className={styles.historyBody}>
        <div className={styles.panelVitalsSummary}>
          <div className={styles.vitalIndicator}>
            <Activity size={14} />
            <span>{animal.heartRate} BPM (Vitals)</span>
          </div>
          <div className={styles.vitalIndicator}>
            <ShieldAlert size={14} />
            <span>{animal.healthStatus}</span>
          </div>
        </div>

        <h3 className={styles.timelineTitle}>Medical Events Timeline</h3>
        {animal.history.length > 0 ? (
          <div className={styles.timeline}>
            {animal.history.map((h, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <Calendar size={12} />
                </div>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineDate}>{h.date}</span>
                  <h4 className={styles.timelineEventTitle}>{h.event}</h4>
                  <p className={styles.timelineNotes}>{h.notes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyTimeline}>
            No health incidents recorded for {animal.name}.
          </div>
        )}
      </div>

      {isLogVitalsOpen && (
        <LogVitalsModal
          animal={animal}
          onClose={() => setIsLogVitalsOpen(false)}
          onSaved={(updatedAnimal) => {
            onVitalsUpdated?.(updatedAnimal)
          }}
        />
      )}
    </div>
  )
}
