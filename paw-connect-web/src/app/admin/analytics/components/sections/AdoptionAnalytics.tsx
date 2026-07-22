import React, { useMemo } from "react";
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

interface AdoptionAnalyticsProps {
  trend: { month: string; adoptions: number; applications: number }[];
  status: { name: string; value: number }[];
  topBreeds: { name: string; value: number }[];
  dogVsCatAdoptions: { month: string; species: string; count: number }[];
}

export function AdoptionAnalytics({ trend, status, topBreeds, dogVsCatAdoptions }: AdoptionAnalyticsProps) {
  const dogVsCatChart = useMemo(() => {
    const map: Record<string, { month: string; dogs: number; cats: number }> = {};
    dogVsCatAdoptions.forEach((d) => {
      if (!map[d.month]) map[d.month] = { month: d.month, dogs: 0, cats: 0 };
      if (d.species === 'dog') map[d.month].dogs = d.count;
      else map[d.month].cats = d.count;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [dogVsCatAdoptions]);

  const stackedTrend = useMemo(() => {
    const map: Record<string, { month: string; adoptions: number; applications: number }> = {};
    trend.forEach((d) => { map[d.month] = d; });
    const allMonths = new Set([...trend.map((d) => d.month), ...dogVsCatChart.map((d) => d.month)]);
    return Array.from(allMonths).sort().map((month) => ({
      month,
      adoptions: map[month]?.adoptions ?? 0,
      applications: map[month]?.applications ?? 0,
      dogs: dogVsCatChart.find((d) => d.month === month)?.dogs ?? 0,
      cats: dogVsCatChart.find((d) => d.month === month)?.cats ?? 0,
    }));
  }, [trend, dogVsCatChart]);

  return (
    <section>
      <SectionHeading title="Adoption Analytics" subtitle="Trends across applications, approvals, and top breeds" />
      <div className={styles.grid2}>
        <ChartCard title="Monthly Adoption Trend" subtitle="Adoptions over time">
          {stackedTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stackedTrend} margin={{ left: -20, right: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="adoptions" name="Adoptions" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="applications" name="Applications" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 3" dot={false} activeDot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Adoption trend data coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Adoption Status Distribution" subtitle="Current pipeline breakdown">
          <DonutChart data={status} />
        </ChartCard>

        <ChartCard title="Dog vs Cat Adoptions" subtitle="Monthly comparison">
          {dogVsCatChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dogVsCatChart} margin={{ left: -20, right: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="dogs" name="Dogs" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cats" name="Cats" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Dog vs Cat data coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Most Adopted Breeds" subtitle="Top breeds by adoption count">
          {topBreeds.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topBreeds} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11.5, fill: "var(--text-primary)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" name="Adoptions" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Breed data coming soon</div>
          )}
        </ChartCard>
      </div>
    </section>
  );
}
