import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import styles from "./ChangeBadge.module.css";

export function ChangeBadge({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span className={positive ? styles.badgeSuccess : styles.badgeDanger}>
      {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(change)}%
    </span>
  );
}

