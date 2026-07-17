'use client';

import { Search } from 'lucide-react';
import styles from './search-bar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortcutHint?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  shortcutHint,
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <Search size={14} className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {shortcutHint && (
        <div className={styles.shortcut}>
          {shortcutHint}
        </div>
      )}
    </div>
  );
}
