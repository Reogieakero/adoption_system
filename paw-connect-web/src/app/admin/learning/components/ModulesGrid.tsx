"use client";

import React from "react";
import styles from "./ModulesGrid.module.css";
import ModuleCard from "./ModuleCard";
import type { LearningModule } from "@/types";

interface ModulesGridProps {
  modules: LearningModule[];
  activeDropdownId: string | null;
  onToggleDropdown: (id: string) => void;
  onEdit: (module: LearningModule) => void;
  onDuplicate: (id: string) => void;
  onToggleStatus: (module: LearningModule) => void;
  onDelete: (id: string) => void;
}

export default function ModulesGrid({
  modules,
  activeDropdownId,
  onToggleDropdown,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: ModulesGridProps) {
  return (
    <div className={styles.modulesGrid}>
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isDropdownOpen={activeDropdownId === module.id}
          onToggleDropdown={onToggleDropdown}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

