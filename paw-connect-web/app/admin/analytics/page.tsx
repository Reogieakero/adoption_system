"use client";

import React, { useState } from "react";
import styles from "./styles/theme.module.css";
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
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <div className={styles.root}>
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

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
        <SummaryGrid />
        <AdoptionAnalytics />
        <RescueAnalytics />
        <CommunityReports />
        <GeographicAnalytics />
        <AnimalPopulation />
        <HealthAnalytics />
        <PerformanceMetrics />
        <RecentAnalyticsTable />
      </main>
    </div>
  );
}
