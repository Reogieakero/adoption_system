import React from "react";
import styles from "./IconButton.module.css";

export function IconButton({
  icon: Icon,
  label,
  onClick,
  spinning = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  spinning?: boolean;
}) {
  return (
    <span className={styles.tooltipWrap}>
      <button className={styles.btnIcon} onClick={onClick} aria-label={label}>
        <Icon size={16} className={spinning ? "animate-spin" : ""} />
      </button>
      <span className={styles.tooltipBubble}>{label}</span>
    </span>
  );
}
