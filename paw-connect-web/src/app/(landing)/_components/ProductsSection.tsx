'use client';

import Image from 'next/image';
import styles from './ProductsSection.module.css';
import Reveal from './Reveal';

const adoptedPets = [
  {
    name: 'Milo',
    type: 'Cat',
    age: '2 yrs',
    location: 'Westchester',
    adoptionDate: 'Jun 14, 2026',
    foundLocation: 'Found as a stray behind a Westchester diner',
    details: 'Shy at first, now loves sunny windowsills and chasing string toys.',
    adopterName: 'The Rivera family',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=520&q=80',
  },
  {
    name: 'Daisy',
    type: 'Dog',
    age: '1 yr',
    location: 'Brooklyn',
    adoptionDate: 'Jun 21, 2026',
    foundLocation: 'Surrendered by a shelter in Prospect Park',
    details: 'High energy and great with kids â€” needs a big yard to zoom around in.',
    adopterName: 'Jordan P.',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=520&q=80',
  },
  {
    name: 'Nala',
    type: 'Cat',
    age: '3 yrs',
    location: 'Queens',
    adoptionDate: 'May 30, 2026',
    foundLocation: 'Rescued from a construction site in Astoria',
    details: 'Quiet and affectionate, prefers a calm one-cat household.',
    adopterName: '',
    image: 'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&w=520&q=80',
  },
  {
    name: 'Buddy',
    type: 'Dog',
    age: '4 yrs',
    location: 'Manhattan',
    adoptionDate: 'Jun 02, 2026',
    foundLocation: 'Owner surrender, previously a family pet upstate',
    details: 'Well-trained senior gentleman who just wants a couch and a walk.',
    adopterName: 'The Chen-Ortiz household',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=520&q=80',
  },
  {
    name: 'Cleo',
    type: 'Cat',
    age: '18 mo',
    location: 'Bronx',
    adoptionDate: 'Jun 27, 2026',
    foundLocation: 'Found in a Bronx apartment building basement',
    details: 'Playful and curious, does best with another cat for company.',
    adopterName: '',
    image: 'https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=520&q=80',
  },
  {
    name: 'Oscar',
    type: 'Dog',
    age: '2 yrs',
    location: 'Staten Island',
    adoptionDate: 'Jul 03, 2026',
    foundLocation: 'Found wandering near the Staten Island ferry terminal',
    details: 'Friendly with everyone he meets, loves water and long walks.',
    adopterName: 'Sam T.',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=520&q=80',
  },
];

function AdoptedBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l2.02 1.47 2.5-.2 1.02 2.3 2.3 1.02-.2 2.5L21.1 12l-1.47 2.02.2 2.5-2.3 1.02-1.02 2.3-2.5-.2L12 21.1l-2.02-1.47-2.5.2-1.02-2.3-2.3-1.02.2-2.5L2.9 12l1.47-2.02-.2-2.5 2.3-1.02 1.02-2.3 2.5.2L12 2.5z"
        fill="var(--ocean)"
      />
      <path
        d="M8.5 12.2l2.2 2.2 4.8-4.8"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21.5s7-6.6 7-12A7 7 0 1 0 5 9.5c0 5.4 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function ProductsSection() {
  return (
    <section id="products" className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.productsHeadRow}>
          <Reveal>
            <span className={styles.sectionEyebrow}>Latest adoptions</span>
            <h2 className={styles.sectionTitle}>Newest cats and dogs finding loving homes</h2>
          </Reveal>
        </div>
      </div>

      <div className={styles.carouselViewport}>
        <div className={styles.loopTrack} aria-hidden="true">
          {[...adoptedPets, ...adoptedPets].map((pet, index) => (
            <div key={`${pet.name}-${index}`} className={styles.petCard} aria-hidden={index >= adoptedPets.length}>
              <div className={styles.petThumb}>
                <Image src={pet.image} alt={`${pet.name} the ${pet.type}`} fill />
                <div className={styles.adoptionBadge}>
                  <AdoptedBadgeIcon />
                  <span className={styles.adoptionBadgeText}>{pet.adoptionDate}</span>
                </div>
                <div className={styles.petThumbOverlay}>
                  <span className={styles.petNameOnImage}>{pet.name}</span>
                </div>

                {/* Hover detail overlay */}
                <div className={styles.petHoverOverlay}>
                  <div className={styles.hoverOverlayTop}>
                    <span className={styles.hoverPetName}>{pet.name}</span>
                    <span className={styles.hoverPetMeta}>
                      {pet.type} â€¢ {pet.age}
                    </span>
                  </div>

                  <div className={styles.hoverFoundRow}>
                    <PinIcon />
                    <span>{pet.foundLocation}</span>
                  </div>

                  <p className={styles.hoverDetails}>{pet.details}</p>

                  {pet.adopterName ? (
                    <div className={styles.hoverAdopter}>
                      <span className={styles.hoverAdopterLabel}>Adopted by</span>
                      <span className={styles.hoverAdopterName}>{pet.adopterName}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={styles.petInfo}>
                <div className={styles.petMeta}>
                  {pet.type} â€¢ {pet.age} â€¢ {pet.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
