import React from "react";
import styles from "./Tabs.module.css";

interface Tab {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((t) => (
        <button
          key={t.value}
          className={`${styles.tab} ${active === t.value ? styles.tabActive : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
