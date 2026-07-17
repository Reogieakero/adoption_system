import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import SearchBar from '@/components/ui/search-bar';
import ShadcnSelect from '@/components/ui/shadcn-select';
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
  addLabel = 'Add Animal',
}: ToolbarProps) {
  return (
    <div className={styles.toolbarRow}>
      <div className={styles.leftControls}>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className={styles.rightControls}>
        <ShadcnSelect
          options={['All', ...speciesOptions]}
          value={speciesFilter}
          onChange={onSpeciesChange}
          placeholder="All Species"
          width={150}
        />

        <ShadcnSelect
          options={statusOptions.map((opt) => ({
            label: opt === 'All' ? 'All Statuses' : opt,
            value: opt,
          }))}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="All Statuses"
          width={160}
        />

        <Link href="/admin/animals/new">
          <Button variant="admin-primary">{addLabel}</Button>
        </Link>
      </div>
    </div>
  );
}
