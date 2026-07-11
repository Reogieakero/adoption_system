'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import { Animal } from '../types'
import styles from './AnimalCard.module.css'

interface AnimalCardProps {
  animal: Animal
  onViewHistory: (animal: Animal) => void
}

export default function AnimalCard({ animal, onViewHistory }: AnimalCardProps) {
  const healthClass = animal.healthStatus === "Healthy"
    ? styles.healthHealthy
    : animal.healthStatus === "Under Treatment"
    ? styles.healthTreatment
    : styles.healthCritical

  const vaccineClass = animal.vaccinationStatus === "Vaccinated"
    ? styles.vaccineVaccinated
    : animal.vaccinationStatus === "Due"
    ? styles.vaccineDue
    : styles.vaccineNotVaccinated

  const isCritical = animal.healthStatus === "Critical"

  return (
    <div className={styles.card}>
      <img src={animal.photo} alt={animal.name} className={styles.cardImage} />
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

        <div className={styles.cardFooter}>
          <button
            className={styles.btnSecondary}
            onClick={() => onViewHistory(animal)}
          >
            View Health History
          </button>
        </div>
      </div>
    </div>
  )
}
