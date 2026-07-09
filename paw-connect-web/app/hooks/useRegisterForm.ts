import { useState, useRef, useEffect, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../lib/config';
import { getPasswordErrors } from '../lib/validation/password';
import type { RegisterFormData, RegisterResponse, FieldError } from '../types/auth';

const INITIAL_FORM_DATA: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

// The backend responds with `requiresVerification: true` on a successful
// /register call. Add this field to RegisterResponse in types/auth.ts if
// it isn't there yet.
type RegisterApiResponse = RegisterResponse & { requiresVerification?: boolean };

interface VerifyApiResponse {
  success: boolean;
  message?: string;
}

type Stage = 'form' | 'verify';

export function useRegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Email verification stage ---
  const [stage, setStage] = useState<Stage>('form');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const passwordErrors = getPasswordErrors(formData.password);
  const passwordsMatch =
    formData.confirmPassword.length === 0 || formData.password === formData.confirmPassword;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAgreedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAgreed) return;

    if (passwordErrors.length > 0) {
      setErrorMessage('Password does not meet the requirements below.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: RegisterApiResponse = await res.json();

      if (!res.ok || !data.success) {
        const message =
          data.errors?.map((err: FieldError) => err.message).join(' ') ||
          data.message ||
          'Something went wrong. Please try again.';
        setErrorMessage(message);
        return;
      }

      if (data.requiresVerification) {
        setStage('verify');
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        return;
      }

      router.push('/login');
    } catch (err: unknown) {
      setErrorMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Verification stage handlers ---

  const handleCodeChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow pasting the whole code into one box
    const digitsOnly = raw.replace(/\D/g, '');

    if (digitsOnly.length > 1) {
      const pasted = digitsOnly.slice(0, CODE_LENGTH).split('');
      setCodeDigits((prev) => {
        const next = [...prev];
        pasted.forEach((digit, i) => {
          if (index + i < CODE_LENGTH) next[index + i] = digit;
        });
        return next;
      });
      const nextFocusIndex = Math.min(index + pasted.length, CODE_LENGTH - 1);
      codeInputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = digitsOnly;
      return next;
    });

    if (digitsOnly && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifyError('');

    const code = codeDigits.join('');
    if (code.length !== CODE_LENGTH) {
      setVerifyError(`Enter the full ${CODE_LENGTH}-digit code.`);
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });

      const data: VerifyApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setVerifyError(data.message || 'Invalid or expired code. Please try again.');
        return;
      }

      router.push('/login?verified=1');
    } catch (err: unknown) {
      setVerifyError('Unable to reach the server. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setResendMessage('');
    setVerifyError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data: VerifyApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setVerifyError(data.message || 'Could not resend the code. Please try again.');
        return;
      }

      setCodeDigits(Array(CODE_LENGTH).fill(''));
      setResendMessage('A new code was sent to your email.');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      codeInputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setVerifyError('Unable to reach the server. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const backToForm = () => {
    setStage('form');
    setCodeDigits(Array(CODE_LENGTH).fill(''));
    setVerifyError('');
    setResendMessage('');
  };

  return {
    formData,
    isAgreed,
    isSubmitting,
    errorMessage,
    showPassword,
    showConfirmPassword,
    passwordErrors,
    passwordsMatch,
    handleChange,
    handleAgreedChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,

    // verification stage
    stage,
    codeDigits,
    codeInputRefs,
    isVerifying,
    verifyError,
    isResending,
    resendMessage,
    resendCooldown,
    handleCodeChange,
    handleCodeKeyDown,
    handleVerifySubmit,
    handleResendCode,
    backToForm,
  };
}