'use client';

import { X } from 'lucide-react';
import styles from './floating-message.module.css';

interface FloatingMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}

export default function FloatingMessage({ message, type = 'error', onDismiss }: FloatingMessageProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.text}>{message}</span>
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
