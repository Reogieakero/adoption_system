import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDatePicker.module.css';

interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
}

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.datePickerTriggerContent}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className={styles.selectValueText}>{value || 'Filter by date'}</span>
        </span>
        {value && (
          <span className={styles.clearDateBtn} onClick={(e) => { e.stopPropagation(); onChange(''); }}>
            ✕
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.calendarPopover}>
          <div className={styles.calendarHeader}>
            <button type="button" className={styles.calendarNavBtn} onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
            <div className={styles.calendarMonthLabel}>{MONTHS_LIST[month]} {year}</div>
            <button type="button" className={styles.calendarNavBtn} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
          </div>
          <div className={styles.calendarGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className={styles.calendarWeekDay}>{d}</div>
            ))}
            {blanks.map((_, i) => <div key={`b-${i}`} />)}
            {days.map((d) => {
              const pad = (n: number) => n.toString().padStart(2, '0');
              const currentStr = `${year}-${pad(month + 1)}-${pad(d)}`;
              const isSelected = value === currentStr;
              return (
                <button
                  key={d}
                  type="button"
                  className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ''}`}
                  onClick={() => {
                    onChange(currentStr);
                    setIsOpen(false);
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
