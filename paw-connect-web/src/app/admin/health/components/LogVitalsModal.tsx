'use client'
import React, { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import { Animal, HealthStatus, VaccinationStatus } from '../types'
import { addAnimalHistoryEntry, updateAnimalVitals } from '@/services/health.api'
import Button from '@/components/ui/button'
import styles from './LogVitalsModal.module.css'

const HEALTH_STATUS_OPTIONS: HealthStatus[] = [
  'Healthy',
  'Under Treatment',
  'Recovering',
  'Critical',
]

const VACCINATION_STATUS_OPTIONS: VaccinationStatus[] = [
  'Vaccinated',
  'Not Fully Vaccinated',
  'Due',
  'Not Vaccinated',
]

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

interface LogVitalsModalProps {
  animal: Animal
  onClose: () => void
  onSaved: (updatedAnimal: Animal) => void
}

export default function LogVitalsModal({ animal, onClose, onSaved }: LogVitalsModalProps) {
  const [date, setDate] = useState(todayIso())
  const [event, setEvent] = useState('')
  const [notes, setNotes] = useState('')
  const [heartRate, setHeartRate] = useState(String(animal.heartRate))
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(animal.healthStatus)
  const [vaccinationStatus, setVaccinationStatus] = useState<VaccinationStatus>(
    animal.vaccinationStatus
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dropdown UI visibility states
  const [healthOpen, setHealthOpen] = useState(false)
  const [vacOpen, setVacOpen] = useState(false)

  const healthRef = useRef<HTMLDivElement>(null)
  const vacRef = useRef<HTMLDivElement>(null)

  // Close custom drop-downs when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (healthRef.current && !healthRef.current.contains(e.target as Node)) {
        setHealthOpen(false)
      }
      if (vacRef.current && !vacRef.current.contains(e.target as Node)) {
        setVacOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !event.trim() || !notes.trim()) {
      setError('Date, event, and notes are required.')
      return
    }

    const parsedHeartRate = Number(heartRate)
    if (Number.isNaN(parsedHeartRate) || parsedHeartRate < 0) {
      setError('Heart rate must be a valid non-negative number.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await updateAnimalVitals(animal.id, {
        heartRate: parsedHeartRate,
        healthStatus,
        vaccinationStatus,
      })

      const updatedAnimal = await addAnimalHistoryEntry(animal.id, {
        date,
        event: event.trim(),
        notes: notes.trim(),
      })

      onSaved(updatedAnimal)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vitals.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2>Log Vitals</h2>
            <p>{animal.name} Â· {animal.tag}</p>
          </div>
          <Button
            variant="admin-ghost"
            square
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} />
          </Button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="log-vitals-date">Date</label>
              <input
                id="log-vitals-date"
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={todayIso()}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="log-vitals-heart-rate">Heart Rate (bpm)</label>
              <input
                id="log-vitals-heart-rate"
                type="number"
                min={0}
                className={styles.input}
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            {/* Custom Shadcn-styled Health Status Select Dropdown */}
            <div className={styles.field} ref={healthRef}>
              <span className={styles.label}>Health Status</span>
              <button
                type="button"
                className={styles.customSelectTrigger}
                onClick={() => {
                  setHealthOpen(!healthOpen)
                  setVacOpen(false)
                }}
              >
                <span>{healthStatus}</span>
                <ChevronDown size={14} className={styles.chevron} />
              </button>
              
              {healthOpen && (
                <div className={styles.selectPopover}>
                  {HEALTH_STATUS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.selectOption} ${healthStatus === option ? styles.selected : ''}`}
                      onClick={() => {
                        setHealthStatus(option)
                        setHealthOpen(false)
                      }}
                    >
                      {option}
                      {healthStatus === option && <Check size={14} className={styles.checkIcon} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Shadcn-styled Vaccination Status Select Dropdown */}
            <div className={styles.field} ref={vacRef}>
              <span className={styles.label}>Vaccination</span>
              <button
                type="button"
                className={styles.customSelectTrigger}
                onClick={() => {
                  setVacOpen(!vacOpen)
                  setHealthOpen(false)
                }}
              >
                <span>{vaccinationStatus}</span>
                <ChevronDown size={14} className={styles.chevron} />
              </button>

              {vacOpen && (
                <div className={styles.selectPopover}>
                  {VACCINATION_STATUS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.selectOption} ${vaccinationStatus === option ? styles.selected : ''}`}
                      onClick={() => {
                        setVaccinationStatus(option)
                        setVacOpen(false)
                      }}
                    >
                      {option}
                      {vaccinationStatus === option && <Check size={14} className={styles.checkIcon} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="log-vitals-event">Event / Reason</label>
            <input
              id="log-vitals-event"
              type="text"
              className={styles.input}
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="e.g. Routine Checkup, Vaccination, Emergency Admission"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="log-vitals-notes">Notes</label>
            <textarea
              id="log-vitals-notes"
              className={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vet observations, treatment given, follow-up neededâ€¦"
              required
            />
          </div>

          <div className={styles.footer}>
            <Button variant="admin-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="admin-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Vitals'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

