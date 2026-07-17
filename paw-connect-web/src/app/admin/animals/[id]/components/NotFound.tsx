import React from 'react';
import Link from 'next/link';
import styles from './NotFound.module.css';

interface NotFoundProps {
  id: string;
  backHref: string;
  backLabel?: string;
}

export default function NotFound({ id, backHref, backLabel = 'Back to Animals Module' }: NotFoundProps) {
  return (
    <div className={styles.notFound}>
      <p>
        No animal record found for ID <strong>{id}</strong>.
      </p>
      <Link href={backHref} className={styles.backLink}>
        &larr; {backLabel}
      </Link>
    </div>
  );
}
