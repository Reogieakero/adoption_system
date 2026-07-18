'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Animal } from '@/types';
import styles from './Animal3DOverlay.module.css';

interface Animal3DOverlayProps {
  animal: Animal;
  onClose: () => void;
}

export default function Animal3DOverlay({ animal, onClose }: Animal3DOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
    document.body.appendChild(script);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.removeChild(script);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const hasModel = animal.model3dStatus === 'ready' && animal.model3dUrl;

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleBackdropClick}>
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.mediaArea}>
          {hasModel ? (
            <div className={styles.modelContainer}>
              <model-viewer
                src={animal.model3dUrl}
                alt={animal.name}
                auto-rotate="true"
                camera-controls="true"
                interaction-prompt="auto"
                loading="eager"
                className={styles.modelViewer}
              />
            </div>
          ) : (
            <div className={styles.photoFallback}>
              <img src={animal.photo} alt={animal.name} className={styles.photo} />
              <p className={styles.fallbackNote}>
                3D view not available for this pet yet
              </p>
            </div>
          )}
        </div>

        <div className={styles.infoArea}>
          <h2 className={styles.name}>{animal.name}</h2>
          <p className={styles.meta}>{animal.breed} &middot; {animal.age} &middot; {animal.sex}</p>
          <p className={styles.location}>{animal.location}</p>
          {animal.bio && <p className={styles.bio}>{animal.bio}</p>}
        </div>
      </div>
    </div>
  );
}
