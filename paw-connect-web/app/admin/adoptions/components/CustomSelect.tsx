import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export function CustomSelect({ value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectValueText}>{value}</span>
        <svg className={`${styles.selectChevron} ${isOpen ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.selectContent}>
          {options.map((opt) => (
            <li
              key={opt}
              className={`${styles.selectItem} ${value === opt ? styles.selectItemActive : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <span className={styles.selectValueText}>{opt}</span>
              {value === opt && (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className={styles.checkIcon}>
                  <path d="M13.5 4.5l-7 7L3.5 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
