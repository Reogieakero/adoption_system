import React from "react";
import { Users } from "lucide-react";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No users found",
  description = "Registered users will appear here once accounts are created.",
}: EmptyStateProps) {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyIconCircle}>
        <Users size={24} color="#94a3b8" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
