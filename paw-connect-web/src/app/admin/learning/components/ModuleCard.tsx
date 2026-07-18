"use client";

import React from "react";
import {
  MoreVertical,
  Eye,
  FileEdit,
  Copy,
  Globe,
  Trash2,
  Clock,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/ui/button";
import styles from "./ModuleCard.module.css";
import type { LearningModule } from "@/types";

interface ModuleCardProps {
  module: LearningModule;
  isDropdownOpen: boolean;
  onToggleDropdown: (id: string) => void;
  onEdit: (module: LearningModule) => void;
  onDuplicate: (id: string) => void;
  onToggleStatus: (module: LearningModule) => void;
  onDelete: (id: string) => void;
}

export default function ModuleCard({
  module,
  isDropdownOpen,
  onToggleDropdown,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: ModuleCardProps) {
  return (
    <div className={styles.moduleCard}>
      <div className={styles.imageContainer}>
        {module.image ? (
          <img src={module.image} alt={module.title} className={styles.cardImage} />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <ImageIcon size={28} className={styles.placeholderIcon} />
          </div>
        )}
        <div className={styles.badgeContainer}>
          <span className={styles.badge}>{module.difficulty}</span>
          <span className={`${styles.badge} ${module.status === "Published" ? styles.badgePublished : styles.badgeDraft}`}>
            {module.status}
          </span>
        </div>

        <div className={styles.actionsTrigger}>
          <button onClick={() => onToggleDropdown(module.id)} className={styles.dropdownTriggerBtn}>
            <MoreVertical size={16} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => onToggleDropdown(module.id)} className={styles.dropdownItem}>
                <Eye size={14} /> View Module
              </button>
              <button onClick={() => onEdit(module)} className={styles.dropdownItem}>
                <FileEdit size={14} /> Edit Module
              </button>
              <button onClick={() => onDuplicate(module.id)} className={styles.dropdownItem}>
                <Copy size={14} /> Duplicate Module
              </button>
              <button onClick={() => onToggleStatus(module)} className={`${styles.dropdownItem} ${styles.dropdownPublish}`}>
                <Globe size={14} /> {module.status === "Published" ? "Unpublish" : "Publish"}
              </button>
              <div className={styles.dropdownDivider}></div>
              <button onClick={() => onDelete(module.id)} className={`${styles.dropdownItem} ${styles.dropdownDelete}`}>
                <Trash2 size={14} /> Delete Module
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div>
          <div className={styles.categoryLabel}>{module.category}</div>
          <h3 className={styles.cardTitle}>{module.title}</h3>
          <p className={styles.cardDesc}>{module.description}</p>
        </div>

        <div className={styles.cardMetricsRow}>
          <div className={styles.metricItem}>
            <Clock size={14} className={styles.metricIconMuted} />
            <span>{module.duration}</span>
          </div>
          <div className={`${styles.metricItem} ${styles.metricCenter}`}>
            <Eye size={14} className={styles.metricIconMuted} />
            <span>{module.views} views</span>
          </div>
          <div className={`${styles.metricItem} ${styles.metricEnd}`}>
            <TrendingUp size={14} className={styles.metricIconSuccess} />
            <span>{module.completionRate} CR</span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.footerLink}>Details</span>
        <div className={styles.cardFooterActions}>
          <span className={styles.footerLink} onClick={() => onEdit(module)}>Edit</span>
          <Button variant="admin-danger" onClick={() => onDelete(module.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}