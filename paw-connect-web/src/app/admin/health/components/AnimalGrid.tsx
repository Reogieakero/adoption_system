'use client'
import React from 'react'
import AnimalCard from './AnimalCard'
import { Animal } from '../types'
import styles from './AnimalGrid.module.css'

interface AnimalGridProps {
  animals: Animal[]
  onViewHistory: (animal: Animal) => void
  onVitalsUpdated?: (updatedAnimal: Animal) => void
}

export default function AnimalGrid({ animals, onViewHistory, onVitalsUpdated }: AnimalGridProps) {
  return (
    <div className={styles.grid}>
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          onViewHistory={onViewHistory}
          onVitalsUpdated={onVitalsUpdated}
        />
      ))}
    </div>
  )
}
