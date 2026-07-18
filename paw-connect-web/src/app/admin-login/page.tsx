"use client";

import { ShieldCheck } from 'lucide-react';
import LoginLayout from '@/components/auth/LoginLayout';
import { useAdminLoginForm } from '@/hooks/use-admin-login-form';

export default function AdminLoginPage() {
  const {
    formData,
    showPassword,
    isSubmitting,
    errorMessage,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useAdminLoginForm();

  return (
    <LoginLayout
      title="Sign in"
      subtitle="Enter your administrator credentials to continue."
      emailValue={formData.email}
      onEmailChange={handleChange}
      emailLabel="Admin Email"
      passwordValue={formData.password}
      onPasswordChange={handleChange}
      passwordLabel="Password"
      showPassword={showPassword}
      onTogglePassword={togglePasswordVisibility}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      badge={
        <>
          <ShieldCheck size={13} strokeWidth={2.4} />
          Restricted access
        </>
      }
      footerContent={
        <>
          Wrong console?{' '}
          <a href="/login">
            Go to the main site
          </a>
        </>
      }
    />
  );
}
