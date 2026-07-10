"use client";

import React, { useMemo, useState } from 'react';
import styles from './AnimalsPage.module.css';
import { MOCK_ANIMALS } from './animalsData';
import PageHeader from './components/PageHeader';
import StatsGrid, { StatItem } from './components/StatsGrid';
import Toolbar from './components/Toolbar';
import AnimalGrid from './components/AnimalGrid';
import Pagination from './components/Pagination';

const SPECIES_OPTIONS = ['Dog', 'Cat'];
const ADOPTION_STATUSES = ['All', 'Available', 'Pending', 'Adopted', 'Unavailable'];

const STATS: StatItem[] = [
  { label: 'Total Animals', value: 148 },
  { label: 'Available', value: 64, color: 'var(--ocean)' },
  { label: 'Under Rescue', value: 18, color: 'var(--royal)' },
  { label: 'Under Treatment', value: 12, color: 'var(--ocean)' },
  { label: 'Adopted', value: 54, color: 'var(--navy)' },
  { label: 'Archived', value: 8, color: 'var(--navy-70)' },
];

export default function AnimalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAnimals = useMemo(() => {
    // Robust safety fallback protecting against internal unhandled event assignments
    const query = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';
    
    return MOCK_ANIMALS.filter((animal) => {
      const matchesQuery =
        !query ||
        animal.name.toLowerCase().includes(query) ||
        animal.breed.toLowerCase().includes(query) ||
        animal.id.toLowerCase().includes(query);
      const matchesSpecies = speciesFilter === 'All' || animal.species === speciesFilter;
      const matchesStatus = statusFilter === 'All' || animal.adoptionStatus === statusFilter;
      return matchesQuery && matchesSpecies && matchesStatus;
    });
  }, [searchQuery, speciesFilter, statusFilter]);

  // Clean explicit setter sanitizers ensuring absolute safety from event pollution
  const handleSearchChange = (val: string) => {
    if (typeof val === 'string') setSearchQuery(val);
  };

  const handleSpeciesChange = (val: string) => {
    if (typeof val === 'string') setSpeciesFilter(val);
  };

  const handleStatusChange = (val: string) => {
    if (typeof val === 'string') setStatusFilter(val);
  };

  return (
    <div className={styles.outerShell}>
      <div className={styles.container}>
        <PageHeader
          title="Animals Module"
          subtitle="Manage, monitor, and update rescue and adoption records."
        />

        <StatsGrid stats={STATS} />

        <Toolbar
          searchQuery={typeof searchQuery === 'string' ? searchQuery : ''}
          onSearchChange={handleSearchChange}
          speciesFilter={typeof speciesFilter === 'string' ? speciesFilter : 'All'}
          onSpeciesChange={handleSpeciesChange}
          speciesOptions={SPECIES_OPTIONS}
          statusFilter={typeof statusFilter === 'string' ? statusFilter : 'All'}
          onStatusChange={handleStatusChange}
          statusOptions={ADOPTION_STATUSES}
        />

        <AnimalGrid
          animals={filteredAnimals}
          getHref={(animal) => `/admin/animals/${animal.id}`}
        />

        <Pagination shownCount={filteredAnimals.length} totalCount={148} hasNextPage />
      </div>
    </div>
  );
}

