"use client";

import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './form-input.module.css';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/**
 * Compact shadcn-style text input: small label above a bordered field.
 * Usage: <FormInput id="email" type="email" label="Email Address" required />
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className={styles.inputFieldContainer}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`${styles.input} ${className ?? ''}`}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
