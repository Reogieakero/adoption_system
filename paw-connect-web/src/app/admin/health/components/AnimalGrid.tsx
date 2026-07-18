'use client'
import React from 'react'
import AnimalCard from './AnimalCard'
import type { HealthAnimal as Animal } from '@/types'
import styles from './AnimalGrid.module.css'

interface AnimalGridProps {
  animals: Animal[]
  onViewHistory: (animal: Animal) => void
}

export default function AnimalGrid({ animals, onViewHistory }: AnimalGridProps) {
  return (
    <div className={styles.grid}>
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  )
}
