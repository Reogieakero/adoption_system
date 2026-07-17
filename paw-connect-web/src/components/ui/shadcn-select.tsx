'use client'
import React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './shadcn-select.module.css'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[] | string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  width?: number
  showLeftIcon?: boolean
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  width,
  showLeftIcon = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  return (
    <div className={styles.selectContainer} ref={containerRef}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerOpen : ''}`}
        style={width ? { width } : undefined}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={styles.selectChevron} />
      </button>
      {isOpen && (
        <div className={styles.selectContent}>
          {normalizedOptions.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.selectItem} ${value === opt.value ? styles.selectItemActive : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false) }}
            >
              {value === opt.value && <Check size={12} className={styles.selectCheckIcon} />}
              <span className={styles.selectItemText}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
