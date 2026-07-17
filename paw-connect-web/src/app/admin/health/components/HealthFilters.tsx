'use client'
import React from 'react'
import { Search } from 'lucide-react'
import ShadcnSelect from '@/components/ui/shadcn-select'
import styles from './HealthFilters.module.css'

const SPECIES_OPTIONS = ["All Species", "Dog", "Cat", "Rabbit"]
const HEALTH_OPTIONS = ["Health Status", "Healthy", "Treatment", "Critical"]
const VACCINE_OPTIONS = ["Vaccination", "Vaccinated", "Due", "Not Vaccinated"]

interface HealthFiltersProps {
  selectedSpecies: string
  selectedHealth: string
  selectedVaccine: string
  onSelectSpecies: (value: string) => void
  onSelectHealth: (value: string) => void
  onSelectVaccine: (value: string) => void
}

export default function HealthFilters({
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
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search animal id, name..."
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
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

