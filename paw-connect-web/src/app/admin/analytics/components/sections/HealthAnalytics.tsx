import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Syringe, Activity, HeartPulse } from "lucide-react";
import styles from "./HealthAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";
import { healthStatus, vaccinationCoverage, heartRateSummary, commonConditions, vetVisitsPerMonth } from "@/lib/mock-data/analytics";

export function HealthAnalytics() {
  return (
    <section>
      <SectionHeading title="Health Analytics" subtitle="Medical status, vaccination coverage, and clinical trends" />
      <div className={styles.grid3}>
        <ChartCard title="Healthy vs Sick Animals">
          <DonutChart data={healthStatus} height={190} />
        </ChartCard>

        <ChartCard title="Vaccination Coverage">
          <div className={styles.vaccinationContainer}>
            <div className={styles.vaccinationHeader}>
              <Syringe size={18} color="var(--primary)" />
              <span className={styles.vaccinationPercent}>{vaccinationCoverage}%</span>
            </div>
            <div className={`${styles.progressTrack} ${styles.progressTrackTall}`}>
              <div className={styles.progressFill} style={{ width: `${vaccinationCoverage}%` }} />
            </div>
            <p className={styles.vaccinationDesc}>
              818 of 1,050 animals fully vaccinated this period
            </p>
          </div>
        </ChartCard>

        <ChartCard title="Animals Under Treatment">
          <div className={styles.treatmentContainer}>
            <div className={styles.treatmentHeader}>
              <div className={styles.treatmentIcon}>
                <Activity size={18} color="var(--warning)" />
              </div>
              <div>
                <div className={styles.treatmentCount}>76</div>
                <div className={styles.treatmentLabel}>currently under active care</div>
              </div>
            </div>
            <span className={styles.badgeWarning}>
              12 critical · 64 stable
            </span>
          </div>
        </ChartCard>

        <ChartCard title="Heart Rate Monitoring Summary" subtitle="Average BPM, monitored animals" span={2}>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={heartRateSummary} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis domain={[70, 120]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgBpm" name="Avg BPM" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.heartRateFooter}>
            <HeartPulse size={13} color="var(--chart-4)" /> Normal range 70–120 bpm across monitored patients
          </div>
        </ChartCard>

        <ChartCard title="Common Medical Conditions">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={commonConditions} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Cases" fill="var(--chart-3)" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Veterinary Visits per Month" span={3}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vetVisitsPerMonth} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="visits" name="Vet Visits" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

