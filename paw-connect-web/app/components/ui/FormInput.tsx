"use client";

import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/**
 * Generic floating-label text input.
 * Usage: <FormInput id="email" type="email" label="Email Address" required />
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className={styles.inputFieldContainer}>
        <input
          ref={ref}
          id={id}
          className={`${styles.floatingInput} ${className ?? ''}`}
          placeholder=" "
          {...props}
        />
        <label htmlFor={id} className={styles.floatingLabel}>
          {label}
        </label>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;