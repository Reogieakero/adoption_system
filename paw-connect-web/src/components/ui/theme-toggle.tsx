'use client';

import { useTheme } from '@/providers';
import { Sun, Moon, Monitor } from 'lucide-react';
import styles from './theme-toggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className={styles['toggle-group']} role="radiogroup" aria-label="Theme">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          className={`${styles['toggle-btn']} ${theme === value ? styles['active'] : ''}`}
          onClick={() => setTheme(value)}
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
