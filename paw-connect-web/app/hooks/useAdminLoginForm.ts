"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
        return;
      }

      sessionStorage.setItem('adminAuthToken', data.token);
      setSuccessMessage(`Login successful. Welcome back, ${data.admin.email}.`);
      router.push('/admin/dashboard');
    } catch {
      setErrorMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    formData,
    showPassword,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}