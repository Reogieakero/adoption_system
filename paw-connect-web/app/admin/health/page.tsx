'use client'
import React, { useState } from 'react'
import HealthHeader from './components/HealthHeader'
import HealthFilters from './components/HealthFilters'
import AnimalGrid from './components/AnimalGrid'
import HealthHistoryView from './components/HealthHistoryView'
import { animalsHealthData } from './data'
import { Animal, DropdownName } from './types'
import styles from './page.module.css'

export default function HealthMonitoringPage() {
  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string>("All Species")
  const [selectedHealth, setSelectedHealth] = useState<string>("Health Status")
  const [selectedVaccine, setSelectedVaccine] = useState<string>("Vaccination")

  // Health History Detail State
  const [activeHistoryAnimal, setActiveHistoryAnimal] = useState<Animal | null>(null)

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

        {!activeHistoryAnimal ? (
          <>
            <HealthFilters
              openDropdown={openDropdown}
              selectedSpecies={selectedSpecies}
              selectedHealth={selectedHealth}
              selectedVaccine={selectedVaccine}
              onToggleDropdown={toggleDropdown}
              onSelectSpecies={handleSelectSpecies}
              onSelectHealth={handleSelectHealth}
              onSelectVaccine={handleSelectVaccine}
            />

            <AnimalGrid
              animals={animalsHealthData}
              onViewHistory={setActiveHistoryAnimal}
            />
          </>
        ) : (
          <HealthHistoryView
            animal={activeHistoryAnimal}
            onClose={() => setActiveHistoryAnimal(null)}
          />
        )}
      </div>
    </>
  )
}
