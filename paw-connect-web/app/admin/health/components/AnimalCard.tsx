'use client'
import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { Animal } from '../types'
import LogVitalsModal from './LogVitalsModal'
import styles from './AnimalCard.module.css'

interface AnimalCardProps {
  animal: Animal
  onViewHistory: (animal: Animal) => void
  onVitalsUpdated?: (updatedAnimal: Animal) => void
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

export default function AnimalCard({ animal, onViewHistory, onVitalsUpdated }: AnimalCardProps) {
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false)

  const healthClass =
    animal.healthStatus === "Healthy"
      ? styles.healthHealthy
      : animal.healthStatus === "Under Treatment" || animal.healthStatus === "Recovering"
      ? styles.healthTreatment
      : styles.healthCritical

  const vaccineClass =
    animal.vaccinationStatus === "Vaccinated"
      ? styles.vaccineVaccinated
      : animal.vaccinationStatus === "Due" || animal.vaccinationStatus === "Not Fully Vaccinated"
      ? styles.vaccineDue
      : styles.vaccineNotVaccinated

  const isCritical = animal.healthStatus === "Critical"
  const photoSrc = animal.photo && animal.photo.trim() !== "" ? animal.photo : FALLBACK_PHOTO

  return (
    <div className={styles.card}>
      <img
        src={photoSrc}
        alt={animal.name}
        className={styles.cardImage}
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK_PHOTO) {
            e.currentTarget.src = FALLBACK_PHOTO
          }
        }}
      />
      <div className={styles.cardOverlay} />

      <span className={styles.speciesTag}>{animal.species}</span>

      <div className={styles.cardContent}>
        <h3 className={styles.animalName}>{animal.name}</h3>
        <p className={styles.animalBreed}>{animal.breed}</p>

        <div className={styles.metaRow}>
          <span className={styles.animalId}>{animal.tag}</span>
          <div className={styles.vitalChip}>
            <Heart size={11} className={isCritical ? styles.heartCritical : styles.heartIcon} />
            <span>{animal.heartRate} bpm</span>
          </div>
        </div>

        <div className={styles.badgeGroup}>
          <span className={`${styles.badge} ${vaccineClass}`}>
            {animal.vaccinationStatus}
          </span>
          <span className={`${styles.badge} ${healthClass}`}>
            {animal.healthStatus}
          </span>
        </div>

        <div className={styles.cardFooter} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            className={styles.btnWhite}
            onClick={() => onViewHistory(animal)}
          >
            View Health History
          </button>
          <button
            className={styles.btnBlack}
            onClick={() => setIsLogVitalsOpen(true)}
          >
            Log Vitals
          </button>
        </div>
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