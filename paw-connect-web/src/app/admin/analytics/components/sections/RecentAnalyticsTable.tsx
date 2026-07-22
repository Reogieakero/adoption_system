import React from "react";
import { RotateCcw, Printer, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Button from "@/components/ui/button";
import styles from "./RecentAnalyticsTable.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";

interface RecentAnalyticsTableProps {
  rows: { metric: string; current: string; previous: string; change: number | null; trend: string }[];
}

export function RecentAnalyticsTable({ rows }: RecentAnalyticsTableProps) {
  return (
    <section>
      <SectionHeading
        title="Recent Analytics"
        subtitle="Period-over-period comparison across key metrics"
        action={
          <div className={styles.actionButtons}>
            <Button variant="admin-secondary"><RotateCcw size={14} /> Reset Filters</Button>
            <Button variant="admin-secondary"><Printer size={14} /> Print Report</Button>
          </div>
        }
      />
      <Card className={styles.tableCard}>
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
            {rows.map((r) => (
              <tr key={r.metric}>
                <td className={styles.metricName}>{r.metric}</td>
                <td>{r.current}</td>
                <td className={styles.prevValue}>{r.previous}</td>
                <td>
                  {r.change != null ? <ChangeBadge change={r.change} /> : '—'}
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
        <div className={styles.tableFooter}>
          <span className={styles.paginationInfo}>Showing {rows.length} of {rows.length} metrics</span>
        </div>
      </Card>
    </section>
  );
}
