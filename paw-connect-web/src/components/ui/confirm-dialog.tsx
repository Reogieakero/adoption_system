'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Button from './button';
import styles from './confirm-dialog.module.css';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'admin-primary' | 'admin-danger';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  resolve: (value: boolean) => void;
}

let confirmRef: ((state: ConfirmDialogState | null) => void) | null = null;

export function confirm(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (confirmRef) {
      confirmRef({ ...options, resolve, confirmLabel: options.confirmLabel ?? 'Confirm', cancelLabel: options.cancelLabel ?? 'Cancel', variant: options.variant ?? 'admin-primary' });
    }
  });
}

export function ConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState | null>(null);
  useEffect(() => {
    confirmRef = setState;
    return () => { confirmRef = null; };
  }, []);

  const handleClose = useCallback(() => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  }, [state]);

  const handleConfirm = useCallback(() => {
    if (state) {
      state.resolve(true);
      setState(null);
    }
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [state, handleClose]);

  if (!state) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className={styles.title}>{state.title}</h3>
        <p className={styles.message}>{state.message}</p>
        <div className={styles.actions}>
          <Button variant="admin-secondary" onClick={handleClose}>
            {state.cancelLabel}
          </Button>
          <Button variant={state.variant} onClick={handleConfirm}>
            {state.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
