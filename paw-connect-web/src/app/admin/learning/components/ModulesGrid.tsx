"use client";

import React from "react";
import styles from "./ModulesGrid.module.css";
import ModuleCard from "./ModuleCard";
import type { ElearningModule } from "@/types";

interface ModulesGridProps {
  modules: ElearningModule[];
  activeDropdownId: number | null;
  onToggleDropdown: (id: number) => void;
  onEdit: (module: ElearningModule) => void;
  onView: (module: ElearningModule) => void;
  onToggleStatus: (module: ElearningModule) => void;
  onDelete: (id: number) => void;
}

export default function ModulesGrid({
  modules,
  activeDropdownId,
  onToggleDropdown,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: ModulesGridProps) {
  return (
    <div className={styles.modulesGrid}>
      {modules.map((module) => (
        <ModuleCard
          key={module.module_id}
          module={module}
          isDropdownOpen={activeDropdownId === module.module_id}
          onToggleDropdown={onToggleDropdown}
          onEdit={onEdit}
          onView={onView}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

