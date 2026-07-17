import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, CheckCircle2 } from "lucide-react";
import styles from "./Select.module.css";

export function Select({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  searchable = false,
}: {
  label: string;
  icon?: React.ElementType;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className={styles.selectWrapper}>
      <button
        className={open ? `${styles.selectTrigger} ${styles.selectTriggerOpen}` : styles.selectTrigger}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.selectTriggerContent}>
          {Icon && <Icon size={14} />}
          <span className={styles.selectTriggerLabel}>{value || label}</span>
        </span>
        <ChevronDown size={14} className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron} />
      </button>
      {open && (
        <div className={styles.selectContent}>
          {searchable && (
            <div className={styles.searchContainer}>
              <Search size={13} className={styles.searchIcon} />
              <input
                autoFocus
                className={styles.searchInput}
                placeholder={`Search ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div className={styles.optionsScrollContainer}>
            {filtered.map((opt) => (
              <div
                key={opt}
                className={opt === value ? styles.selectItemActive : styles.selectItem}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{opt}</span>
                {opt === value && <CheckCircle2 size={14} />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={styles.noResults}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
