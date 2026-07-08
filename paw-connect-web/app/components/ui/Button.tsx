import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'gradient' // Navbar "Join" CTA — gradient fill, boxy radius
  | 'solid' // Solid pill CTA (e.g. CtaSection primary action)
  | 'inverse' // White-on-dark pill CTA (e.g. Hero primary action)
  | 'ghost' // Translucent bordered pill (e.g. Hero secondary action)
  | 'outline' // Accent-bordered pill that fills on hover (e.g. "Report a Stray")
  | 'icon'; // Circular icon-only button (e.g. Navbar search/cart)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children?: ReactNode;
  /** Extra class names, merged after the variant class (layout/visibility overrides, etc). */
  className?: string;
};

export default function Button({
  variant = 'solid',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}