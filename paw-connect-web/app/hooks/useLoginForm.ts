"use client";

import { useState } from 'react';

export function useLoginForm() {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
      setSuccessMessage(
        `Login successful — welcome back, ${data.user.firstName} ${data.user.lastName} (${data.user.email}).`
      );
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
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../lib/firebase');

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Google sign-in failed');
        return;
      }

      storeSession(data.token);
      setSuccessMessage(
        `Login successful — welcome back, ${data.user.firstName} ${data.user.lastName} (${data.user.email}) via Google.`
      );
    } catch {
      setErrorMessage('Google sign-in failed. Please try again.');
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