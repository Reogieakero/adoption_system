'use client'
import React from 'react'
import { Plus } from 'lucide-react'
import styles from './HealthHeader.module.css'

export default function HealthHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Health Monitoring</h1>
        <p className={styles.subtitle}>Real-time vital tracking and medical statuses for shelter residents.</p>
      </div>
      <button className={styles.btnPrimary}>
        <Plus size={14} />
        Log Vitals
      </button>
    </div>
  )
}
