import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  shownCount: number;
  totalCount: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export default function Pagination({
  shownCount,
  totalCount,
  pageSizeOptions = [18],
  currentPage = 1,
  hasPrevPage = false,
  hasNextPage = true,
  onPrevPage,
  onNextPage,
}: PaginationProps) {
  return (
    <div className={styles.footerSection}>
      <div className={styles.toolbarCard}>
        <div className={styles.row}>
          <div className={styles.pageSizeGroup}>
          </div>
          <div className={styles.pageControls}>
            <span>{totalCount} animals</span>
            <div className={styles.pageButtons}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
