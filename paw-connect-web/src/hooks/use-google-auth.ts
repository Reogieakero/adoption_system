"use client";

import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import type { GoogleSignInPending } from '@/types/auth';

export function useGoogleAuth() {
  const router = useRouter();

  async function signInWithGoogle(): Promise<{ token: string; user: { firstName: string; lastName: string; email: string } } | null> {
    const { signInWithPopup } = await import('firebase/auth');
    const { auth, googleProvider } = await import('../lib/firebase');

    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Google sign-in failed');
    }

    if (data.requiresSignupCompletion) {
      const pending: GoogleSignInPending = data;
      router.push(`/signup/complete-google?token=${encodeURIComponent(pending.pendingToken)}`);
      return null;
    }

    return { token: data.token, user: data.user };
  }

  return { signInWithGoogle };
}
