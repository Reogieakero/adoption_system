import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./AnimalPopulation.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";
import { ProgressRow } from "../ui/ProgressRow";
import { dogsVsCats, sexDistribution, availableVsAdopted, breedDistribution, ageDistribution, shelterCapacity } from "../../data/mockData";

export function AnimalPopulation() {
  return (
    <section>
      <SectionHeading title="Animal Population" subtitle="Composition, demographics, and shelter capacity" />
      <div className={styles.grid3}>
        <ChartCard title="Dogs vs Cats">
          <DonutChart data={dogsVsCats} height={190} />
        </ChartCard>
        <ChartCard title="Sex Distribution">
          <DonutChart data={sexDistribution} height={190} />
        </ChartCard>
        <ChartCard title="Available vs Adopted">
          <DonutChart data={availableVsAdopted} height={190} />
        </ChartCard>

        <ChartCard title="Breed Distribution" span={2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breedDistribution} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Animals" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageDistribution} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Animals" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shelter Capacity" span={3}>
          <div className={`${styles.grid3} ${styles.shelterGrid}`}>
            {shelterCapacity.map((s) => (
              <ProgressRow key={s.name} label={s.name} used={s.used} total={s.total} />
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

