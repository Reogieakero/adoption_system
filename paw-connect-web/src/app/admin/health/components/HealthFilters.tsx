'use client'
import React from 'react'
import SearchBar from '@/components/ui/search-bar'
import ShadcnSelect from '@/components/ui/shadcn-select'
import styles from './HealthFilters.module.css'

const SPECIES_OPTIONS = ["All Species", "Dog", "Cat", "Rabbit"]
const HEALTH_OPTIONS = ["Health Status", "Healthy", "Treatment", "Critical"]
const VACCINE_OPTIONS = ["Vaccination", "Vaccinated", "Due", "Not Vaccinated"]

interface HealthFiltersProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  selectedSpecies: string
  selectedHealth: string
  selectedVaccine: string
  onSelectSpecies: (value: string) => void
  onSelectHealth: (value: string) => void
  onSelectVaccine: (value: string) => void
}

export default function HealthFilters({
  searchQuery,
  onSearchQueryChange,
  selectedSpecies,
  selectedHealth,
  selectedVaccine,
  onSelectSpecies,
  onSelectHealth,
  onSelectVaccine
}: HealthFiltersProps) {
  return (
    <div className={styles.controlsRow}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search by name, breed, ID..."
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.healthLegend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.bgTeal}`} /> Healthy
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.bgOrange}`} /> Recovering
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.bgPrimary}`} /> Treatment
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.bgWhite}`} /> Critical
          </div>
        </div>

        <ShadcnSelect
          options={SPECIES_OPTIONS}
          value={selectedSpecies}
          width={130}
          onChange={onSelectSpecies}
        />

        <ShadcnSelect
          options={HEALTH_OPTIONS}
          value={selectedHealth}
          width={140}
          onChange={onSelectHealth}
        />

        <ShadcnSelect
          options={VACCINE_OPTIONS}
          value={selectedVaccine}
          width={140}
          onChange={onSelectVaccine}
        />
      </div>
    </div>
  )
}


