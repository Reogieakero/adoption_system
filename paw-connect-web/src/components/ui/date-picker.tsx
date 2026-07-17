'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './button';
import styles from './date-picker.module.css';

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
}

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function DatePicker({ value, onChange }: DatePickerProps) {
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
    <div className={styles.wrapper} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.triggerContent}>
          <Calendar size={14} className={styles.icon} />
          <span className={styles.valueText}>{value || 'Filter by date'}</span>
        </span>
        {value && (
          <span className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); onChange(''); }}>
            <X size={12} />
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.calendarPopover}>
          <div className={styles.calendarHeader}>
            <Button variant="admin-ghost" square onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <ChevronLeft size={14} />
            </Button>
            <div className={styles.calendarMonthLabel}>{MONTHS_LIST[month]} {year}</div>
            <Button variant="admin-ghost" square onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <ChevronRight size={14} />
            </Button>
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
