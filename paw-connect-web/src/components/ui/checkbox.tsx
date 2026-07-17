"use client";

import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  children: ReactNode;
}

/**
 * Generic checkbox + label row. Pass links/rich text as children.
 * Usage:
 * <Checkbox id="terms" checked={isAgreed} onChange={...}>
 *   I agree to the <Link href="/terms">Terms</Link>
 * </Checkbox>
 */
export default function Checkbox({ id, children, className, ...props }: CheckboxProps) {
  return (
    <div className={styles.checkboxGroup}>
      <input
        type="checkbox"
        id={id}
        className={`${styles.checkbox} ${className ?? ''}`}
        {...props}
      />
      <label htmlFor={id} className={styles.legalText}>
        {children}
      </label>
    </div>
  );
}
