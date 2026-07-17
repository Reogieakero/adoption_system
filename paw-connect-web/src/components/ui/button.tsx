import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.css';

export type ButtonVariant =
  | 'gradient'
  | 'solid'
  | 'inverse'
  | 'ghost'
  | 'outline'
  | 'icon'
  | 'admin-primary'
  | 'admin-secondary'
  | 'admin-danger'
  | 'admin-ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children?: ReactNode;
  className?: string;
  square?: boolean;
  active?: boolean;
};

export default function Button({
  variant = 'admin-secondary',
  className = '',
  children,
  square,
  active,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className];
  if (square) classes.push(styles['admin-square']);
  if (active) classes.push(styles['admin-active']);
  return (
    <button className={classes.filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
}
