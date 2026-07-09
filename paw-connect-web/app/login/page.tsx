"use client";

import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import Checkbox from '../components/ui/Checkbox';
import Divider from '../components/ui/Divider';
import GoogleButton from '../components/ui/GoogleButton';
import AuthLayout from '../components/layout/AuthLayout';
import { useLoginForm } from '../hooks/useLoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  const {
    formData,
    rememberMe,
    setRememberMe,
    showPassword,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleAuth,
  } = useLoginForm();

  return (
    <AuthLayout mode="login">
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>

      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to continue to your account</p>

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
          label="Email Address"
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
            minLength={8}
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

        <div className={styles.optionsRow}>
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>

          <Link href="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="solid"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <Divider />

        <GoogleButton label="Sign in with Google" onClick={handleGoogleAuth} />
      </form>

      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}