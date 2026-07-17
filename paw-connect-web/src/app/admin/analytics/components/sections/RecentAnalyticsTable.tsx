import React from "react";
import { RotateCcw, Printer, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Button from "@/components/ui/button";
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
            {recentAnalytics.map((r) => (
              <tr key={r.metric}>
                <td className={styles.metricName}>{r.metric}</td>
                <td>{r.current}</td>
                <td className={styles.prevValue}>{r.previous}</td>
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
        <div className={styles.tableFooter}>
          <span className={styles.paginationInfo}>Showing 6 of 6 metrics</span>
          <div className={styles.paginationButtons}>
            <Button variant="admin-secondary" className={styles.paginationBtn}>Previous</Button>
            <Button variant="admin-primary" className={styles.paginationBtn}>1</Button>
            <Button variant="admin-secondary" className={styles.paginationBtn}>Next</Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

