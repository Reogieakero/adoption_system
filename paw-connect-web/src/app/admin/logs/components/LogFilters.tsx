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

interface LogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (value: string) => void;
}

export default function LogFilters({
  search, onSearchChange, moduleFilter, onModuleFilterChange
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
      </div>
    </div>
  );
}
