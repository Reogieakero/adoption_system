"use client";

import React from "react";
import { Map } from "lucide-react";
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

interface MapSettingsFormProps {
  mapLocation: string;
  setMapLocation: (v: string) => void;
  mapZoom: string;
  setMapZoom: (v: string) => void;
  enableHeatmap: boolean;
  setEnableHeatmap: (v: boolean) => void;
}

export default function MapSettingsForm({
  mapLocation, setMapLocation, mapZoom, setMapZoom, enableHeatmap, setEnableHeatmap
}: MapSettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Map size={18} color="var(--text-secondary)" />
          <h2>Map Settings</h2>
        </div>
        <p>Configure mapping matrices for active geo-tracking panels.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Default Map Location</label>
            <input type="text" value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className={styles.formInputShadcn} />
          </div>
          <div className={styles.formGroup}>
            <label>Default Map Zoom Level</label>
            <ShadcnSelect
              value={mapZoom}
              onChange={setMapZoom}
              placeholder="Zoom Level"
              options={[
                { label: "Street Level (18)", value: "18" },
                { label: "City Wide (12)", value: "12" },
                { label: "Regional (8)", value: "8" },
                { label: "Continental (4)", value: "4" }
              ]}
            />
          </div>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Heatmap</span>
            <span className={styles.switchSubtitle}>Visualize heavy-density vectors of incident calls across clusters.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={enableHeatmap} onChange={(e) => setEnableHeatmap(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}
