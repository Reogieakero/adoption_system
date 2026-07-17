'use client'
import React, { useState } from 'react'
import HealthHeader from './components/HealthHeader'
import HealthFilters from './components/HealthFilters'
import AnimalGrid from './components/AnimalGrid'
import HealthHistoryView from './components/HealthHistoryView'
import { useAnimalsHealth, useAnimalHealthDetail } from '@/hooks/admin/use-animals-health'
import { Animal, DropdownName } from './types'
import Button from '@/components/ui/button'
import styles from './page.module.css'

export default function HealthMonitoringPage() {
  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string>("All Species")
  const [selectedHealth, setSelectedHealth] = useState<string>("Health Status")
  const [selectedVaccine, setSelectedVaccine] = useState<string>("Vaccination")

  // Grid data â€” fetched from the database
  const { animals, isLoading, error, refetch, setAnimals } = useAnimalsHealth()

  // Health History Detail State â€” only the id is tracked here; the full
  // record (including history) is fetched on demand when a card is opened
  const [activeHistoryAnimalId, setActiveHistoryAnimalId] = useState<string | null>(null)
  const {
    animal: activeHistoryAnimal,
    isLoading: isHistoryLoading,
    refetch: refetchHistoryAnimal,
  } = useAnimalHealthDetail(activeHistoryAnimalId)

  const toggleDropdown = (name: DropdownName) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const handleSelectSpecies = (value: string) => {
    setSelectedSpecies(value)
    setOpenDropdown(null)
  }

  const handleSelectHealth = (value: string) => {
    setSelectedHealth(value)
    setOpenDropdown(null)
  }

  const handleSelectVaccine = (value: string) => {
    setSelectedVaccine(value)
    setOpenDropdown(null)
  }

  const handleViewHistory = (animal: Animal) => {
    setActiveHistoryAnimalId(animal.id)
  }

  const handleCloseHistory = () => {
    setActiveHistoryAnimalId(null)
  }

  const handleVitalsUpdated = (updatedAnimal: Animal) => {
    setAnimals((prev) =>
      prev.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
    )
    if (activeHistoryAnimalId === updatedAnimal.id) {
      refetchHistoryAnimal()
    }
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
      />
      <div className={styles.container}>
        <HealthHeader />

        {openDropdown && (
          <div className={styles.dropdownBackdrop} onClick={() => setOpenDropdown(null)} />
        )}

        {!activeHistoryAnimalId ? (
          <>
            <HealthFilters
              selectedSpecies={selectedSpecies}
              selectedHealth={selectedHealth}
              selectedVaccine={selectedVaccine}
              onSelectSpecies={handleSelectSpecies}
              onSelectHealth={handleSelectHealth}
              onSelectVaccine={handleSelectVaccine}
            />

            {isLoading && <p>Loading animalsâ€¦</p>}
            {!isLoading && error && (
              <p role="alert">
                {error}{' '}
                <Button variant="admin-secondary" onClick={() => refetch()}>Retry</Button>
              </p>
            )}
            {!isLoading && !error && (
              <AnimalGrid
                animals={animals}
                onViewHistory={handleViewHistory}
                onVitalsUpdated={handleVitalsUpdated}
              />
            )}
          </>
        ) : isHistoryLoading || !activeHistoryAnimal ? (
          <p>Loading health historyâ€¦</p>
        ) : (
          <HealthHistoryView
            animal={activeHistoryAnimal}
            onClose={handleCloseHistory}
            onVitalsUpdated={handleVitalsUpdated}
          />
        )}
      </div>
    </>
  )
}

