import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Building2 } from "lucide-react";
import styles from "./CommunityReports.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";
import { reportsByMonth, reportsByStatus, reportsByCategory, activeBarangays } from "../../data/mockData";

export function CommunityReports() {
  return (
    <section>
      <SectionHeading title="Community Reports" subtitle="Volume, resolution status, and most active barangays" />
      <div className={styles.grid2}>
        <ChartCard title="Reports by Month">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={reportsByMonth} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="reports" name="Reports" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reports by Status">
          <DonutChart data={reportsByStatus} />
        </ChartCard>

        <ChartCard title="Reports by Category">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={reportsByCategory} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11.5, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Reports" fill="var(--chart-3)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Active Barangays" subtitle="By report volume and resolution rate">
          <div className={styles.barangayList}>
            {activeBarangays.map((b) => (
              <div key={b.name}>
                <div className={styles.barangayRow}>
                  <span className={styles.barangayName}>
                    <Building2 size={13} color="var(--muted-foreground)" /> {b.name}
                  </span>
                  <span className={styles.barangayStats}>{b.reports} reports · {b.resolved}% resolved</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${b.resolved}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

