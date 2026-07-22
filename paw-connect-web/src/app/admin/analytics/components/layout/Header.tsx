import React, { useState } from "react";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import styles from "./Header.module.css";
import { Select } from "../ui/Select";
import { ExportMenu } from "../ui/ExportMenu";
import { IconButton } from "../ui/IconButton";
import { activeBarangays } from "@/lib/analytics-sample-data";

export function Header({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
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
          <ExportMenu />
          <IconButton icon={RefreshCw} label="Refresh analytics" onClick={onRefresh} spinning={refreshing} />
        </div>
      </div>
    </div>
  );
}
