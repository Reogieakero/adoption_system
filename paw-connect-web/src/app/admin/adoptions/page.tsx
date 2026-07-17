'use client';

import React, { useState, useMemo } from 'react';
import type { StatusType, ViewModeType } from './types';
import { useAdoptions } from '@/hooks/admin/use-adoptions';
import { updateAdoptionStatus } from '@/services/adoptions.api';
import { SummaryCards } from './components/SummaryCards';
import { StatusTabs } from './components/StatusTabs';
import { Toolbar } from './components/Toolbar';
import { ApplicationsTable } from './components/ApplicationsTable';
import { ApplicationsCardGrid } from './components/ApplicationsCardGrid';
import { AdoptedCarousel } from './components/AdoptedCarousel';
import { ApplicationDetailsModal } from './components/ApplicationDetailsModal';
import styles from './page.module.css';

export default function AdoptionManagementPage() {
  const { applications, isLoading, error, setApplications } = useAdoptions();
  const [activeTab, setActiveTab] = useState<StatusType>('Pending');
  const [viewMode, setViewMode] = useState<ViewModeType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All species');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const counts = useMemo((): Record<StatusType, number> => {
    return {
      Pending: applications.filter((a) => a.status === 'Pending').length,
      'Under Review': applications.filter((a) => a.status === 'Under Review').length,
      Approved: applications.filter((a) => a.status === 'Approved').length,
      Rejected: applications.filter((a) => a.status === 'Rejected').length,
      Adopted: applications.filter((a) => a.status === 'Adopted').length,
    };
  }, [applications]);

  const latestAdopted = useMemo(() => {
    return applications
      .filter((a) => a.status === 'Adopted')
      .sort((a, b) => (a.applicationDate < b.applicationDate ? 1 : -1))
      .slice(0, 5);
  }, [applications]);

  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedApplicationId) ?? null,
    [applications, selectedApplicationId]
  );

  const updateStatus = async (id: string, newStatus: StatusType) => {
    const previous = applications;
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    try {
      await updateAdoptionStatus(id, newStatus);
    } catch (err) {
      setApplications(previous);
      console.error('Failed to update status', err);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (app.status !== activeTab) return false;

      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = speciesFilter === 'All species' || app.species === speciesFilter;
      const matchesDate = !dateFilter || app.applicationDate === dateFilter;

      return matchesSearch && matchesSpecies && matchesDate;
    });
  }, [applications, activeTab, searchQuery, speciesFilter, dateFilter]);

  return (
    <div className={styles.dashboardContainer}>
      <AdoptedCarousel animals={latestAdopted} />

      {error && <p className={styles.errorText}>{error}</p>}

      <SummaryCards counts={counts} activeTab={activeTab} onSelect={setActiveTab} />

      <StatusTabs counts={counts} activeTab={activeTab} onChange={setActiveTab} />

      <div className={styles.tableWorkspaceCard}>
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          speciesFilter={speciesFilter}
          onSpeciesFilterChange={setSpeciesFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {isLoading ? (
          <p className={styles.loadingText}>Loading applicationsâ€¦</p>
        ) : viewMode === 'table' ? (
          <ApplicationsTable
            applications={filteredApplications}
            onUpdateStatus={updateStatus}
            onViewDetails={(app) => setSelectedApplicationId(app.id)}
          />
        ) : (
          <ApplicationsCardGrid
            applications={filteredApplications}
            onUpdateStatus={updateStatus}
            onViewDetails={(app) => setSelectedApplicationId(app.id)}
          />
        )}
      </div>

      <ApplicationDetailsModal
        application={selectedApplication}
        onClose={() => setSelectedApplicationId(null)}
      />
    </div>
  );
}


