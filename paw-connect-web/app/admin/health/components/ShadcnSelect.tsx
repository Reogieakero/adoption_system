'use client'
import React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './ShadcnSelect.module.css'

interface ShadcnSelectProps {
  options: string[]
  selected: string
  isOpen: boolean
  width?: number
  onToggle: () => void
  onSelect: (value: string) => void
}

export default function ShadcnSelect({
  options,
  selected,
  isOpen,
  width,
  onToggle,
  onSelect
}: ShadcnSelectProps) {
  return (
    <div className={styles.selectContainer}>
      <button
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerOpen : ''}`}
        style={width ? { width } : undefined}
        onClick={onToggle}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={styles.selectChevron} />
      </button>
      {isOpen && (
        <div className={styles.selectContent}>
          {options.map((opt) => (
            <div
              key={opt}
              className={styles.selectItem}
              onClick={() => onSelect(opt)}
            >
              {selected === opt && <Check size={12} className={styles.selectCheckIcon} />}
              <span className={styles.selectItemText}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
