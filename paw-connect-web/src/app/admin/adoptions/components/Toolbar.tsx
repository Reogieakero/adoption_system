import React from 'react';
import type { ViewModeType } from '../types';
import DatePicker from '@/components/ui/date-picker';
import SearchBar from '@/components/ui/search-bar';
import ShadcnSelect from '@/components/ui/shadcn-select';
import Button from '@/components/ui/button';
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
    <div className={styles.tableFilters}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Filter by applicant or pet name..."
        />
      </div>
      <div className={styles.filterGroup}>
        <DatePicker value={dateFilter} onChange={onDateFilterChange} />
        <ShadcnSelect
          options={['All species', 'Dog', 'Cat']}
          value={speciesFilter}
          onChange={onSpeciesFilterChange}
          placeholder="All species"
        />
        <div className={styles.toggleGroup}>
          <Button
            variant="admin-ghost"
            square
            active={viewMode === 'table'}
            onClick={() => onViewModeChange('table')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
          <Button
            variant="admin-ghost"
            square
            active={viewMode === 'card'}
            onClick={() => onViewModeChange('card')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

