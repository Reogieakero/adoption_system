'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useHeatmapData } from '@/hooks/admin/use-heatmap-data'
import { HeatmapMode, HeatmapView } from './components/HeatMapCanvas'
import Button from '@/components/ui/button'
import styles from './page.module.css'

// Leaflet touches `window` at import time, so this must never run during SSR.
const HeatMapCanvas = dynamic(() => import('./components/HeatMapCanvas'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading mapâ€¦</div>,
})

const MODE_OPTIONS: { value: HeatmapMode; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'rescue', label: 'Rescue Reports' },
  { value: 'adoption', label: 'Adoptions' },
]

const VIEW_OPTIONS: { value: HeatmapView; label: string }[] = [
  { value: 'heatmap', label: 'Heatmap' },
  { value: 'pins', label: 'Pins' },
]

export default function HeatmapPage() {
  const { data, isLoading, error, refetch } = useHeatmapData()
  const [mode, setMode] = useState<HeatmapMode>('all')
  const [view, setView] = useState<HeatmapView>('heatmap')

  const activeCount =
    mode === 'rescue'
      ? data.rescuePoints.length
      : mode === 'adoption'
      ? data.adoptionPoints.length
      : data.rescuePoints.length + data.adoptionPoints.length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Activity Heatmap</h1>
          <p className={styles.subtitle}>
            Geographic density of rescue reports and completed adoptions
          </p>
        </div>

        <div className={styles.toggleGroup}>
          <div className={styles.modeToggle}>
            {VIEW_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="admin-ghost"
                active={view === option.value}
                onClick={() => setView(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className={styles.modeToggle}>
            {MODE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="admin-ghost"
                active={mode === option.value}
                onClick={() => setMode(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <p className={styles.statusText}>Loading heatmap dataâ€¦</p>}
      {!isLoading && error && (
        <p className={styles.statusText} role="alert">
          {error} <Button variant="admin-secondary" onClick={() => refetch()}>Retry</Button>
        </p>
      )}

      {!isLoading && !error && (
        <>
          <div className={styles.mapWrapper}>
            <HeatMapCanvas
              rescuePoints={data.rescuePoints}
              adoptionPoints={data.adoptionPoints}
              mode={mode}
              view={view}
            />

            {view === 'heatmap' ? (
              <div className={styles.legend}>
                <span className={styles.legendLabel}>Low</span>
                <div className={styles.legendGradient} />
                <span className={styles.legendLabel}>High density</span>
              </div>
            ) : (
              <div className={styles.legend}>
                {mode !== 'adoption' && (
                  <span className={styles.legendPin}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#f2452e' }} />
                    Rescue report
                  </span>
                )}
                {mode !== 'rescue' && (
                  <span className={styles.legendPin}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#0d9488' }} />
                    Adoption
                  </span>
                )}
              </div>
            )}
          </div>

          <p className={styles.pointCount}>
            {activeCount} location{activeCount === 1 ? '' : 's'} plotted
            {mode === 'adoption' && (
              <>
                {' '}
                <span className={styles.pointCountNote}>
                  (adoption points use the animal's original rescue location)
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  )
}

