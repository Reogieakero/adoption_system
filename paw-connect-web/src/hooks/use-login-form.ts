"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { useGoogleAuth } from '@/hooks/use-google-auth';

export function useLoginForm() {
  const router = useRouter();
  const { signInWithGoogle } = useGoogleAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function storeSession(token: string) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
        return;
      }

      storeSession(data.token);
      router.push('/home');
    } catch {
      setErrorMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleAuth() {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await signInWithGoogle();
      if (!result) return;

      storeSession(result.token);
      router.push('/home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
