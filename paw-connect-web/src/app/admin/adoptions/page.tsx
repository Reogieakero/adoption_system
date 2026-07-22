'use client';

import React, { useState, useMemo } from 'react';
import type { AdoptionStatus, ViewMode, UpdateApplicationStatusPayload } from '@/types';
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
  const [activeTab, setActiveTab] = useState<AdoptionStatus>('pending_review');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All species');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  const counts = useMemo((): Record<AdoptionStatus, number> => {
    return {
      pending_review: applications.filter((a) => a.status === 'pending_review').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
      pet_unavailable: applications.filter((a) => a.status === 'pet_unavailable').length,
    };
  }, [applications]);

  const latestAdopted = useMemo(() => {
    return [];
  }, [applications]);

  const selectedApplication = useMemo(
    () => applications.find((a) => a.application_id === selectedApplicationId) ?? null,
    [applications, selectedApplicationId]
  );

  const updateStatus = async (id: number, newStatus: AdoptionStatus) => {
    const previous = applications;
    setApplications((prev) =>
      prev.map((app) => (app.application_id === id ? { ...app, status: newStatus } : app))
    );
    try {
      const payload: UpdateApplicationStatusPayload = { status: newStatus };
      await updateAdoptionStatus(id, payload);
    } catch (err) {
      setApplications(previous);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (app.status !== activeTab) return false;

      const matchesSearch =
        app.resident_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.pet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(app.application_id).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = speciesFilter === 'All species' || app.pet_species === speciesFilter;
      const matchesDate = !dateFilter || app.submitted_at === dateFilter;

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
            onViewDetails={(app) => setSelectedApplicationId(app.application_id)}
          />
        ) : (
          <ApplicationsCardGrid
            applications={filteredApplications}
            onUpdateStatus={updateStatus}
            onViewDetails={(app) => setSelectedApplicationId(app.application_id)}
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


