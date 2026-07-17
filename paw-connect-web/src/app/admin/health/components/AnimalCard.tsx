'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Animal } from '../types'
import Button from '@/components/ui/button'
import { resolvePhotoUrl } from '@/services/resolve-photo-url'
import styles from './AnimalCard.module.css'

interface AnimalCardProps {
  animal: Animal
  onViewHistory: (animal: Animal) => void
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

function healthBadgeClass(status: string) {
  switch (status) {
    case 'Healthy':
      return styles.bgTeal
    case 'Recovering':
      return styles.bgOrange
    case 'Under Treatment':
      return styles.bgPrimary
    case 'Critical':
      return styles.bgWhite
    default:
      return styles.bgSlate
  }
}

export default function AnimalCard({ animal, onViewHistory }: AnimalCardProps) {
  const router = useRouter()

  const isCritical = animal.healthStatus === "Critical"
  const photoSrc = resolvePhotoUrl(animal.photo) || FALLBACK_PHOTO

  return (
    <div className={styles.animalCard}>
      <div className={styles.imageWrapper}>
        <div 
          className={`${styles.healthDot} ${healthBadgeClass(animal.healthStatus)}`} 
          title={`Health Status: ${animal.healthStatus}`}
        />
        {photoSrc ? (
          <img
            src={photoSrc}
            alt={animal.name}
            className={styles.cardPhoto}
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_PHOTO) {
                e.currentTarget.src = FALLBACK_PHOTO
              }
            }}
          />
        ) : (
          <div className={styles.cardPhotoPlaceholder}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}

        <div className={styles.overlayInfo}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardName}>{animal.name}</h3>
            <span className={styles.cardSpecies}>{animal.species}</span>
          </div>
          <div className={styles.cardId}>{animal.tag || animal.id}</div>

          <div className={styles.hoverContent}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Breed:</span>
              <span className={styles.detailValue}>{animal.breed}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Heart Rate:</span>
              <span className={styles.detailValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={11} className={isCritical ? styles.heartCritical : styles.heartIcon} />
                {animal.heartRate} bpm
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Vaccine:</span>
              <span className={styles.detailValue}>{animal.vaccinationStatus}</span>
            </div>
          </div>



          <div className={styles.cardFooter}>
            <Button
              variant="admin-secondary"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onViewHistory(animal)
              }}
            >
              History
            </Button>
            <Button
              variant="admin-primary"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/admin/health/${animal.id}/log`)
              }}
            >
              Vitals
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

