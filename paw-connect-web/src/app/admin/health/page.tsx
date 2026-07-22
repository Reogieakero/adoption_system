'use client'
import React, { useState, useMemo } from 'react'
import HealthHeader from './components/HealthHeader'
import HealthFilters from './components/HealthFilters'
import AnimalGrid from './components/AnimalGrid'
import HealthHistoryView from './components/HealthHistoryView'
import { useAnimalsHealth, useAnimalHealthDetail } from '@/hooks/admin/use-animals-health'
import { HealthAnimal, DropdownName } from '@/types'
import Button from '@/components/ui/button'
import styles from './page.module.css'

export default function HealthMonitoringPage() {
  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string>("All Species")
  const [selectedHealth, setSelectedHealth] = useState<string>("Health Status")
  const [selectedVaccine, setSelectedVaccine] = useState<string>("Vaccination")
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Grid data — fetched from the database
  const { animals, isLoading, error, refetch, setAnimals } = useAnimalsHealth()

  // Health History Detail State — only the id is tracked here; the full
  // record (including history) is fetched on demand when a card is opened
  const [activeHistoryAnimalId, setActiveHistoryAnimalId] = useState<string | null>(null)
  const {
    animal: activeHistoryAnimal,
    isLoading: isHistoryLoading,
    refetch: refetchHistoryAnimal,
  } = useAnimalHealthDetail(activeHistoryAnimalId)

  // Filter animals based on search query and select filter states
  const filteredAnimals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return animals.filter((animal) => {
      // 1. Search Query filter (matches name, breed, ID/tag)
      const matchesQuery =
        !query ||
        animal.name.toLowerCase().includes(query) ||
        animal.breed.toLowerCase().includes(query) ||
        animal.id.toLowerCase().includes(query) ||
        (animal.tag && animal.tag.toLowerCase().includes(query))

      // 2. Species filter
      const matchesSpecies =
        selectedSpecies === "All Species" ||
        animal.species.toLowerCase() === selectedSpecies.toLowerCase()

      // 3. Health Status filter
      const matchesHealth =
        selectedHealth === "Health Status" ||
        (selectedHealth === "Treatment" &&
          (animal.healthStatus === "Under Treatment" || animal.healthStatus === "Recovering")) ||
        animal.healthStatus.toLowerCase() === selectedHealth.toLowerCase()

      // 4. Vaccination filter
      const matchesVaccine =
        selectedVaccine === "Vaccination" ||
        (selectedVaccine === "Vaccinated" && animal.vaccinationStatus === "Vaccinated") ||
        (selectedVaccine === "Due" &&
          (animal.vaccinationStatus === "Due" || animal.vaccinationStatus === "Not Fully Vaccinated")) ||
        (selectedVaccine === "Not Vaccinated" && animal.vaccinationStatus === "Not Vaccinated")

      return matchesQuery && matchesSpecies && matchesHealth && matchesVaccine
    })
  }, [animals, searchQuery, selectedSpecies, selectedHealth, selectedVaccine])

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

  const handleViewHistory = (animal: HealthAnimal) => {
    setActiveHistoryAnimalId(animal.id)
  }

  const handleCloseHistory = () => {
    setActiveHistoryAnimalId(null)
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
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedSpecies={selectedSpecies}
              selectedHealth={selectedHealth}
              selectedVaccine={selectedVaccine}
              onSelectSpecies={handleSelectSpecies}
              onSelectHealth={handleSelectHealth}
              onSelectVaccine={handleSelectVaccine}
            />

            {isLoading && <p>Loading animals…</p>}
            {!isLoading && error && (
              <p role="alert">
                {error}{' '}
                <Button variant="admin-secondary" onClick={() => refetch()}>Retry</Button>
              </p>
            )}
            {!isLoading && !error && (
              <AnimalGrid
                animals={filteredAnimals}
                onViewHistory={handleViewHistory}
              />
            )}
          </>
        ) : isHistoryLoading ? (
          <p>Loading health history…</p>
        ) : !activeHistoryAnimal ? (
          <p role="alert">
            Failed to load health history.{' '}
            <Button variant="admin-secondary" onClick={() => refetchHistoryAnimal()}>
              Retry
            </Button>
          </p>
        ) : (
          <HealthHistoryView
            animal={activeHistoryAnimal}
            onClose={handleCloseHistory}
          />
        )}
      </div>
    </>
  )
}


