import React from 'react';
import styles from './PhotoDossier.module.css';

/** The subset of an animal record this component needs to render. */
export interface PhotoDossierAnimal {
  id: string;
  name: string;
  photo: string;
  species: string;
  breed: string;
  adoptionStatus: string;
  rescueStatus: string;
  healthStatus: string;
  bio: string;
}

interface PhotoDossierProps {
  animal: PhotoDossierAnimal;
}

function adoptionBadgeClass(status: string) {
  switch (status) {
    case 'Available':
      return styles.bgOcean;
    case 'Pending':
      return styles.bgRoyal;
    case 'Adopted':
      return styles.bgNavy;
    default:
      return styles.bgSlate;
  }
}

function healthBadgeClass(status: string) {
  switch (status) {
    case 'Healthy':
      return styles.bgOcean;
    case 'Recovering':
      return styles.bgRoyal;
    case 'Under Treatment':
      return styles.bgNavy;
    case 'Critical':
      return styles.bgDanger;
    default:
      return styles.bgSlate;
  }
}

function rescueBadgeClass(status: string) {
  switch (status) {
    case 'Rescued':
      return styles.bgOcean;
    case 'In Shelter':
      return styles.bgNavy;
    default:
      return styles.bgRoyal;
  }
}

export default function PhotoDossier({ animal }: PhotoDossierProps) {
  return (
    <div className={styles.photoPane}>
      <div className={styles.photoCard}>
        <div className={styles.photoFrame}>
          <img src={animal.photo} alt={animal.name} className={styles.heroPhoto} />
        </div>
        <div className={styles.idStamp}>{animal.id}</div>
      </div>

      <div className={styles.nameBlock}>
        <h1 className={styles.heroName}>{animal.name}</h1>
        <div className={styles.heroMeta}>
          <span>{animal.species} &middot; {animal.breed}</span>
          <span className={styles.heroId}>&middot; {animal.id}</span>
        </div>
      </div>

      <div className={styles.heroBadges}>
        <span className={`${styles.badge} ${adoptionBadgeClass(animal.adoptionStatus)}`}>
          {animal.adoptionStatus}
        </span>
        <span className={`${styles.badge} ${rescueBadgeClass(animal.rescueStatus)}`}>
          {animal.rescueStatus}
        </span>
        <span className={`${styles.badge} ${healthBadgeClass(animal.healthStatus)}`}>
          {animal.healthStatus}
        </span>
      </div>

      <p className={styles.bio}>{animal.bio}</p>
    </div>
  );
}
