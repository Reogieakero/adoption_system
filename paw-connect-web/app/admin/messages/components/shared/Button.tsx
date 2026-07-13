"use client";

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  square?: boolean;
  primary?: boolean;
}

export default function Button({ square, primary, className = '', children, ...rest }: ButtonProps) {
  const classNames = [
    styles.btn,
    square ? styles.btnSquare : '',
    primary ? styles.btnPrimary : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
}
