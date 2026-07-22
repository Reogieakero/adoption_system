import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./AnimalPopulation.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";
import { CustomTooltip } from "../ui/CustomTooltip";

interface AnimalPopulationProps {
  dogsVsCats: { name: string; value: number }[];
  breedDistribution: { name: string; value: number }[];
  sexDistribution: { name: string; value: number }[];
  petStatusDistribution: { name: string; value: number }[];
  ageDistribution: { name: string; value: number }[];
  shelterCapacity: { name: string; value: number }[];
}

export function AnimalPopulation({ dogsVsCats, breedDistribution, sexDistribution, petStatusDistribution, ageDistribution, shelterCapacity }: AnimalPopulationProps) {
  return (
    <section>
      <SectionHeading title="Animal Population" subtitle="Composition, demographics, and shelter capacity" />
      <div className={styles.grid3}>
        <ChartCard title="Dogs vs Cats">
          <DonutChart data={dogsVsCats} height={190} />
        </ChartCard>
        <ChartCard title="Sex Distribution">
          {sexDistribution.length > 0 ? (
            <DonutChart data={sexDistribution} height={190} />
          ) : (
            <div className={styles.emptyChart}>Sex data coming soon</div>
          )}
        </ChartCard>
        <ChartCard title="Available vs Adopted">
          {petStatusDistribution.length > 0 ? (
            <DonutChart data={petStatusDistribution} height={190} />
          ) : (
            <div className={styles.emptyChart}>Status breakdown coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Breed Distribution" span={2}>
          {breedDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breedDistribution} margin={{ left: -20, right: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" name="Animals" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Breed data coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Age Distribution">
          {ageDistribution.length > 0 ? (
            <div className={styles.ageScroll}>
              <div className={styles.ageList}>
                {ageDistribution.map((a) => (
                  <div key={a.name} className={styles.ageRow}>
                    <span className={styles.ageName}>{a.name}</span>
                    <span className={styles.ageCount}>{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.emptyChart}>Age data coming soon</div>
          )}
        </ChartCard>

        <ChartCard title="Shelter Capacity" span={3}>
          {shelterCapacity.length > 0 ? (
            <div className={styles.capacityContainer}>
              {shelterCapacity.map((s) => (
                <div key={s.name} className={styles.capacityCard}>
                  <div className={styles.capacityValue}>{s.value}</div>
                  <div className={styles.capacityLabel}>{s.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyChart}>Shelter capacity data coming soon</div>
          )}
        </ChartCard>
      </div>
    </section>
  );
}
