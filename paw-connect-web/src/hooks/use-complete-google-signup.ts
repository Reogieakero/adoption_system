"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

interface CompleteGoogleSignupState {
  firstName: string;
  lastName: string;
  email: string;
  isAgreed: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  isExpired: boolean;
}

export function useCompleteGoogleSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');

  const [state, setState] = useState<CompleteGoogleSignupState>({
    firstName: '',
    lastName: '',
    email: '',
    isAgreed: false,
    isSubmitting: false,
    errorMessage: '',
    isExpired: false,
  });

  useEffect(() => {
    const raw = searchParams.get('token');
    if (!raw) {
      setState((s) => ({ ...s, isExpired: true }));
      return;
    }

    const payload = parseJwtPayload(raw);
    if (!payload || !payload.email || !payload.googleUid) {
      setState((s) => ({ ...s, isExpired: true }));
      return;
    }

    setToken(raw);
    setState((s) => ({
      ...s,
      firstName: (payload.firstName as string) || '',
      lastName: (payload.lastName as string) || '',
      email: payload.email as string,
    }));
  }, [searchParams]);

  const setFirstName = useCallback(
    (value: string) => setState((s) => ({ ...s, firstName: value })),
    []
  );
  const setLastName = useCallback(
    (value: string) => setState((s) => ({ ...s, lastName: value })),
    []
  );
  const setIsAgreed = useCallback(
    (value: boolean) => setState((s) => ({ ...s, isAgreed: value })),
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState((s) => ({ ...s, errorMessage: '' }));

    if (!state.isAgreed) return;

    setState((s) => ({ ...s, isSubmitting: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingToken: token, agreedTerms: state.isAgreed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setState((s) => ({ ...s, errorMessage: data.message || 'Something went wrong. Please try again.' }));
        return;
      }

      sessionStorage.setItem('authToken', data.token);
      router.push('/');
    } catch {
      setState((s) => ({ ...s, errorMessage: 'Unable to reach the server. Please try again.' }));
    } finally {
      setState((s) => ({ ...s, isSubmitting: false }));
    }
  }

  return { ...state, setFirstName, setLastName, setIsAgreed, handleSubmit };
}
