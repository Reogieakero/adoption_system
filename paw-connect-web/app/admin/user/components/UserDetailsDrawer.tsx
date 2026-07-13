import React from "react";
import { X, Info, SlidersHorizontal } from "lucide-react";
import styles from "./UserDetailsDrawer.module.css";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import type { UserEntry } from "../types";

export interface UserDetailsDrawerProps {
  user: UserEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsDrawer({ user, isOpen, onClose }: UserDetailsDrawerProps) {
  return (
    <>
      <div
        className={`${styles.sheetOverlay} ${isOpen ? styles.sheetOverlayOpen : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.sheetContent} ${isOpen ? styles.sheetContentOpen : ""}`}>
        {user && (
          <div className={styles.drawerInner}>
            <div className={styles.drawerHeader}>
              <div>
                <h2>User Inspection Profile</h2>
                <p>System structural account activity trace metrics</p>
              </div>
              <button type="button" onClick={onClose} className={styles.drawerCloseBtn}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Profile Card Header Block */}
              <div className={styles.drawerAvatarProfileBlock}>
                <div className={styles.drawerAvatarHuge}>{user.initials}</div>
                <div className={styles.drawerIdentityTextGroup}>
                  <h3>{user.name}</h3>
                  <RoleBadge role={user.role} className={styles.fitContent} />
                </div>
              </div>

              <div className={styles.separator} />

              {/* Personal Information Module */}
              <div className={styles.drawerSectionTitleFlex}>
                <Info size={13} color="#64748b" />
                <span>Personal Information</span>
              </div>

              <div className={styles.metaDataGridStack}>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Email Address</span>
                  <span className={styles.metaItemValueValue}>{user.email}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Contact Number</span>
                  <span className={styles.metaItemValueValue}>{user.phone}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Residential Address</span>
                  <span className={styles.metaItemValueValue}>{user.address}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Account Status Integrity</span>
                  <StatusBadge status={user.status} className={styles.fitContent} />
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>System Onboarding Date</span>
                  <span className={styles.metaItemValueValue}>{user.dateRegistered}</span>
                </div>
              </div>

              <div className={styles.separator} />

              {/* Account Activity Module */}
              <div className={styles.drawerSectionTitleFlex}>
                <SlidersHorizontal size={13} color="#64748b" />
                <span>Account Activity Metrics</span>
              </div>

              <div className={styles.metricsBoxRowGrid}>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Adoption Apps</span>
                  <span className={styles.metricCellNumber}>{user.adoptionApps}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Rescue Ops</span>
                  <span className={styles.metricCellNumber}>{user.rescueReports}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Animals Posted</span>
                  <span className={styles.metricCellNumber}>{user.animalsPosted}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Modules Passed</span>
                  <span className={styles.metricCellNumber}>{user.completedModules}</span>
                </div>
              </div>

              <div className={styles.metaDataGridStack} style={{ marginTop: "1rem" }}>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Last Access Timestamp</span>
                  <span className={styles.metaItemValueValue}>{user.lastLogin}</span>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={onClose}
                className={styles.btnSecondary}
                style={{ width: "100%" }}
              >
                Close Profile Inspection Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
