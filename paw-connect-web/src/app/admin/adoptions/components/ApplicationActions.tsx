import React, { useState } from 'react';
import type { AdoptionStatus } from '@/types';
import { formatStatus } from '@/lib/format-status';
import Button from '@/components/ui/button';
import styles from './ApplicationActions.module.css';

interface ApplicationActionsProps {
  status: AdoptionStatus;
  onUpdateStatus: (newStatus: AdoptionStatus) => void;
  onViewDetails?: () => void;
  /** 'row' for the compact table layout, 'stacked' for full-width card footer buttons */
  layout?: 'row' | 'stacked';
}

export function ApplicationActions({ status, onUpdateStatus, onViewDetails, layout = 'row' }: ApplicationActionsProps) {
  // Local state to hold the state change intention before confirmation
  const [pendingStatus, setPendingStatus] = useState<AdoptionStatus | null>(null);

  const isStacked = layout === 'stacked';

  const handleActionIntent = (nextStatus: AdoptionStatus) => {
    setPendingStatus(nextStatus);
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      onUpdateStatus(pendingStatus);
      setPendingStatus(null);
    }
  };

  const handleCancel = () => {
    setPendingStatus(null);
  };

  // If there is an active confirmation loop, render the Contextual Overlay
  if (pendingStatus) {
    if (!isStacked) {
      return (
        <div className={styles.confirmOverlay}>
          <span className={styles.confirmMessage}>Change to {formatStatus(pendingStatus)}?</span>
          <Button variant="admin-primary" onClick={handleConfirm}>Yes</Button>
          <Button variant="admin-secondary" onClick={handleCancel}>No</Button>
        </div>
      );
    }

    return (
      <div className={styles.confirmOverlayStacked}>
        <div className={styles.confirmMessageStacked}>
          Are you sure you want to change status to: {formatStatus(pendingStatus)}?
        </div>
        <div className={styles.buttonRow}>
          <Button variant="admin-primary" className={styles.flex1} onClick={handleConfirm}>Confirm Action</Button>
          <Button variant="admin-secondary" className={styles.flex1} onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  // Base actions mapping when no confirmation dialog is requested
  return (
      <div 
        className={!isStacked ? `${styles.actionRow} ${styles.inlineFlex}` : styles.actionContainerStacked}
      >
        <Button variant="admin-secondary" className={isStacked ? styles.fullWidth : ''} onClick={onViewDetails}>
          View Details
        </Button>

        {status === 'pending_review' && (
          !isStacked ? (
            <>
              <Button variant="admin-primary" onClick={() => handleActionIntent('approved')}>Approve</Button>
              <Button variant="admin-primary" onClick={() => handleActionIntent('rejected')}>Reject</Button>
            </>
          ) : (
            <div className={styles.buttonRow}>
              <Button variant="admin-primary" className={styles.flex1} onClick={() => handleActionIntent('approved')}>Approve</Button>
              <Button variant="admin-primary" className={styles.flex1} onClick={() => handleActionIntent('rejected')}>Reject</Button>
            </div>
          )
        )}

      {status === 'approved' && (
        <Button variant="admin-primary" className={isStacked ? styles.fullWidth : ''} onClick={() => handleActionIntent('pet_unavailable')}>
          Animal Released
        </Button>
      )}
    </div>
  );
}
