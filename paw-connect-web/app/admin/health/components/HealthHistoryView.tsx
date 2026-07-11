'use client'
import React from 'react'
import { X, Calendar, Activity, ShieldAlert, ArrowLeft } from 'lucide-react'
import { Animal } from '../types'
import styles from './HealthHistoryView.module.css'

interface HealthHistoryViewProps {
  animal: Animal
  onClose: () => void
}

export default function HealthHistoryView({ animal, onClose }: HealthHistoryViewProps) {
  return (
    <div className={styles.historyFullPage}>
      <button className={styles.backBtn} onClick={onClose}>
        <ArrowLeft size={14} />
        Back to all animals
      </button>

      <div className={styles.historyHero}>
        <img
          src={animal.photo}
          alt={animal.name}
          className={styles.historyHeroImage}
        />
        <div className={styles.historyHeroOverlay} />
        <div className={styles.historyHeroContent}>
          <span className={styles.panelTag}>{animal.tag} · {animal.species}</span>
          <h2 className={styles.panelTitle}>{animal.name}'s Health Log</h2>
          <p className={styles.historyHeroBreed}>{animal.breed}</p>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
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
    </div>
  )
}
