"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Checkbox from '@/components/ui/checkbox';
import styles from './login-layout.module.css';

interface LoginLayoutProps {
  title: string;
  subtitle: string;
  emailValue: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emailLabel?: string;
  passwordValue: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordLabel?: string;
  passwordMinLength?: number;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  errorMessage?: string;
  successMessage?: string;
  showRememberMe?: boolean;
  rememberMeChecked?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
  forgotPasswordHref?: string;
  badge?: React.ReactNode;
  extraContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function LoginLayout({
  title,
  subtitle,
  emailValue,
  onEmailChange,
  emailLabel = 'Email Address',
  passwordValue,
  onPasswordChange,
  passwordLabel = 'Password',
  passwordMinLength,
  showPassword,
  onTogglePassword,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Sign In',
  errorMessage,
  successMessage,
  showRememberMe = false,
  rememberMeChecked = false,
  onRememberMeChange,
  forgotPasswordHref,
  badge,
  extraContent,
  footerContent,
}: LoginLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandName}>PawConnect</span>
        </div>

        {badge && <div className={styles.badge}>{badge}</div>}

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        {errorMessage && (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.fieldError}>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className={styles.successCard} role="status">
            <p className={styles.successText}>{successMessage}</p>
          </div>
        )}

        <form className={styles.form} onSubmit={onSubmit}>
          <FormInput
            id="email"
            type="email"
            label={emailLabel}
            value={emailValue}
            onChange={onEmailChange}
            required
          />

          <div className={styles.passwordField}>
            <FormInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              label={passwordLabel}
              value={passwordValue}
              onChange={onPasswordChange}
              minLength={passwordMinLength}
              className={styles.passwordInput}
              required
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={onTogglePassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {(showRememberMe || forgotPasswordHref) && (
            <div className={styles.optionsRow}>
              {showRememberMe && (
                <Checkbox
                  id="rememberMe"
                  checked={rememberMeChecked}
                  onChange={(e) => onRememberMeChange?.(e.target.checked)}
                >
                  Remember me
                </Checkbox>
              )}
              {forgotPasswordHref && (
                <Link href={forgotPasswordHref} className={styles.link}>
                  Forgot password?
                </Link>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="solid"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : submitLabel}
          </Button>

          {extraContent && <div>{extraContent}</div>}
        </form>

        {footerContent && <div className={styles.footer}>{footerContent}</div>}
      </div>
    </div>
  );
}
