"use client";

import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import { useAdminLoginForm } from '../../hooks/useAdminLoginForm';
import styles from './admin-login.module.css';

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
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.badge}>Admin Access</span>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Restricted to authorized administrators only.</p>

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
      </div>
    </div>
  );
}