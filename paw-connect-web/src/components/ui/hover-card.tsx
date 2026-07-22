'use client';

import React, { useState, useRef } from 'react';
import styles from './hover-card.module.css';

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export default function HoverCard({ trigger, content, className }: HoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${className ?? ''}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {trigger}
      {isVisible && (
        <div className={styles.popup}>
          {content}
        </div>
      )}
    </div>
  );
}
