import React from "react";
import Button from '@/components/ui/button';
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
      <Button variant="admin-ghost" square onClick={onClick} aria-label={label}>
        <Icon size={16} className={spinning ? "animate-spin" : ""} />
      </Button>
      <span className={styles.tooltipBubble}>{label}</span>
    </span>
  );
}

