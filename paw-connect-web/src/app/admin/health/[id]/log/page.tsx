'use client'

import React, { useState, useRef, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'
import { useAnimalHealthDetail } from '@/hooks/admin/use-animals-health'
import { fetchHealthRecordByPetId, updateHealthRecord, upsertHealthRecord } from '@/services/health.api'
import { fetchPetById } from '@/services/animals.api'
import type { UpdateHealthRecordPayload, Pet } from '@/types'
import Button from '@/components/ui/button'
import styles from './page.module.css'

const HEALTH_STATUS_OPTIONS = [
  'Healthy',
  'Under Treatment',
  'Recovering',
  'Critical',
]

const VACCINATION_STATUS_OPTIONS = [
  'Vaccinated',
  'Not Fully Vaccinated',
  'Due',
  'Not Vaccinated',
]

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
  const { animal, isLoading } = useAnimalHealthDetail(resolvedParams.id)
  const [petInfo, setPetInfo] = useState<Pet | null>(null)
  const [petInfoLoading, setPetInfoLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !animal) {
      setPetInfoLoading(true)
      fetchPetById(Number(resolvedParams.id))
        .then(setPetInfo)
        .catch(() => {})
        .finally(() => setPetInfoLoading(false))
    }
  }, [isLoading, animal, resolvedParams.id])

  const displayName = animal?.name ?? petInfo?.name ?? 'Unknown'
  const displaySpecies = animal?.species ?? (petInfo?.species ? petInfo.species.charAt(0).toUpperCase() + petInfo.species.slice(1) : 'N/A')
  const displayBreed = animal?.breed ?? petInfo?.breed_detail ?? petInfo?.breed_type ?? ''

  const [event, setEvent] = useState('')
  const [notes, setNotes] = useState('')

  // We initialize these when animal is loaded
  const [heartRate, setHeartRate] = useState('')
  const [healthStatus, setHealthStatus] = useState<string>('')
  const [vaccinationStatus, setVaccinationStatus] = useState<string>('')

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

    if (!event.trim() || !notes.trim() || !healthStatus || !vaccinationStatus) {
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
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const datetime =
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
        `${pad(now.getHours())}:${pad(now.getMinutes())}`
      const newLine = `[${datetime}] ${parsedHeartRate} bpm - ${event.trim()}: ${notes.trim()}`

      let existingHistory: string
      try {
        const existingRecord = await fetchHealthRecordByPetId(Number(resolvedParams.id))
        existingHistory = existingRecord.medical_history ?? ''
      } catch {
        existingHistory = ''
      }

      const medical_history = existingHistory ? `${existingHistory}\n${newLine}` : newLine
      const payload: UpdateHealthRecordPayload = {
        heart_rate_bpm: parsedHeartRate,
        health_status: healthStatus,
        vaccination_status: vaccinationStatus,
        medical_history,
        last_updated_by: 1,
      }

      try {
        await updateHealthRecord(Number(resolvedParams.id), payload)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
          await upsertHealthRecord(Number(resolvedParams.id), {
            heart_rate_bpm: parsedHeartRate,
            health_status: healthStatus,
            vaccination_status: vaccinationStatus,
            medical_history,
          })
        } else {
          throw err
        }
      }

      try {
        const { updatePet } = await import('@/services/animals.api')
        await updatePet(Number(resolvedParams.id), {
          health_status: healthStatus as Pet['health_status'],
        })
      } catch {
        // non-critical — the health record was still saved
      }

      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vitals.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || petInfoLoading) return <div style={{ padding: '32px' }}>Loading animal details...</div>

  const photoSrc = animal?.photo && animal.photo.trim() !== ""
    ? animal.photo
    : petInfo?.primary_photo_url
    ? petInfo.primary_photo_url
    : FALLBACK_PHOTO

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => router.back()} className={styles.backLink}>
          &larr; Back to Health Monitoring
        </button>
      </div>

      <div className={styles.layout}>
        {/* Profile Sidebar */}
        <aside className={styles.profileSidebar}>
          <div className={styles.heroImageContainer}>
            <img
              src={photoSrc}
              alt={displayName}
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
              <span className={styles.panelTag}>{animal?.tag ?? petInfo?.species ?? 'N/A'} • {displaySpecies}</span>
              <h2 className={styles.panelTitle}>{displayName}</h2>
              <p className={styles.heroBreed}>{displayBreed}</p>
            </div>
          </div>
        </aside>

        {/* Form Area */}
        <div className={styles.mainContent}>
          <div className={styles.formHeader}>
            <h2>Log Health Vitals</h2>
            <p>Update {displayName}'s current vitals and add a new medical event log.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.row}>
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
