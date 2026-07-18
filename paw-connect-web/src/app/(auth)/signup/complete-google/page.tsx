"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Checkbox from '@/components/ui/checkbox';
import { useCompleteGoogleSignup } from '@/hooks/use-complete-google-signup';
import styles from './complete-google.module.css';

function LoadingFallback() {
  return (
    <div>
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>
      <h1 className={styles.title}>Loading...</h1>
    </div>
  );
}

function CompleteGoogleForm() {
  const {
    firstName,
    lastName,
    email,
    isAgreed,
    isSubmitting,
    errorMessage,
    isExpired,
    setFirstName,
    setLastName,
    setIsAgreed,
    handleSubmit,
  } = useCompleteGoogleSignup();

  if (isExpired) {
    return (
      <div>
        <div className={styles.windowDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <h1 className={styles.title}>Link expired</h1>
        <p className={styles.subtitle}>
          This sign-up link has expired or is invalid. Please sign in with Google again.
        </p>
        <Link href="/login" className={styles.homeLink}>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>

      <h1 className={styles.title}>Complete your sign up</h1>
      <p className={styles.subtitle}>
        We don&apos;t have an account for <strong>{email}</strong> yet — let&apos;s get you set up.
      </p>

      {errorMessage && (
        <div className={styles.noticeCard} role="alert">
          <p className={styles.fieldError}>{errorMessage}</p>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          id="firstName"
          type="text"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <FormInput
          id="lastName"
          type="text"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <FormInput
          id="email"
          type="email"
          label="Email Address"
          value={email}
          readOnly
          required
        />

        <Checkbox
          id="termsAgreement"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
        >
          By clicking to sign up, you agree to our{' '}
          <Link href="/terms" className={styles.link}>Terms of Service</Link> and{' '}
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
        </Checkbox>

        <Button
          type="submit"
          variant="solid"
          disabled={isSubmitting || !isAgreed}
        >
          {isSubmitting ? 'Creating account...' : 'Complete Sign Up'}
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function CompleteGooglePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteGoogleForm />
    </Suspense>
  );
}
