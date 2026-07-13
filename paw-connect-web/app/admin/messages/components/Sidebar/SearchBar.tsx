import React from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.supabaseSearchWrapper}>
      <Search size={13} className={styles.searchIconLeft} />
      <input
        type="text"
        placeholder="Search conversations..."
        className={styles.supabaseSearchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.kbdShortcutHint}>
        <span>⌘</span><span>K</span>
      </div>
    </div>
  );
}
