'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { AdoptionHeatPoint, RescueHeatPoint } from '@/types'
import styles from './HeatMapCanvas.module.css'

if (typeof window !== 'undefined') {
  ;(window as any).L = L
  require('leaflet.heat')
}

export type HeatmapMode = 'all' | 'rescue' | 'adoption'
export type HeatmapView = 'heatmap' | 'pins'

interface HeatMapCanvasProps {
  rescuePoints: RescueHeatPoint[]
  adoptionPoints: AdoptionHeatPoint[]
  mode: HeatmapMode
  view: HeatmapView
}

const MATI_CITY_CENTER: [number, number] = [6.9500, 126.2167]
const MATI_CITY_BOUNDS: [[number, number], [number, number]] = [
  [6.75, 126.05], // southwest
  [7.15, 126.40], // northeast
]
const DEFAULT_ZOOM = 12
const MIN_ZOOM = 11

const IRONBOW_GRADIENT: Record<number, string> = {
  0.0: '#00000a',
  0.15: '#1e0a78',
  0.3: '#5b0ea6',
  0.45: '#c81e6e',
  0.6: '#f2452e',
  0.75: '#ffa600',
  0.9: '#ffe600',
  1.0: '#ffffff',
}

const RESCUE_PIN_COLOR: Record<RescueHeatPoint['priority'], string> = {
  Critical: '#dc2626',
  High: '#f2452e',
  Medium: '#f59e0b',
  Low: '#facc15',
}
const ADOPTION_PIN_COLOR = '#0d9488'

interface AnyPoint {
  lat: number
  lng: number
  weight: number
}

function isInsideMati(p: AnyPoint): boolean {
  const [[south, west], [north, east]] = MATI_CITY_BOUNDS
  return p.lat >= south && p.lat <= north && p.lng >= west && p.lng <= east
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-PH', { dateStyle: 'medium' })
}

function rescuePopupHtml(p: RescueHeatPoint): string {
  return `
    <div class="${styles.popup}">
      <span class="${styles.popupBadge}" style="background-color:${RESCUE_PIN_COLOR[p.priority]}">${escapeHtml(p.priority)} Â· Rescue</span>
      <strong>${escapeHtml(p.animalType)}</strong>
      <div class="${styles.popupRow}">Status: ${escapeHtml(p.status)}</div>
      <div class="${styles.popupRow}">Barangay: ${escapeHtml(p.barangay)}</div>
      <div class="${styles.popupRow}">Reported: ${escapeHtml(formatDateTime(p.reportedAt))}</div>
      <div class="${styles.popupId}">${escapeHtml(p.id)}</div>
    </div>
  `
}

function adoptionPopupHtml(p: AdoptionHeatPoint): string {
  return `
    <div class="${styles.popup}">
      <span class="${styles.popupBadge}" style="background-color:${ADOPTION_PIN_COLOR}">Adoption</span>
      <strong>${escapeHtml(p.animalName)}</strong>
      <div class="${styles.popupRow}">Barangay: ${escapeHtml(p.barangay)}</div>
      <div class="${styles.popupRow}">Adopted: ${escapeHtml(formatDate(p.applicationDate))}</div>
      <div class="${styles.popupId}">${escapeHtml(p.applicationId)}</div>
    </div>
  `
}

export default function HeatMapCanvas({ rescuePoints, adoptionPoints, mode, view }: HeatMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<any>(null)
  const pinsLayerRef = useRef<L.LayerGroup | null>(null)

  const activeRescue = useMemo(() => rescuePoints.filter(isInsideMati), [rescuePoints])
  const activeAdoption = useMemo(() => adoptionPoints.filter(isInsideMati), [adoptionPoints])

  const activePoints = useMemo<AnyPoint[]>(() => {
    if (mode === 'rescue') return activeRescue
    if (mode === 'adoption') return activeAdoption
    return [...activeRescue, ...activeAdoption]
  }, [mode, activeRescue, activeAdoption])

  // Initialize the map once, locked to Mati City
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const bounds = L.latLngBounds(MATI_CITY_BOUNDS)

    const map = L.map(containerRef.current, {
      center: MATI_CITY_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      zoomControl: true,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0, // fully resist panning past the city bounds
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Heat layer â€” only active when view === 'heatmap'
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (view !== 'heatmap' || activePoints.length === 0) return

    if (typeof (L as any).heatLayer !== 'function') {
      // eslint-disable-next-line no-console
      console.warn(
        '[HeatMapCanvas] L.heatLayer is not available â€” leaflet.heat did not attach correctly. ' +
          'Check that "leaflet.heat" is installed and that window.L was set before it loaded.'
      )
      return
    }

    const latLngWeights = activePoints.map((p) => [p.lat, p.lng, p.weight] as [number, number, number])

    // Scale intensity to the *current* subset rather than a fixed 1.0 â€” if
    // the "Adoptions" toggle only has Medium-weight points, for example,
    // they should still render at full color instead of looking washed out.
    const maxWeight = Math.max(...activePoints.map((p) => p.weight), 0.1)

    heatLayerRef.current = (L as any)
      .heatLayer(latLngWeights, {
        radius: 34,
        blur: 26,
        maxZoom: 17,
        max: maxWeight,
        minOpacity: 0.35,
        gradient: IRONBOW_GRADIENT,
      })
      .addTo(map)
  }, [activePoints, view])

  // Pins layer â€” only active when view === 'pins'
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (pinsLayerRef.current) {
      map.removeLayer(pinsLayerRef.current)
      pinsLayerRef.current = null
    }

    if (view !== 'pins') return

    const group = L.layerGroup()

    if (mode !== 'adoption') {
      activeRescue.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 8,
          weight: 2,
          color: '#ffffff',
          fillColor: RESCUE_PIN_COLOR[p.priority] ?? RESCUE_PIN_COLOR.Medium,
          fillOpacity: 0.9,
        })
          .bindPopup(rescuePopupHtml(p))
          .addTo(group)
      })
    }

    if (mode !== 'rescue') {
      activeAdoption.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 7,
          weight: 2,
          color: '#ffffff',
          fillColor: ADOPTION_PIN_COLOR,
          fillOpacity: 0.9,
        })
          .bindPopup(adoptionPopupHtml(p))
          .addTo(group)
      })
    }

    group.addTo(map)
    pinsLayerRef.current = group
  }, [activeRescue, activeAdoption, mode, view])

  return <div ref={containerRef} className={styles.mapContainer} />
}

