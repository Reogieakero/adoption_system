"use client";

import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { useAdminLoginForm } from '@/hooks/use-admin-login-form';
import styles from './admin-login.module.css';

const SECURITY_NOTES = [
  'Access is limited to a single verified administrator.',
  'Sessions expire automatically after 12 hours.',
  'Passwords are hashed and never stored in plain text.',
];

export default function AdminLoginPage() {
  const {
    formData,
    showPassword,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useAdminLoginForm();

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandPanelInner}>
          <div className={styles.wordmark}>
            <span className={styles.wordmarkMain}>PawConnect</span>
            <span className={styles.eyebrow}>Admin Console</span>
          </div>

          <h1 className={styles.headline}>
            Every listing, every applicant,
            <br />
            one ledger.
          </h1>
          <p className={styles.headlineSupport}>
            This console reviews adoption applications, manages shelter listings, and verifies
            accounts across PawConnect. It isn&apos;t the public site â€” treat it accordingly.
          </p>

          <ul className={styles.statusList}>
            <li className={styles.statusItem}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>System online</span>
            </li>
            {SECURITY_NOTES.map((note) => (
              <li key={note} className={styles.securityNote}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formPanelInner}>
          <div className={styles.mobileWordmark}>
            <span className={styles.wordmarkMain}>PawConnect</span>
            <span className={styles.eyebrow}>Admin Console</span>
          </div>

          <span className={styles.badge}>
            <ShieldCheck size={13} strokeWidth={2.4} />
            Restricted access
          </span>

          <h2 className={styles.title}>Sign in</h2>
          <p className={styles.subtitle}>Enter your administrator credentials to continue.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
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

            <FormInput
              id="email"
              type="email"
              label="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className={styles.passwordField}>
              <FormInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="solid"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className={styles.footerNote}>
            Wrong console?{' '}
            <a href="/login" className={styles.footerLink}>
              Go to the main site
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

