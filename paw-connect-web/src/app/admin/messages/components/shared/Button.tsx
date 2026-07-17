"use client";

import React from 'react';
import BaseButton from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  square?: boolean;
  primary?: boolean;
}

export default function Button({ square, primary, ...rest }: ButtonProps) {
  return <BaseButton variant={primary ? 'admin-primary' : 'admin-secondary'} square={square} {...rest} />;
}
