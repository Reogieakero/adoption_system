"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./ShadcnSelect.module.css";

export interface ShadcnSelectOption {
  label: string;
  value: string;
}

export interface ShadcnSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: ShadcnSelectOption[];
  placeholder: string;
}

// Custom Shadcn Dropdown/Select Primitive to respect design directives
export default function ShadcnSelect({
  value,
  onChange,
  options,
  placeholder,
}: ShadcnSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.selectTrigger}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={styles.selectArrow} />
      </button>

      {isOpen && (
        <div className={styles.selectContent}>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`${styles.selectItem} ${value === opt.value ? styles.selectItemActive : ""}`}
            >
              <span className={styles.itemCheckWrapper}>
                {value === opt.value && <Check size={12} />}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
