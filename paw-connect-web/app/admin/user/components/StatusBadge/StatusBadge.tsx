import React from "react";
import styles from "./StatusBadge.module.css";
import type { UserEntry } from "../../types";

export interface StatusBadgeProps {
  status: UserEntry["status"];
  className?: string;
}

const STATUS_STYLE_MAP: Record<string, string> = {
  Active: "statusActive",
  Pending: "statusPending",
  Suspended: "statusSuspended",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClass = styles[STATUS_STYLE_MAP[status] ?? "statusSuspended"];

  return (
    <span className={`${styles.badgeStatus} ${statusClass} ${className ?? ""}`}>
      {status}
    </span>
  );
}
