"use client";

import React from "react";
import { Search } from "lucide-react";
import styles from "./FilterBar.module.css";
import ShadcnSelect from '@/components/ui/shadcn-select';
import type { SelectOption } from "@/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  categoryOptions: SelectOption[];
  difficultyOptions: SelectOption[];
  statusOptions: SelectOption[];
}

export default function FilterBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedStatus,
  onStatusChange,
  categoryOptions,
  difficultyOptions,
  statusOptions,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search module title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInputShadcn}
        />
      </div>
      <div className={styles.filterGroup}>
        <ShadcnSelect
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder="All Categories"
          showLeftIcon
        />
        <ShadcnSelect
          value={selectedDifficulty}
          onChange={onDifficultyChange}
          options={difficultyOptions}
          placeholder="All Difficulties"
        />
        <ShadcnSelect
          value={selectedStatus}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>
    </div>
  );
}

