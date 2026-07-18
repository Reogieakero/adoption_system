"use client";

import React from "react";
import { Sliders, Calendar, Clock, Globe } from "lucide-react";
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

interface SystemSettingsFormProps {
  dateFormat: string;
  setDateFormat: (v: string) => void;
  timeFormat: string;
  setTimeFormat: (v: string) => void;
  timeZone: string;
  setTimeZone: (v: string) => void;
}

export default function SystemSettingsForm({
  dateFormat, setDateFormat, timeFormat, setTimeFormat, timeZone, setTimeZone
}: SystemSettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Sliders size={18} color="var(--text-secondary)" />
          <h2>System Settings</h2>
        </div>
        <p>Establish structural localization constraints across database layers.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGroup}>
          <label>Date Format</label>
          <div className={styles.selectWithIconContainer}>
            <Calendar size={14} className={styles.selectInnerIcon} />
            <ShadcnSelect
              value={dateFormat}
              onChange={setDateFormat}
              placeholder="Choose Configuration"
              options={[
                { label: "MM/DD/YYYY (Standard ISO)", value: "MM/DD/YYYY" },
                { label: "DD/MM/YYYY (European Format)", value: "DD/MM/YYYY" },
                { label: "YYYY-MM-DD (Universal Ledger)", value: "YYYY-MM-DD" }
              ]}
            />
          </div>
        </div>

        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Time Format</label>
            <div className={styles.selectWithIconContainer}>
              <Clock size={14} className={styles.selectInnerIcon} />
              <ShadcnSelect
                value={timeFormat}
                onChange={setTimeFormat}
                placeholder="Select Clock Grid"
                options={[
                  { label: "12-Hour (AM/PM)", value: "12h" },
                  { label: "24-Hour (Military Standard)", value: "24h" }
                ]}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Time Zone</label>
            <div className={styles.selectWithIconContainer}>
              <Globe size={14} className={styles.selectInnerIcon} />
              <ShadcnSelect
                value={timeZone}
                onChange={setTimeZone}
                placeholder="Select Base Zone"
                options={[
                  { label: "GMT -5 (Eastern Standard Time)", value: "EST" },
                  { label: "GMT -8 (Pacific Standard Time)", value: "PST" },
                  { label: "GMT +0 (Universal Coordinates)", value: "UTC" },
                  { label: "GMT +8 (Philippine Standard Time)", value: "PHT" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
