import React from "react";
import styles from "./Card.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className" | "style">;

export function Card({
  children,
  className = "",
  style,
  ...rest
}: CardProps) {
  return (
    <div className={`${styles.card} ${className}`} style={{ padding: 20, ...style }} {...rest}>
      {children}
    </div>
  );
}

