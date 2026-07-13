import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
import { rescueByMonth, rescueStatus, rescueResponseTrend, rescueCategories } from "../../data/mockData";

export function RescueAnalytics() {
  return (
    <section>
      <SectionHeading title="Rescue Analytics" subtitle="Case volume, status, and response performance" />
      <div className={styles.grid3}>
        <ChartCard title="Rescue Cases by Month" span={2}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={rescueByMonth} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="rescueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cases" name="Cases" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rescueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rescue Success Rate">
          <div style={{ display: "grid", placeItems: "center", height: 230 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[{ value: 91.6 }, { value: 8.4 }]}
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
            <div style={{ marginTop: -128, fontSize: 26, fontWeight: 700 }}>91.6%</div>
            <div style={{ marginTop: 62, fontSize: 12, color: "var(--muted-foreground)" }}>Cases resolved successfully</div>
          </div>
        </ChartCard>

        <ChartCard title="Rescue Status Distribution">
          <DonutChart data={rescueStatus} height={180} />
        </ChartCard>

        <ChartCard title="Rescue Response Time" subtitle="Average minutes to arrival">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rescueResponseTrend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="minutes" name="Minutes" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rescue Categories" subtitle="Stray, injured & abandoned">
          <DonutChart data={rescueCategories} height={220} />
        </ChartCard>
      </div>
    </section>
  );
}
