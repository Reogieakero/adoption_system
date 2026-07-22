"use client";

import React, { useMemo, useState } from 'react';
import styles from './page.module.css';
import type { Pet } from '@/types';
import { useAnimals } from '@/hooks/admin/use-animals';
import StatsGrid, { StatItem } from './components/StatsGrid';
import Toolbar from './components/Toolbar';
import AnimalGrid from './components/AnimalGrid';
import Pagination from './components/Pagination';

const SPECIES_OPTIONS = ['dog', 'cat'];
const ADOPTION_STATUSES = ['All', 'available', 'pending', 'adopted', 'pending_verification', 'rejected'];

function buildStats(animals: Pet[]): StatItem[] {
  return [
    { label: 'Total Animals', value: animals.length },
    {
      label: 'Available',
      value: animals.filter((a) => a.status === 'available').length,
      color: '#10b981',
    },
    {
      label: 'Pending Verification',
      value: animals.filter((a) => a.status === 'pending_verification').length,
      color: '#f59e0b',
    },
    {
      label: 'Pending',
      value: animals.filter((a) => a.status === 'pending').length,
      color: '#ef4444',
    },
    {
      label: 'Adopted',
      value: animals.filter((a) => a.status === 'adopted').length,
      color: 'var(--text-primary)',
    },
    {
      label: 'Rejected',
      value: animals.filter((a) => a.status === 'rejected').length,
      color: 'var(--text-muted)',
    },
  ];
}

export default function AnimalsPage() {
  const { animals, isLoading, error, refetch } = useAnimals();
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const filteredAnimals = useMemo(() => {
    const query = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';

    return animals.filter((animal) => {
      const matchesQuery =
        !query ||
        animal.name.toLowerCase().includes(query) ||
        (animal.breed_detail ?? '').toLowerCase().includes(query) ||
        String(animal.pet_id).includes(query);
      const matchesSpecies = speciesFilter === 'All' || animal.species === speciesFilter;
      const matchesStatus = statusFilter === 'All' || animal.status === statusFilter;
      return matchesQuery && matchesSpecies && matchesStatus;
    });
  }, [animals, searchQuery, speciesFilter, statusFilter]);

  const stats = useMemo(() => buildStats(animals), [animals]);

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
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <StatsGrid stats={stats} />

        <Toolbar
          searchQuery={typeof searchQuery === 'string' ? searchQuery : ''}
          onSearchChange={handleSearchChange}
          speciesFilter={typeof speciesFilter === 'string' ? speciesFilter : 'all'}
          onSpeciesChange={handleSpeciesChange}
          speciesOptions={SPECIES_OPTIONS}
          statusFilter={typeof statusFilter === 'string' ? statusFilter : 'all'}
          onStatusChange={handleStatusChange}
          statusOptions={ADOPTION_STATUSES}
          addLabel="Add Animal"
        />

        {isLoading ? (
          <div className={styles.loadingState}>Loading animals…</div>
        ) : (
          <AnimalGrid
            animals={filteredAnimals}
            getHref={(animal) => `/admin/animals/${animal.pet_id}`}
          />
        )}

        <Pagination
          shownCount={filteredAnimals.length}
          totalCount={animals.length}
          hasNextPage={false}
        />
      </div>
    </div>
  );
}
