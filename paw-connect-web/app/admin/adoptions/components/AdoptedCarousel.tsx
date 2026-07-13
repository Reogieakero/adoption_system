import React from 'react';
import type { AdoptionApplication } from '../types';
import styles from './AdoptedCarousel.module.css';

interface AdoptedCarouselProps {
  animals: AdoptionApplication[];
}

export function AdoptedCarousel({ animals }: AdoptedCarouselProps) {
  if (animals.length === 0) return null;

  // Duplicate the list so the CSS animation can loop seamlessly from -0% to -50%.
  const loopAnimals = [...animals, ...animals];

  return (
    <div className={styles.carouselWrapper}>
      <span className={styles.carouselLabel}>Recently adopted</span>
      <div className={styles.carouselTrack}>
        <div className={styles.carouselTrackInner}>
          {loopAnimals.map((animal, idx) => (
            <div className={styles.carouselItem} key={`${animal.id}-${idx}`}>
              <img src={animal.animalPhoto} alt={animal.animalName} className={styles.carouselImage} />
              <span className={styles.carouselName}>{animal.animalName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}