import React, { type ReactNode } from 'react';
import styles from './empty-state.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  if (message && !title) {
    return <div className={styles.emptyStateMessage}>{message}</div>;
  }

  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyStateIcon}>{icon}</div>}
      {title && <h3 className={styles.emptyTitle}>{title}</h3>}
      {description && <p className={styles.emptyDescription}>{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={styles.button}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
