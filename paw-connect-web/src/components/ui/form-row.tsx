import { ReactNode } from 'react';
import styles from './form-row.module.css';

export default function FormRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
