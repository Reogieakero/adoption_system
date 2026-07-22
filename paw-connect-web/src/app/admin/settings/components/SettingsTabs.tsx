"use client";

import React from "react";
import Button from '@/components/ui/button';
import styles from "../page.module.css";

type SettingsTab = "general" | "notifications" | "maps" | "elearning" | "system" | "security";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { key: SettingsTab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "notifications", label: "Notifications" },
  { key: "maps", label: "Map Specs" },
  { key: "elearning", label: "E-Learning" },
  { key: "system", label: "System Config" },
  { key: "security", label: "Security" },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className={styles.tabsListShadcn}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant="admin-ghost"
          active={activeTab === tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
