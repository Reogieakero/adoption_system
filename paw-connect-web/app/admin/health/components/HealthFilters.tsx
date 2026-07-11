'use client'
import React from 'react'
import { Search } from 'lucide-react'
import ShadcnSelect from './ShadcnSelect'
import { DropdownName } from '../types'
import styles from './HealthFilters.module.css'

const SPECIES_OPTIONS = ["All Species", "Dog", "Cat", "Rabbit"]
const HEALTH_OPTIONS = ["Health Status", "Healthy", "Treatment", "Critical"]
const VACCINE_OPTIONS = ["Vaccination", "Vaccinated", "Due", "Not Vaccinated"]

interface HealthFiltersProps {
  openDropdown: DropdownName
  selectedSpecies: string
  selectedHealth: string
  selectedVaccine: string
  onToggleDropdown: (name: DropdownName) => void
  onSelectSpecies: (value: string) => void
  onSelectHealth: (value: string) => void
  onSelectVaccine: (value: string) => void
}

export default function HealthFilters({
  openDropdown,
  selectedSpecies,
  selectedHealth,
  selectedVaccine,
  onToggleDropdown,
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
          selected={selectedSpecies}
          isOpen={openDropdown === 'species'}
          width={130}
          onToggle={() => onToggleDropdown('species')}
          onSelect={onSelectSpecies}
        />

        <ShadcnSelect
          options={HEALTH_OPTIONS}
          selected={selectedHealth}
          isOpen={openDropdown === 'health'}
          width={140}
          onToggle={() => onToggleDropdown('health')}
          onSelect={onSelectHealth}
        />

        <ShadcnSelect
          options={VACCINE_OPTIONS}
          selected={selectedVaccine}
          isOpen={openDropdown === 'vaccine'}
          width={140}
          onToggle={() => onToggleDropdown('vaccine')}
          onSelect={onSelectVaccine}
        />
      </div>
    </div>
  )
}
