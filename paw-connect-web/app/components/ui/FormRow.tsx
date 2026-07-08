import { ReactNode } from 'react';
import styles from './FormRow.module.css';

export default function FormRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}