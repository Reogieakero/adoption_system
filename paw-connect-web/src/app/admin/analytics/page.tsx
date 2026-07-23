"use client";

import React from "react";
import styles from "./page.module.css";
import { useAnalytics } from "@/hooks/admin/use-analytics";
import { Header } from "./components/layout/Header";
import { SummaryGrid } from "./components/sections/SummaryGrid";
import { AdoptionAnalytics } from "./components/sections/AdoptionAnalytics";
import { RescueAnalytics } from "./components/sections/RescueAnalytics";
import { CommunityReports } from "./components/sections/CommunityReports";
import { GeographicAnalytics } from "./components/sections/GeographicAnalytics";
import { AnimalPopulation } from "./components/sections/AnimalPopulation";
import { HealthAnalytics } from "./components/sections/HealthAnalytics";
import { PerformanceMetrics } from "./components/sections/PerformanceMetrics";
import { RecentAnalyticsTable } from "./components/sections/RecentAnalyticsTable";

export default function AnalyticsDashboardPage() {
  const { data, isLoading, error, refetch } = useAnalytics();

  return (
    <div className={styles.root}>
      <Header data={data ?? null} onRefresh={refetch} refreshing={isLoading} />

      <main
        className={styles.fadeIn}
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {error && (
          <div className={styles.errorBanner}>
            {error}
            <button className={styles.retryBtn} onClick={refetch}>Retry</button>
          </div>
        )}

        {isLoading && !data ? (
          <div className={styles.loadingState}>Loading analytics…</div>
        ) : (
          <>
            <SummaryGrid cards={data?.summaryCards ?? []} />
            <AdoptionAnalytics
              trend={data?.adoptionTrend ?? []}
              status={data?.adoptionStatus ?? []}
              topBreeds={data?.topBreeds ?? []}
              dogVsCatAdoptions={data?.dogVsCatAdoptions ?? []}
            />
            <RescueAnalytics
              byMonth={data?.rescueByMonth ?? []}
              status={data?.rescueStatus ?? []}
              successRate={data?.rescueSuccessRate ?? 0}
              avgResponseMinutes={data?.avgResponseMinutes ?? 0}
              rescueCategories={data?.rescueCategories ?? []}
            />
            <CommunityReports
              byMonth={data?.reportsByMonth ?? []}
              byStatus={data?.reportsByStatus ?? []}
              reportsByCategory={data?.reportsByCategory ?? []}
              activeBarangays={data?.activeBarangays ?? []}
            />
            <GeographicAnalytics />
            <AnimalPopulation
              dogsVsCats={data?.dogsVsCats ?? []}
              breedDistribution={data?.breedDistribution ?? []}
              sexDistribution={data?.sexDistribution ?? []}
              petStatusDistribution={data?.petStatusDistribution ?? []}
              ageDistribution={data?.ageDistribution ?? []}
              shelterCapacity={data?.shelterCapacity ?? []}
            />
            <HealthAnalytics
              healthStatus={data?.healthStatus ?? []}
              vaccinationCoverage={data?.vaccinationCoverage ?? 0}
            />
            <PerformanceMetrics metrics={data?.performanceMetrics ?? []} />
            <RecentAnalyticsTable rows={data?.recentAnalytics ?? []} />
          </>
        )}
      </main>
    </div>
  );
}
