'use client';

import React, { useState, useMemo } from 'react';
import type { AdoptionApplication, StatusType, ViewModeType } from './types';
import { INITIAL_DATA } from './data';
import { SummaryCards } from './components/SummaryCards/SummaryCards';
import { StatusTabs } from './components/StatusTabs/StatusTabs';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ApplicationsTable } from './components/ApplicationsTable/ApplicationsTable';
import { ApplicationsCardGrid } from './components/ApplicationsCardGrid/ApplicationsCardGrid';
import { AdoptedCarousel } from './components/AdoptedCarousel/AdoptedCarousel';
import { ApplicationDetailsModal } from './components/ApplicationDetailsModal/ApplicationDetailsModal';
import styles from './page.module.css';

export default function AdoptionManagementPage() {
  const [applications, setApplications] = useState<AdoptionApplication[]>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<StatusType>('Pending');
  const [viewMode, setViewMode] = useState<ViewModeType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All species');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplication | null>(null);

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

  const updateStatus = (id: string, newStatus: StatusType) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
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
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>Adoption Management</h1>
          <p className={styles.pageDescription}>
            Review applications, track interviews, and orchestrate animal placements.
          </p>
        </div>

        <AdoptedCarousel animals={latestAdopted} />
      </header>

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

        {viewMode === 'table' ? (
          <ApplicationsTable
            applications={filteredApplications}
            onUpdateStatus={updateStatus}
            onViewDetails={setSelectedApplication}
          />
        ) : (
          <ApplicationsCardGrid
            applications={filteredApplications}
            onUpdateStatus={updateStatus}
            onViewDetails={setSelectedApplication}
          />
        )}
      </div>

      <ApplicationDetailsModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
}