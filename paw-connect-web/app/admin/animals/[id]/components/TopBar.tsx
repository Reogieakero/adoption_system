import React from 'react';
import Link from 'next/link';
import styles from './TopBar.module.css';

interface TopBarProps {
  /** Where the back link should navigate to. */
  backHref: string;
  /** Optional label override for the back link. */
  backLabel?: string;
  onArchive?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function TopBar({
  backHref,
  backLabel = 'Back to Animals Module',
  onArchive,
  onDelete,
  onEdit,
}: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <Link href={backHref} className={styles.backLink}>
        &larr; {backLabel}
      </Link>
      <div className={styles.actionsBar}>
        <button className={styles.actionBtn} onClick={onArchive}>
          Archive
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={onEdit}
        >
          Edit Record
        </button>
      </div>
    </div>
  );
}
