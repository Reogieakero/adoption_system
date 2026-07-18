"use client";

import React from "react";
import SearchBar from '@/components/ui/search-bar';
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

const moduleOptions = [
  { label: "All Modules", value: "All" },
  { label: "Animal", value: "Animal" },
  { label: "Adoption", value: "Adoption" },
  { label: "Rescue", value: "Rescue" },
  { label: "Reports", value: "Reports" },
  { label: "E-Learning", value: "E-Learning" },
  { label: "User", value: "User" },
  { label: "Settings", value: "Settings" },
  { label: "Authentication", value: "Authentication" }
];

const statusOptions = [
  { label: "All Statuses", value: "All" },
  { label: "Success", value: "Success" },
  { label: "Failed", value: "Failed" }
];

interface LogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function LogFilters({
  search, onSearchChange, moduleFilter, onModuleFilterChange, statusFilter, onStatusFilterChange
}: LogFiltersProps) {
  return (
    <div className={styles.tableToolbar}>
      <div className={styles.toolbarSearch}>
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by User, Activity, or Log ID..."
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.selectComponentContainer}>
          <ShadcnSelect
            value={moduleFilter}
            onChange={onModuleFilterChange}
            placeholder="All Modules"
            options={moduleOptions}
          />
        </div>

        <ShadcnSelect
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="All Statuses"
          options={statusOptions}
        />
      </div>
    </div>
  );
}
