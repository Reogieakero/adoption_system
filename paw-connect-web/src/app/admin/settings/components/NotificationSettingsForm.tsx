"use client";

import React from "react";
import { Bell } from "lucide-react";
import type { NotificationPreferenceMap } from '@/services/settings.api';
import styles from "../page.module.css";

interface NotificationSettingsFormProps {
  preferences: NotificationPreferenceMap;
  onChange: (p: NotificationPreferenceMap) => void;
}

const LABELS: Record<string, { title: string; subtitle: string }> = {
  adoption_status: {
    title: 'Adoption Status Changes',
    subtitle: 'When an adoption application is approved or rejected.',
  },
  report_status: {
    title: 'Report Status Changes',
    subtitle: 'When a rescue report status is updated.',
  },
  new_message: {
    title: 'New Messages',
    subtitle: 'When a resident sends a new message.',
  },
  new_report: {
    title: 'New Rescue Reports',
    subtitle: 'When a citizen submits a new animal report.',
  },
  new_community_listing: {
    title: 'Community Listings',
    subtitle: 'When a new community pet listing is posted.',
  },
  new_application: {
    title: 'New Applications',
    subtitle: 'When a resident submits an adoption application.',
  },
};

export default function NotificationSettingsForm({ preferences, onChange }: NotificationSettingsFormProps) {
  function toggle(type: string) {
    const current = preferences[type];
    if (!current) return;
    const enabled = !current.in_app;
    onChange({
      ...preferences,
      [type]: { in_app: enabled, email: enabled },
    });
  }

  const entries = Object.entries(LABELS);
  if (entries.length === 0) {
    return (
      <div className={styles.cardShadcn}>
        <div className={styles.cardContentShadcn}>
          <p>No notification preferences available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Bell size={18} color="var(--text-secondary)" />
          <h2>Notification Preferences</h2>
        </div>
        <p>Choose which notifications you receive.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        {entries.map(([type, label], i) => {
          const pref = preferences[type] || { in_app: true, email: true };
          return (
            <React.Fragment key={type}>
              {i > 0 && <div className={styles.separatorShadcn} />}
              <div className={styles.toggleRow}>
                <div className={styles.switchLabelContainer}>
                  <span className={styles.switchTitle}>{label.title}</span>
                  <span className={styles.switchSubtitle}>{label.subtitle}</span>
                </div>
                <label className={styles.switchToggle}>
                  <input
                    type="checkbox"
                    checked={pref.in_app}
                    onChange={() => toggle(type)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
