import React from "react";
import { Card } from "./Card";

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
    <Card style={{ gridColumn: `span ${span}` }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}
