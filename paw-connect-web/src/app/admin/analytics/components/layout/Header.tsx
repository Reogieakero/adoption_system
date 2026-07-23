import React, { useState } from "react";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import styles from "./Header.module.css";
import { Select } from "../ui/Select";
import { IconButton } from "../ui/IconButton";
import PdfReport from "../PdfReport";
import type { AnalyticsOverview } from "@/services/analytics.api";
import { activeBarangays } from "@/lib/analytics-sample-data";

export function Header({ data, onRefresh, refreshing }: { data: AnalyticsOverview | null; onRefresh: () => void; refreshing: boolean }) {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [species, setSpecies] = useState("All Species");
  const [barangay, setBarangay] = useState("All Barangays");

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>Analytics</h1>
        </div>
        <div className={styles.actions}>
          <Select label="Date Range" icon={Calendar} value={dateRange} onChange={setDateRange} options={["Today", "Last 7 days", "Last 30 days", "Last 90 days", "This Year", "Custom Range"]} />
          <Select label="Species" value={species} onChange={setSpecies} options={["All Species", "Dogs", "Cats", "Others"]} />
          <Select label="Barangay" icon={MapPin} value={barangay} onChange={setBarangay} options={activeBarangays.map((b) => b.name).concat(["All Barangays"])} searchable />
          <PdfReport data={data} />
        </div>
      </div>
    </div>
  );
}
