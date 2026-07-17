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
  imageUrl: string;
  details: ReportDetail[];
}

const FIELD_REPORTS: ReportCardData[] = [
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4092: Hunter',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'German Shepherd Mix' },
      { label: 'Location', value: 'Barangay Central' },
      { label: 'Status', value: 'Dispatch unit en route' },
    ],
  },
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4093: Shadow',
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Stray Black Lab' },
      { label: 'Location', value: 'North Terminal Block' },
      { label: 'Status', value: 'Report verified' },
    ],
  },
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4094: Rusty',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Domestic Shorthair' },
      { label: 'Location', value: 'Riverside Market' },
      { label: 'Status', value: 'Awaiting responder' },
    ],
  },
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4095: Zeus',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Rottweiler Mix' },
      { label: 'Location', value: 'Eastside Highway' },
      { label: 'Status', value: 'En route to shelter' },
    ],
  },
  {
    label: 'LATEST FIELD REPORT',
    icon: ShieldAlert,
    iconClassName: 'iconReport',
    name: 'Case #4096: Luna',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Calico Cat Senior' },
      { label: 'Location', value: 'Uptown Residential' },
      { label: 'Status', value: 'Secured and safe' },
    ],
  },
];

const RECENT_ADOPTIONS: ReportCardData[] = [
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Bella',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Golden Retriever' },
      { label: 'Adopter', value: 'Dr. Ramirez & Family' },
      { label: 'Completed', value: '2 hours ago' },
    ],
  },
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Max',
    imageUrl: 'https://images.unsplash.com/photo-1477884213984-b9710f2314d5?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Beagle Hound' },
      { label: 'Adopter', value: 'Sarah Jenkins Miller' },
      { label: 'Completed', value: '5 hours ago' },
    ],
  },
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Coco',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Poodle Toy Miniature' },
      { label: 'Adopter', value: 'Kevin Zhang Tang' },
      { label: 'Completed', value: 'Yesterday' },
    ],
  },
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Milo',
    imageUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Siamese Purebred' },
      { label: 'Adopter', value: 'Elena Rostova Baker' },
      { label: 'Completed', value: '1 day ago' },
    ],
  },
  {
    label: 'RECENTLY ADOPTED',
    icon: CheckCircle,
    iconClassName: 'iconAdopted',
    name: 'Rocky',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop&crop=entropy&q=80',
    details: [
      { label: 'Breed/Type', value: 'Boxer Terrier Cross' },
      { label: 'Adopter', value: 'The Davis Household' },
      { label: 'Completed', value: '3 days ago' },
    ],
  },
];

export default function ReportSideCards() {
  const duplicatedReports = [...FIELD_REPORTS, ...FIELD_REPORTS];
  const duplicatedAdopters = [...RECENT_ADOPTIONS, ...RECENT_ADOPTIONS];

  return (
    <div className={styles.sideCardsColumn}>
      <div className={styles.carouselTrackContainer}>
        <div className={`${styles.carouselTrack} ${styles.trackReports}`}>
          {duplicatedReports.map(({ label, icon: Icon, iconClassName, name, imageUrl, details }, idx) => (
            <div key={`report-${idx}`} className={styles.reportSideCard}>
              <div className={styles.sideCardHeader}>
                <div className={styles.headerTextGroup}>
                  <span className={styles.sideCardLabel}>
                    <Icon size={12} className={styles[iconClassName]} />
                    {label}
                  </span>
                  <h3 className={styles.animalName}>{name}</h3>
                </div>
                <img src={imageUrl} alt={name} className={styles.avatarImage} />
              </div>
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
      </div>

      <div className={styles.carouselTrackContainer}>
        <div className={`${styles.carouselTrack} ${styles.trackAdopters}`}>
          {duplicatedAdopters.map(({ label, icon: Icon, iconClassName, name, imageUrl, details }, idx) => (
            <div key={`adopt-${idx}`} className={styles.reportSideCard}>
              <div className={styles.sideCardHeader}>
                <div className={styles.headerTextGroup}>
                  <span className={styles.sideCardLabel}>
                    <Icon size={12} className={styles[iconClassName]} />
                    {label}
                  </span>
                  <h3 className={styles.animalName}>{name}</h3>
                </div>
                <img src={imageUrl} alt={name} className={styles.avatarImage} />
              </div>
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
      </div>
    </div>
  );
}
