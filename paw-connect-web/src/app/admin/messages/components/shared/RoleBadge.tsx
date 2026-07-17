import React from 'react';
import styles from './RoleBadge.module.css';

interface RoleBadgeProps {
  role: string;
  noMargin?: boolean;
}

export default function RoleBadge({ role, noMargin }: RoleBadgeProps) {
  return (
    <span className={`${styles.roleBadge}${noMargin ? ` ${styles.noMargin}` : ''}`}>
      {role}
    </span>
  );
}

