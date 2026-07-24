import type { ReactNode } from 'react';
import styles from './badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'info' | 'warning' | 'danger' | 'default';
  className?: string;
}

const variantClass: Record<string, string> = {
  success: styles.success,
  info: styles.info,
  warning: styles.warning,
  danger: styles.danger,
  default: styles.default,
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${variantClass[variant] ?? styles.default} ${className ?? ''}`}>
      {children}
    </span>
  );
}
