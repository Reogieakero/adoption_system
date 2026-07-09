import { ShieldAlert, CheckCircle, type LucideIcon } from 'lucide-react';
import styles from './ReportSideCards.module.css';

interface ReportDetail {
  label: string;
  value: string;
}

interface ReportCardData {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  name: string;
  details: ReportDetail[];
}

const REPORTS: ReportCardData[] = [
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4092: Hunter',
    details: [
      { label: 'Breed/Type', value: 'German Shepherd Mix' },
      { label: 'Location', value: 'Barangay Central Market' },
      { label: 'Status', value: 'Dispatch unit en route' },
    ],
  },
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Bella',
    details: [
      { label: 'Breed/Type', value: 'Golden Retriever Tail' },
      { label: 'Adopter', value: 'Dr. Ramirez & Family' },
      { label: 'Completed', value: '2 hours ago' },
    ],
  },
];

export default function ReportSideCards() {
  return (
    <div className={styles.sideCardsColumn}>
      {REPORTS.map(({ label, icon: Icon, iconClassName, name, details }) => (
        <div key={label} className={styles.reportSideCard}>
          <div className={styles.sideCardHeader}>
            <span className={styles.sideCardLabel}>{label}</span>
            <Icon size={14} className={styles[iconClassName]} />
          </div>
          <h3 className={styles.animalName}>{name}</h3>
          <p className={styles.animalDetails}>
            {details.map(({ label: detailLabel, value }, i) => (
              <span key={detailLabel}>
                <strong>{detailLabel}:</strong> {value}
                {i < details.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}