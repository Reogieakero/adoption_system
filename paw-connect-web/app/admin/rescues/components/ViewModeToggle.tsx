import React from 'react';
import styles from './ViewModeToggle.module.css';

export type ViewMode = 'cards' | 'table';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className={styles.toggleGroup}>
      <button
        type="button"
        className={`${styles.toggleOption} ${viewMode === 'cards' ? styles.toggleOptionActive : ''}`}
        onClick={() => onChange('cards')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Cards
      </button>
      <button
        type="button"
        className={`${styles.toggleOption} ${viewMode === 'table' ? styles.toggleOptionActive : ''}`}
        onClick={() => onChange('table')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Table
      </button>
    </div>
  );
}
