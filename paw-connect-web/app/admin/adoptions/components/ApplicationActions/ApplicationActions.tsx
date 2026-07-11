import React from 'react';
import type { StatusType } from '../../types';
import styles from './ApplicationActions.module.css';

interface ApplicationActionsProps {
  status: StatusType;
  onUpdateStatus: (newStatus: StatusType) => void;
  /** 'row' for the compact table layout, 'stacked' for full-width card footer buttons */
  layout?: 'row' | 'stacked';
}

export function ApplicationActions({ status, onUpdateStatus, layout = 'row' }: ApplicationActionsProps) {
  const fullWidthStyle = layout === 'stacked' ? { width: '100%' } : undefined;

  return (
    <div className={layout === 'row' ? styles.actionRow : undefined} style={layout === 'stacked' ? { display: 'contents' } : undefined}>
      <button type="button" className={styles.actionBtnSecondary} style={fullWidthStyle}>
        View details
      </button>

      {status === 'Pending' && (
        <button
          type="button"
          className={styles.actionBtnPrimary}
          style={fullWidthStyle}
          onClick={() => onUpdateStatus('Under Review')}
        >
          Review
        </button>
      )}

      {status === 'Under Review' && (
        layout === 'row' ? (
          <>
            <button type="button" className={styles.actionBtnSuccess} onClick={() => onUpdateStatus('Approved')}>
              Approve
            </button>
            <button type="button" className={styles.actionBtnDanger} onClick={() => onUpdateStatus('Rejected')}>
              Reject
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.25rem', width: '100%' }}>
            <button type="button" className={styles.actionBtnSuccess} style={{ flex: 1 }} onClick={() => onUpdateStatus('Approved')}>
              Approve
            </button>
            <button type="button" className={styles.actionBtnDanger} style={{ flex: 1 }} onClick={() => onUpdateStatus('Rejected')}>
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
          onClick={() => onUpdateStatus('Adopted')}
        >
          Mark as adopted
        </button>
      )}
    </div>
  );
}
