import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import styles from "./FilterBar.module.css";
import ShadcnSelect from "./ShadcnSelect";
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
  { label: "Citizen", value: "Citizen" },
  { label: "Adopter", value: "Adopter" },
  { label: "Rescuer", value: "Rescuer" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Suspended", value: "Suspended" },
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
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
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
