import React from 'react';
import styles from './LocationMapPanel.module.css';

interface LocationMapPanelProps {
  coords: { lat: number; lon: number };
}

export default function LocationMapPanel({ coords }: LocationMapPanelProps) {
  const bbox = [
    coords.lon - 0.01,
    coords.lat - 0.01,
    coords.lon + 0.01,
    coords.lat + 0.01
  ].join('%2C');

  return (
    <div className={styles.modalRightColumn}>
      <div className={styles.mapCanvasFrame}>
        <iframe
          title="Modern OpenStreetMap Location View"
          width="100%"
          height="100%"
          className={styles.mapFrame}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`}
        />
      </div>
    </div>
  );
}

