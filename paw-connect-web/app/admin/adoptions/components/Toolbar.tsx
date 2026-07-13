import React from 'react';
import type { ViewModeType } from '../types';
import { CustomSelect } from './CustomSelect';
import { CustomDatePicker } from './CustomDatePicker';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  speciesFilter: string;
  onSpeciesFilterChange: (val: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  viewMode: ViewModeType;
  onViewModeChange: (mode: ViewModeType) => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  speciesFilter,
  onSpeciesFilterChange,
  dateFilter,
  onDateFilterChange,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Filter by applicant or pet name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <CustomDatePicker value={dateFilter} onChange={onDateFilterChange} />
        <CustomSelect
          value={speciesFilter}
          options={['All species', 'Dog', 'Cat']}
          onChange={onSpeciesFilterChange}
        />

        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleItem} ${viewMode === 'table' ? styles.toggleItemActive : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.toggleItem} ${viewMode === 'card' ? styles.toggleItemActive : ''}`}
            onClick={() => onViewModeChange('card')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
