import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = 'No animals match your search or filters. Try adjusting them to see more records.',
}: EmptyStateProps) {
  return <div className={styles.emptyState}>{message}</div>;
}
