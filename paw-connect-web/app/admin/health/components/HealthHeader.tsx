'use client'
import React from 'react'
import { Plus } from 'lucide-react'
import styles from './HealthHeader.module.css'

export default function HealthHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Health Monitoring</h1>
      </div>
    </div>
  )
}
