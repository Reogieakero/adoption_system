import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./AdoptionAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";
import { adoptionTrend, adoptionStatus, dogVsCat, topBreeds } from "../../data/mockData";

export function AdoptionAnalytics() {
  return (
    <section>
      <SectionHeading title="Adoption Analytics" subtitle="Trends across applications, approvals, and top breeds" />
      <div className={styles.grid2}>
        <ChartCard title="Monthly Adoption Trend" subtitle="Adoptions vs. applications received">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adoptionTrend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="adoptions" name="Adoptions" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="applications" name="Applications" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Adoption Status Distribution" subtitle="Current pipeline breakdown">
          <DonutChart data={adoptionStatus} />
        </ChartCard>

        <ChartCard title="Dog vs Cat Adoptions" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dogVsCat} margin={{ left: -20, right: 8 }} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Dogs" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Cats" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Adopted Breeds" subtitle="Top 6 breeds by adoption count">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topBreeds} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11.5, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Adoptions" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

