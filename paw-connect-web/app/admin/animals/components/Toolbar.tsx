import React, { useState, useRef, useEffect } from 'react';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  speciesFilter: string;
  onSpeciesChange: (value: string) => void;
  speciesOptions: string[];
  statusFilter: string;
  onStatusChange: (value: string) => void;
  statusOptions: string[];
  onAddClick?: () => void;
  addLabel?: string;
}

export default function Toolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search by name, breed ...',
  speciesFilter,
  onSpeciesChange,
  speciesOptions,
  statusFilter,
  onStatusChange,
  statusOptions,
  onAddClick,
  addLabel = 'Add Animal',
}: ToolbarProps) {
  const [speciesOpen, setSpeciesOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const speciesRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (speciesRef.current && !speciesRef.current.contains(event.target as Node)) {
        setSpeciesOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.toolbarRow}>
      <div className={styles.leftControls}>
        <div className={styles.supabaseSearchWrapper}>
          <div className={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.supabaseSearchInput}
          />
        </div>
      </div>

      <div className={styles.rightControls}>
        <div className={styles.selectContainer} ref={speciesRef}>
          <button 
            className={`${styles.selectTrigger} ${speciesOpen ? styles.selectTriggerActive : ''}`}
            onClick={() => setSpeciesOpen(!speciesOpen)}
            type="button"
          >
            <span>{speciesFilter === 'All' ? 'All Species' : speciesFilter}</span>
            <svg className={styles.chevronIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {speciesOpen && (
            <div className={styles.selectContent}>
              <div 
                className={`${styles.selectItem} ${speciesFilter === 'All' ? styles.selectItemActive : ''}`}
                onClick={() => { onSpeciesChange('All'); setSpeciesOpen(false); }}
              >
                All Species
              </div>
              {speciesOptions.map((species) => (
                <div 
                  key={species} 
                  className={`${styles.selectItem} ${speciesFilter === species ? styles.selectItemActive : ''}`}
                  onClick={() => { onSpeciesChange(species); setSpeciesOpen(false); }}
                >
                  {species}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.selectContainer} ref={statusRef}>
          <button 
            className={`${styles.selectTrigger} ${statusOpen ? styles.selectTriggerActive : ''}`}
            onClick={() => setStatusOpen(!statusOpen)}
            type="button"
          >
            <span>{statusFilter === 'All' ? 'All Statuses' : statusFilter}</span>
            <svg className={styles.chevronIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {statusOpen && (
            <div className={styles.selectContent}>
              {statusOptions.map((status) => (
                <div 
                  key={status} 
                  className={`${styles.selectItem} ${statusFilter === status ? styles.selectItemActive : ''}`}
                  onClick={() => { onStatusChange(status); setStatusOpen(false); }}
                >
                  {status === 'All' ? 'All Statuses' : status}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.addBtn} onClick={onAddClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {addLabel}
        </button>
      </div>
    </div>
  );
}