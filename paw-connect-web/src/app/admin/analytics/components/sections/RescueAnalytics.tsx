import React from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./RescueAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";

interface RescueAnalyticsProps {
  byMonth: { month: string; cases: number }[];
  status: { name: string; value: number }[];
  successRate: number;
  avgResponseMinutes: number;
  rescueCategories: { name: string; value: number }[];
}

export function RescueAnalytics({ byMonth, status, successRate, avgResponseMinutes, rescueCategories }: RescueAnalyticsProps) {

  return (
    <section>
      <SectionHeading title="Rescue Analytics" subtitle="Case volume, status, and response performance" />
      <div className={styles.grid3}>
        <ChartCard title="Rescue Cases by Month" span={2}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={byMonth} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="rescueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cases" name="Cases" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rescueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rescue Success Rate">
          <div className={styles.successRateContainer}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[{ value: successRate }, { value: Math.max(100 - successRate, 0) }]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="95%"
                  stroke="none"
                >
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.successRatePercent}>{successRate}%</div>
            <div className={styles.successRateLabel}>Cases resolved successfully</div>
          </div>
        </ChartCard>

        <ChartCard title="Rescue Status Distribution">
          <DonutChart data={status} height={180} />
        </ChartCard>

        <ChartCard title="Rescue Response Time" subtitle="Average minutes to arrival">
          {avgResponseMinutes > 0 ? (
            <div className={styles.responseTimeContainer}>
              <div className={styles.responseTimeValue}>{avgResponseMinutes}</div>
              <div className={styles.responseTimeUnit}>minutes avg</div>
            </div>
          ) : (
            <div className={styles.emptyChart}>Response time data coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Rescue Categories" subtitle="Stray, injured & abandoned">
          {rescueCategories.length > 0 ? (
            <DonutChart data={rescueCategories} height={190} />
          ) : (
            <div className={styles.emptyChart}>Category breakdown coming soon</div>
          )}
        </ChartCard>
      </div>
    </section>
  );
}
