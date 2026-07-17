import React from "react";
import { Card } from "./Card";
import styles from "./ChartCard.module.css";

export function ChartCard({
  title,
  subtitle,
  children,
  span = 1,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <Card className={styles.chartCard} data-span={span}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

