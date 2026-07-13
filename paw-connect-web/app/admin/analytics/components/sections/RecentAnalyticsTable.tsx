import React from "react";
import { RotateCcw, Printer, ArrowUpRight, ArrowDownRight } from "lucide-react";
import styles from "./RecentAnalyticsTable.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";
import { recentAnalytics } from "../../data/mockData";

export function RecentAnalyticsTable() {
  return (
    <section>
      <SectionHeading
        title="Recent Analytics"
        subtitle="Period-over-period comparison across key metrics"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className={styles.btnSecondary}>
              <RotateCcw size={14} /> Reset Filters
            </button>
            <button className={styles.btnSecondary}>
              <Printer size={14} /> Print Report
            </button>
          </div>
        }
      />
      <Card style={{ padding: 0 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current Value</th>
              <th>Previous Value</th>
              <th>% Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalytics.map((r) => (
              <tr key={r.metric}>
                <td style={{ fontWeight: 500 }}>{r.metric}</td>
                <td>{r.current}</td>
                <td style={{ color: "var(--muted-foreground)" }}>{r.previous}</td>
                <td>
                  <ChangeBadge change={r.change} />
                </td>
                <td>
                  {r.trend === "up" ? (
                    <span className={styles.badgeSuccess}>
                      <ArrowUpRight size={11} /> Improving
                    </span>
                  ) : (
                    <span className={styles.badgeDanger}>
                      <ArrowDownRight size={11} /> Declining
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Showing 6 of 6 metrics</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button className={styles.btnGhost} style={{ height: 30, padding: "0 10px" }}>Previous</button>
            <button className={styles.btnSecondary} style={{ height: 30, padding: "0 10px" }}>1</button>
            <button className={styles.btnGhost} style={{ height: 30, padding: "0 10px" }}>Next</button>
          </div>
        </div>
      </Card>
    </section>
  );
}
