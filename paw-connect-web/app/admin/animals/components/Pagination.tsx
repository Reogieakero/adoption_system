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
            <span>Cards per page:</span>
            <select className={styles.selectFilter}>
              {pageSizeOptions.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className={styles.pageControls}>
            <span>1-{shownCount} of {totalCount}</span>
            <div className={styles.pageButtons}>
              <button
                disabled={!hasPrevPage}
                onClick={onPrevPage}
                className={styles.pageBtn}
              >
                &larr;
              </button>
              <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
                {currentPage}
              </button>
              <button
                disabled={!hasNextPage}
                onClick={onNextPage}
                className={styles.pageBtn}
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
