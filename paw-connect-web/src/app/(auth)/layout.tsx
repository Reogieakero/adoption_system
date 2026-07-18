"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AuthLayout from '@/components/layout/auth-layout';

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mode = pathname?.startsWith('/register') || pathname?.startsWith('/signup') ? 'register' : 'login';

  return <AuthLayout mode={mode}>{children}</AuthLayout>;
}
