import styles from './Divider.module.css';

interface DividerProps {
  text?: string;
}

/** Generic "── or ──" divider used to separate auth methods. */
export default function Divider({ text = 'or' }: DividerProps) {
  return (
    <div className={styles.dividerContainer}>
      <div className={styles.dividerLine} />
      <span className={styles.dividerText}>{text}</span>
      <div className={styles.dividerLine} />
    </div>
  );
}