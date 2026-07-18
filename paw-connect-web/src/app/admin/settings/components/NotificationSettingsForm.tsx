"use client";

import React from "react";
import { Bell } from "lucide-react";
import styles from "../page.module.css";

interface NotificationSettingsFormProps {
  notifyAdoption: boolean;
  setNotifyAdoption: (v: boolean) => void;
  notifyRescue: boolean;
  setNotifyRescue: (v: boolean) => void;
  notifyCommunity: boolean;
  setNotifyCommunity: (v: boolean) => void;
  notifyHealth: boolean;
  setNotifyHealth: (v: boolean) => void;
  notifyEmail: boolean;
  setNotifyEmail: (v: boolean) => void;
}

export default function NotificationSettingsForm({
  notifyAdoption, setNotifyAdoption, notifyRescue, setNotifyRescue, notifyCommunity, setNotifyCommunity, notifyHealth, setNotifyHealth, notifyEmail, setNotifyEmail
}: NotificationSettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Bell size={18} color="var(--text-secondary)" />
          <h2>Notification Settings</h2>
        </div>
        <p>Toggle dispatching hooks for webhooks and automated messaging grids.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Adoption Notifications</span>
            <span className={styles.switchSubtitle}>Trigger instantaneous signals when application status logs update.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={notifyAdoption} onChange={(e) => setNotifyAdoption(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Rescue Notifications</span>
            <span className={styles.switchSubtitle}>Dispatch dispatch signals to active teams on inbound cases.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={notifyRescue} onChange={(e) => setNotifyRescue(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Community Report Notifications</span>
            <span className={styles.switchSubtitle}>Flag down review protocols when citizen incident reports surface.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={notifyCommunity} onChange={(e) => setNotifyCommunity(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Health Monitoring Alerts</span>
            <span className={styles.switchSubtitle}>System telemetry indicators for medical schedule violations.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={notifyHealth} onChange={(e) => setNotifyHealth(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Email Notifications</span>
            <span className={styles.switchSubtitle}>Route system updates directly to linked administrative mail servers.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}
