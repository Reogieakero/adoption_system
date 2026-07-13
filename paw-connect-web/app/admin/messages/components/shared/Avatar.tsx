import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  fallback: string;
  url?: string;
}

export default function Avatar({ name, fallback, url }: AvatarProps) {
  if (url) {
    return <img src={url} alt={name} className={styles.avatarImage} />;
  }
  return (
    <div className={styles.avatarFallback}>
      {fallback}
    </div>
  );
}
