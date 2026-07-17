import React from 'react';
import styles from './DataSegment.module.css';

interface DataField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DataSegmentProps {
  title: string;
  fields: DataField[];
}

export default function DataSegment({ title, fields }: DataSegmentProps) {
  return (
    <div className={styles.dataSegmentBlock}>
      <h4 className={styles.segmentTitle}>{title}</h4>
      <div className={styles.dataFieldsGrid}>
        {fields.map((field) => (
          <div
            key={field.label}
            className={field.fullWidth ? styles.dataFieldFullWidth : undefined}
          >
            <div className={styles.fieldLabel}>{field.label}</div>
            <div className={styles.fieldValue}>{field.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

