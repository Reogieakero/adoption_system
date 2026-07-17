'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolved: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark', theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'system') {
    root.classList.add(resolved);
  } else {
    root.classList.add(theme);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('pawconnect-theme') as Theme | null;
    const initial = stored ?? 'system';
    setThemeState(initial);
    setResolved(initial === 'system' ? getSystemTheme() : initial);
  }, []);

  useEffect(() => {
    applyTheme(resolved, theme);
  }, [resolved, theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const sys = getSystemTheme();
      setResolved(sys);
      applyTheme(sys, 'system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (next: Theme) => {
    localStorage.setItem('pawconnect-theme', next);
    setThemeState(next);
    if (next === 'system') {
      const sys = getSystemTheme();
      setResolved(sys);
      applyTheme(sys, 'system');
    } else {
      setResolved(next);
      applyTheme(next, next);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
