'use client';

import Button from '@/components/ui/button';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button variant="admin-secondary" disabled={page <= 1} onClick={onPrev}>
        Previous
      </Button>
      <span className={styles.pageInfo}>
        Page {page} of {totalPages}
      </span>
      <Button variant="admin-secondary" disabled={page >= totalPages} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
