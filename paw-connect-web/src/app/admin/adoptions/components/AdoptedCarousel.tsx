'use client';

import React, { useState, useCallback } from 'react';
import { Dog, Cat } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import type { AdoptionApplication } from '@/types';
import styles from './AdoptedCarousel.module.css';

interface AdoptedCarouselProps {
  animals: AdoptionApplication[];
}

function CarouselItem({ animal }: { animal: AdoptionApplication }) {
  const [imgFailed, setImgFailed] = useState(false);
  const onError = useCallback(() => setImgFailed(true), []);
  const firstPhoto = animal.pet_photo_url?.split(',')[0]?.trim();
  const imgSrc = firstPhoto ? `${API_BASE_URL}${firstPhoto}` : null;
  const showImg = imgSrc && !imgFailed;
  const Icon = animal.pet_species === 'cat' ? Cat : Dog;

  return (
    <div className={styles.carouselItem}>
      {showImg ? (
        <img src={imgSrc!} alt={animal.pet_name} className={styles.carouselImage} onError={onError} />
      ) : (
        <div className={styles.carouselIconFallback}>
          <Icon size={22} />
        </div>
      )}
      <span className={styles.carouselName}>{animal.pet_name}</span>
    </div>
  );
}

export function AdoptedCarousel({ animals }: AdoptedCarouselProps) {
  if (animals.length === 0) return null;

  const loopAnimals = [...animals, ...animals];

  return (
    <div className={styles.carouselWrapper}>
      <span className={styles.carouselLabel}>Recently adopted</span>
      <div className={styles.carouselTrack}>
        <div className={styles.carouselTrackInner}>
          {loopAnimals.map((animal, idx) => (
            <CarouselItem key={`${animal.application_id}-${idx}`} animal={animal} />
          ))}
        </div>
      </div>
    </div>
  );
}
