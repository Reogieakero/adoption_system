'use client'

import React, { useState, useRef, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Check } from 'lucide-react'
import { useAnimalHealthDetail } from '@/hooks/admin/use-animals-health'
import { addAnimalHistoryEntry, updateAnimalVitals } from '@/services/health.api'
import { HealthStatus, VaccinationStatus } from '../../types'
import Button from '@/components/ui/button'
import DatePicker from '@/components/ui/date-picker'
import styles from './page.module.css'

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

const FALLBACK_PHOTO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#170A0C"/>
      <text x="50%" y="50%" fill="#ffffff" fill-opacity="0.4" font-family="monospace"
            font-size="20" text-anchor="middle" dominant-baseline="middle">No Photo</text>
    </svg>`
  )

export default function LogVitalsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { animal, isLoading, error: fetchError } = useAnimalHealthDetail(resolvedParams.id)

  const [date, setDate] = useState(todayIso())
  const [event, setEvent] = useState('')
  const [notes, setNotes] = useState('')

  // We initialize these when animal is loaded
  const [heartRate, setHeartRate] = useState('')
  const [healthStatus, setHealthStatus] = useState<HealthStatus | ''>('')
  const [vaccinationStatus, setVaccinationStatus] = useState<VaccinationStatus | ''>('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dropdown UI visibility states
  const [healthOpen, setHealthOpen] = useState(false)
  const [vacOpen, setVacOpen] = useState(false)

  const healthRef = useRef<HTMLDivElement>(null)
  const vacRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (animal) {
      setHeartRate(String(animal.heartRate))
      setHealthStatus(animal.healthStatus)
      setVaccinationStatus(animal.vaccinationStatus)
    }
  }, [animal])

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

    if (!date || !event.trim() || !notes.trim() || !healthStatus || !vaccinationStatus) {
      setError('All fields are required.')
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
      await updateAnimalVitals(resolvedParams.id, {
        heartRate: parsedHeartRate,
        healthStatus: healthStatus as HealthStatus,
        vaccinationStatus: vaccinationStatus as VaccinationStatus,
      })

      await addAnimalHistoryEntry(resolvedParams.id, {
        date,
        event: event.trim(),
        notes: notes.trim(),
      })

      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vitals.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div style={{ padding: '32px' }}>Loading animal details...</div>
  if (fetchError || !animal) return <div style={{ padding: '32px', color: 'red' }}>Failed to load animal details.</div>

  const photoSrc = animal.photo && animal.photo.trim() !== "" ? animal.photo : FALLBACK_PHOTO

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Button variant="admin-secondary" square onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={16} />
        </Button>
      </div>

      <div className={styles.layout}>
        {/* Profile Sidebar */}
        <aside className={styles.profileSidebar}>
          <div className={styles.heroImageContainer}>
            <img
              src={photoSrc}
              alt={animal.name}
              className={styles.heroImage}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_PHOTO) {
                  e.currentTarget.src = FALLBACK_PHOTO
                }
              }}
            />
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileHeader}>
              <span className={styles.panelTag}>{animal.tag} • {animal.species}</span>
              <h2 className={styles.panelTitle}>{animal.name}</h2>
              <p className={styles.heroBreed}>{animal.breed}</p>
            </div>
          </div>
        </aside>

        {/* Form Area */}
        <div className={styles.mainContent}>
          <div className={styles.formHeader}>
            <h2>Log Health Vitals</h2>
            <p>Update {animal.name}'s current vitals and add a new medical event log.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <DatePicker value={date} onChange={setDate} />
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
                  <span>{healthStatus || "Select Status"}</span>
                  <ChevronDown size={16} className={styles.chevron} />
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
                        {healthStatus === option && <Check size={16} className={styles.checkIcon} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                  <span>{vaccinationStatus || "Select Status"}</span>
                  <ChevronDown size={16} className={styles.chevron} />
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
                        {vaccinationStatus === option && <Check size={16} className={styles.checkIcon} />}
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
                placeholder="Vet observations, treatment given, follow-up needed..."
                required
              />
            </div>

            <div className={styles.footer}>
              <Button variant="admin-secondary" onClick={() => router.back()} disabled={isSubmitting} type="button">
                Cancel
              </Button>
              <Button variant="admin-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Vitals'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
