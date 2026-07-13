import React, { useState } from 'react';
import type { StatusType } from '../types';
import styles from './ApplicationActions.module.css';

interface ApplicationActionsProps {
  status: StatusType;
  onUpdateStatus: (newStatus: StatusType) => void;
  onViewDetails?: () => void;
  /** 'row' for the compact table layout, 'stacked' for full-width card footer buttons */
  layout?: 'row' | 'stacked';
}

export function ApplicationActions({ status, onUpdateStatus, onViewDetails, layout = 'row' }: ApplicationActionsProps) {
  // Local state to hold the state change intention before confirmation
  const [pendingStatus, setPendingStatus] = useState<StatusType | null>(null);

  const fullWidthStyle = layout === 'stacked' ? { width: '100%' } : undefined;
  const isStacked = layout === 'stacked';

  const handleActionIntent = (nextStatus: StatusType) => {
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
          <span className={styles.confirmMessage}>Change to {pendingStatus}?</span>
          <button type="button" className={styles.actionBtnSuccess} onClick={handleConfirm}>
            Yes
          </button>
          <button type="button" className={styles.actionBtnSecondary} onClick={handleCancel}>
            No
          </button>
        </div>
      );
    }

    return (
      <div className={styles.confirmOverlayStacked}>
        <div className={styles.confirmMessageStacked}>
          Are you sure you want to change status to: {pendingStatus}?
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', width: '100%' }}>
          <button type="button" className={styles.actionBtnSuccess} style={{ flex: 1 }} onClick={handleConfirm}>
            Confirm Action
          </button>
          <button type="button" className={styles.actionBtnSecondary} style={{ flex: 1 }} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Base actions mapping when no confirmation dialog is requested
  return (
    <div 
      className={!isStacked ? styles.actionRow : styles.actionContainerStacked} 
      style={isStacked ? undefined : { display: 'inline-flex' }}
    >
      <button type="button" className={styles.actionBtnSecondary} style={fullWidthStyle} onClick={onViewDetails}>
        View details
      </button>

      {status === 'Pending' && (
        <button
          type="button"
          className={styles.actionBtnPrimary}
          style={fullWidthStyle}
          onClick={() => handleActionIntent('Under Review')}
        >
          Review
        </button>
      )}

      {status === 'Under Review' && (
        !isStacked ? (
          <>
            <button type="button" className={styles.actionBtnSuccess} onClick={() => handleActionIntent('Approved')}>
              Approve
            </button>
            <button type="button" className={styles.actionBtnDanger} onClick={() => handleActionIntent('Rejected')}>
              Reject
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.25rem', width: '100%' }}>
            <button type="button" className={styles.actionBtnSuccess} style={{ flex: 1 }} onClick={() => handleActionIntent('Approved')}>
              Approve
            </button>
            <button type="button" className={styles.actionBtnDanger} style={{ flex: 1 }} onClick={() => handleActionIntent('Rejected')}>
              Reject
            </button>
          </div>
        )
      )}

      {status === 'Approved' && (
        <button
          type="button"
          className={styles.actionBtnFinal}
          style={fullWidthStyle}
          onClick={() => handleActionIntent('Adopted')}
        >
          Mark as adopted
        </button>
      )}
    </div>
  );
}