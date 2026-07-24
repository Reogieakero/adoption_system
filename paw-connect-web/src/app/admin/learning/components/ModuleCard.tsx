"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Eye,
  FileEdit,
  Globe,
  Trash2,
  Clock,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/ui/button";
import { formatStatus } from "@/lib/format-status";
import styles from "./ModuleCard.module.css";
import type { ElearningModule } from "@/types";

interface ModuleCardProps {
  module: ElearningModule;
  isDropdownOpen: boolean;
  onToggleDropdown: (id: number) => void;
  onEdit: (module: ElearningModule) => void;
  onView: (module: ElearningModule) => void;
  onToggleStatus: (module: ElearningModule) => void;
  onDelete: (id: number) => void;
}

export default function ModuleCard({
  module,
  isDropdownOpen,
  onToggleDropdown,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: ModuleCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={styles.moduleCard}>
        <div className={styles.imageContainer}>
        {module.cover_image_url && !imgError ? (
          <img src={module.cover_image_url} alt={module.title} className={styles.cardImage} onError={() => setImgError(true)} />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <ImageIcon size={28} className={styles.placeholderIcon} />
          </div>
        )}
        <div className={styles.badgeContainer}>
          <span className={styles.badge}>Beginner</span>
          <span className={`${styles.badge} ${module.status === "published" ? styles.badgePublished : styles.badgeDraft}`}>
            {formatStatus(module.status)}
          </span>
        </div>

        <div className={styles.actionsTrigger}>
          <button onClick={() => onToggleDropdown(module.module_id)} className={styles.dropdownTriggerBtn}>
            <MoreVertical size={16} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => { onView(module); onToggleDropdown(module.module_id); }} className={styles.dropdownItem}>
                View Module
              </button>
              <button onClick={() => onEdit(module)} className={styles.dropdownItem}>
                <FileEdit size={14} /> Edit Module
              </button>
              <button onClick={() => onToggleStatus(module)} className={`${styles.dropdownItem} ${styles.dropdownPublish}`}>
                <Globe size={14} /> {module.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <div className={styles.dropdownDivider}></div>
              <button onClick={() => onDelete(module.module_id)} className={`${styles.dropdownItem} ${styles.dropdownDelete}`}>
                <Trash2 size={14} /> Delete Module
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div>
          <div className={styles.categoryLabel}>{module.category_name ?? 'Uncategorized'}</div>
          <h3 className={styles.cardTitle}>{module.title}</h3>
          <p className={styles.cardDesc}>{module.description ?? ''}</p>
        </div>

        <div className={styles.cardMetricsRow}>
          <div className={styles.metricItem}>
            <Clock size={14} className={styles.metricIconMuted} />
            <span>N/A</span>
          </div>
          <div className={`${styles.metricItem} ${styles.metricCenter}`}>
            <Eye size={14} className={styles.metricIconMuted} />
            <span>{module.completed_count ?? 0} completed</span>
          </div>
          <div className={`${styles.metricItem} ${styles.metricEnd}`}>
            <TrendingUp size={14} className={styles.metricIconSuccess} />
            <span>0% CR</span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.footerLink} onClick={() => onView(module)}>Details</span>
        <div className={styles.cardFooterActions}>
          <span className={styles.footerLink} onClick={() => onEdit(module)}>Edit</span>
          <Button variant="admin-danger" onClick={() => onDelete(module.module_id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}