"use client";

import { useState } from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import Checkbox from '../components/ui/Checkbox';
import Divider from '../components/ui/Divider';
import GoogleButton from '../components/ui/GoogleButton';
import AuthLayout from '../components/layout/AuthLayout';
import styles from './login.module.css';

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthLayout mode="login">
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>

      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>
        Sign in to continue to your account
      </p>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

        <FormInput id="email" type="email" label="Email Address" required />

        <FormInput id="password" type="password" label="Password" minLength={8} required />

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
        >
          Sign In
        </Button>

        <Divider />

        <GoogleButton
          label="Sign in with Google"
          onClick={() => alert('Google authentication triggered')}
        />
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