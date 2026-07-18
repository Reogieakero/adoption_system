'use client';

import styles from './PersonalizedHeader.module.css';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? '?').toUpperCase();
}

interface PersonalizedHeaderProps {
  name?: string;
  avatarUrl?: string;
}

export default function PersonalizedHeader({ name = 'there', avatarUrl }: PersonalizedHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.textGroup}>
        <span className={styles.eyebrow}>{getGreeting()}</span>
        <h1 className={styles.heading}>
          Ready to find your new best friend, <span className={styles.name}>{name}</span>?
        </h1>
      </div>
      <div className={styles.avatarWrap}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className={styles.avatar} />
        ) : (
          <span className={styles.avatarFallback}>{getInitials(name)}</span>
        )}
      </div>
    </header>
  );
}
