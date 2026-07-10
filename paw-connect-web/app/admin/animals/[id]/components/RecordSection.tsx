import React from 'react';
import styles from './RecordSection.module.css';

export type SpineColor = 'ocean' | 'royal' | 'navy';

export interface RecordField {
  label: string;
  value: React.ReactNode;
  /** Render the value in the monospace/data style used for IDs and dates. */
  mono?: boolean;
  /** Show the live heart-rate pulse dot next to the value. */
  showPulse?: boolean;
}

interface RecordSectionProps {
  /** Small uppercase label above the title, e.g. "Record 01". */
  eyebrow: string;
  title: string;
  spine: SpineColor;
  fields: RecordField[];
}

const spineClassByColor: Record<SpineColor, keyof typeof styles> = {
  ocean: 'spineOcean',
  royal: 'spineRoyal',
  navy: 'spineNavy',
};

export default function RecordSection({ eyebrow, title, spine, fields }: RecordSectionProps) {
  return (
    <div className={styles.section}>
      <div className={`${styles.sectionSpine} ${styles[spineClassByColor[spine]]}`} />
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
