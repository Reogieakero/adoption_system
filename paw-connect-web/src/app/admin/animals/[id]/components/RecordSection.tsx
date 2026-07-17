import React from 'react';
import styles from './RecordSection.module.css';

export interface RecordField {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  showPulse?: boolean;
}

interface RecordSectionProps {
  eyebrow: string;
  title: string;
  fields: RecordField[];
}

export default function RecordSection({ eyebrow, title, fields }: RecordSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionSpine} />
      <div className={styles.sectionBody}>
        <span className={styles.sectionEyebrow}>{eyebrow}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.fieldGrid}>
          {fields.map((field) => (
            <div className={styles.field} key={field.label}>
              <span className={styles.fieldLabel}>{field.label}</span>
              {field.showPulse ? (
                <span className={`${styles.fieldValueMono} ${styles.heartRateRow}`}>
                  <span className={styles.heartPulse} />
                  {field.value}
                </span>
              ) : (
                <span className={field.mono ? styles.fieldValueMono : styles.fieldValue}>
                  {field.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}