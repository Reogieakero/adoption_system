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
const HEALTH_STATUSES = ['All', 'Healthy', 'Recovering', 'Under Treatment', 'Critical'];

function buildStats(animals: Pet[]): StatItem[] {
  return [
    { label: 'Total Animals', value: animals.length },
    {
      label: 'Healthy',
      value: animals.filter((a) => a.health_status === 'Healthy').length,
      color: '#10b981',
    },
    {
      label: 'Recovering',
      value: animals.filter((a) => a.health_status === 'Recovering').length,
      color: '#f59e0b',
    },
    {
      label: 'Under Treatment',
      value: animals.filter((a) => a.health_status === 'Under Treatment').length,
      color: '#ef4444',
    },
    {
      label: 'Critical',
      value: animals.filter((a) => a.health_status === 'Critical').length,
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
      const matchesStatus = statusFilter === 'All' || animal.health_status === statusFilter;
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
          statusOptions={HEALTH_STATUSES}
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
