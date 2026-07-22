import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./CommunityReports.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";

interface CommunityReportsProps {
  byMonth: { month: string; reports: number }[];
  byStatus: { name: string; value: number }[];
  reportsByCategory: { name: string; value: number }[];
  activeBarangays: { name: string; value: number }[];
}

export function CommunityReports({ byMonth, byStatus, reportsByCategory, activeBarangays }: CommunityReportsProps) {
  return (
    <section>
      <SectionHeading title="Community Reports" subtitle="Volume, resolution status, and most active barangays" />
      <div className={styles.grid2}>
        <ChartCard title="Reports by Month">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={byMonth} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="reports" name="Reports" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reports by Status">
          <DonutChart data={byStatus} />
        </ChartCard>

        <ChartCard title="Reports by Category">
          {reportsByCategory.length > 0 ? (
            <DonutChart data={reportsByCategory} height={190} />
          ) : (
            <div className={styles.emptyChart}>Category breakdown coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Most Active Barangays" subtitle="By report volume and resolution rate">
          {activeBarangays.length > 0 ? (
            <div className={styles.barangayList}>
              {activeBarangays.map((b) => (
                <div key={b.name} className={styles.barangayRow}>
                  <span className={styles.barangayName}>{b.name}</span>
                  <span className={styles.barangayCount}>{b.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyChart}>Barangay data coming soon</div>
          )}
        </ChartCard>
      </div>
    </section>
  );
}
