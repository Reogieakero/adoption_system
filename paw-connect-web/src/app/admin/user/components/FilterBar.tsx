import React from "react";
import SearchBar from '@/components/ui/search-bar';
import styles from "./FilterBar.module.css";
import ShadcnSelect from '@/components/ui/shadcn-select';
import type { RoleFilterValue, StatusFilterValue } from "../types";

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilterValue;
  onRoleFilterChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: string) => void;
}

const ROLE_OPTIONS = [
  { label: "All Roles", value: "All" },
  { label: "Resident", value: "resident" },
  { label: "Admin", value: "admin" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "active" },
  { label: "Pending Verification", value: "pending_verification" },
  { label: "Suspended", value: "suspended" },
];

export default function FilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by Name or Email..."
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.selectComponentContainer}>
          <ShadcnSelect
            value={roleFilter}
            onChange={onRoleFilterChange}
            placeholder="All Roles"
            options={ROLE_OPTIONS}
          />
        </div>

        <ShadcnSelect
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="All Statuses"
          options={STATUS_OPTIONS}
        />
      </div>
    </div>
  );
}

