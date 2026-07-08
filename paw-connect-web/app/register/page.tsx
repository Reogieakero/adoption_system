"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormRow from '../components/ui/FormRow';
import Checkbox from '../components/ui/Checkbox';
import Divider from '../components/ui/Divider';
import GoogleButton from '../components/ui/GoogleButton';
import AuthLayout from '../components/layout/AuthLayout';
import styles from './register.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FieldError {
  field: string;
  message: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  errors?: FieldError[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAgreed) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok || !data.success) {
        const message =
          data.errors?.map((err: FieldError) => err.message).join(' ') ||
          data.message ||
          'Something went wrong. Please try again.';
        setErrorMessage(message);
        return;
      }

      router.push('/login');
    } catch (err: unknown) {
      setErrorMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>

      <h1 className={styles.title}>Create an account</h1>
      <p className={styles.subtitle}>
        Let&apos;s get started with your custom profile setups
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>

        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}

        <FormRow>
          <FormInput
            id="firstName"
            type="text"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormInput
            id="lastName"
            type="text"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </FormRow>

        <FormInput
          id="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          id="password"
          type="password"
          label="Password"
          minLength={8}
          value={formData.password}
          onChange={handleChange}
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
          className={styles.submitButton}
          disabled={!isAgreed || isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>

        <Divider />

        <GoogleButton
          label="Sign up with Google"
          onClick={() => alert('Google authentication triggered')}
        />
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}