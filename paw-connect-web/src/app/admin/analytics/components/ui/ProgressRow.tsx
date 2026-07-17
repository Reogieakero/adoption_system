import React from "react";
import styles from "./ProgressRow.module.css";

export function ProgressRow({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{label}</span>
        <span style={{ color: "var(--muted-foreground)" }}>
          {used}/{total} Â· {pct}%
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%`, background: pct > 85 ? "var(--danger)" : "var(--primary)" }} />
      </div>
    </div>
  );
}

