"use client";

import React, { useState } from 'react';
import styles from './AnimalsPage.module.css';

const MOCK_ANIMALS = [
  {
    id: "ANM-2026-001",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    sex: "Male",
    age: "2 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-002",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    sex: "Female",
    age: "6 months",
    healthStatus: "Under Treatment",
    adoptionStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-003",
    name: "Rocky",
    species: "Dog",
    breed: "German Shepherd",
    sex: "Male",
    age: "4 years",
    healthStatus: "Monitoring",
    adoptionStatus: "Unavailable",
    photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-004",
    name: "Bella",
    species: "Dog",
    breed: "Poodle",
    sex: "Female",
    age: "1 year",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-005",
    name: "Oliver",
    species: "Cat",
    breed: "Maine Coon",
    sex: "Male",
    age: "3 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-006",
    name: "Daisy",
    species: "Dog",
    breed: "Beagle",
    sex: "Female",
    age: "5 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-007",
    name: "Milo",
    species: "Cat",
    breed: "Bengal",
    sex: "Male",
    age: "2 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1513360309081-36f5e878f210?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-008",
    name: "Coco",
    species: "Dog",
    breed: "Labrador",
    sex: "Female",
    age: "3 years",
    healthStatus: "Healthy",
    adoptionStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1537151625747-7ae87041895a?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-009",
    name: "Simba",
    species: "Cat",
    breed: "Persian",
    sex: "Male",
    age: "4 years",
    healthStatus: "Treatment",
    adoptionStatus: "Unavailable",
    photo: "https://images.unsplash.com/photo-1614273147774-411b1ef56306?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-010",
    name: "Charlie",
    species: "Dog",
    breed: "Boxer",
    sex: "Male",
    age: "1.5 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-011",
    name: "Nala",
    species: "Cat",
    breed: "Ragdoll",
    sex: "Female",
    age: "1 year",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1574158622643-69d34d72650a?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-012",
    name: "Lucy",
    species: "Dog",
    breed: "Dachshund",
    sex: "Female",
    age: "2 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1529429617329-8468a9776562?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-013",
    name: "Leo",
    species: "Cat",
    breed: "Sphynx",
    sex: "Male",
    age: "3 years",
    healthStatus: "Monitoring",
    adoptionStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1520315342629-6ea920342047?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-014",
    name: "Cooper",
    species: "Dog",
    breed: "Bulldog",
    sex: "Male",
    age: "4 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-015",
    name: "Zoe",
    species: "Cat",
    breed: "British Shorthair",
    sex: "Female",
    age: "2 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-016",
    name: "Teddy",
    species: "Dog",
    breed: "Shih Tzu",
    sex: "Male",
    age: "8 months",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-017",
    name: "Mia",
    species: "Cat",
    breed: "Abyssinian",
    sex: "Female",
    age: "3 years",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    photo: "https://images.unsplash.com/photo-1536590158209-e9d615d525e4?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "ANM-2026-018",
    name: "Duke",
    species: "Dog",
    breed: "Rottweiler",
    sex: "Male",
    age: "5 years",
    healthStatus: "Healthy",
    adoptionStatus: "Unavailable",
    photo: "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=400&auto=format&fit=crop"
  }
];

export default function AnimalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");

  return (
    <div className={styles.outerShell}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Animals Module</h1>
            <p className={styles.pageSubtitle}>Manage, monitor, and update rescue and adoption records.</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Animals</span>
            <span className={styles.statValue}>148</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Available</span>
            <span className={styles.statValue} style={{ color: '#0d9488' }}>64</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Under Rescue</span>
            <span className={styles.statValue} style={{ color: '#ea580c' }}>18</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Under Treatment</span>
            <span className={styles.statValue} style={{ color: '#dc2626' }}>12</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Adopted</span>
            <span className={styles.statValue} style={{ color: '#2563eb' }}>54</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Archived</span>
            <span className={styles.statValue} style={{ color: '#64748b' }}>8</span>
          </div>
        </div>

        <div className={styles.toolbarCard}>
          <div className={styles.leftControls}>
            <div className={styles.supabaseSearchWrapper}>
              <div className={styles.searchIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search docs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.supabaseSearchInput} 
              />
              <div className={styles.cmdKShortcut}>⌘K</div>
            </div>
          </div>
          <div className={styles.rightControls}>
            <select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} className={styles.selectFilter}>
              <option value="All">All Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
            <button className={styles.addBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Animal
            </button>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {MOCK_ANIMALS.map((animal) => (
            <div key={animal.id} className={styles.animalCard}>
              <div className={styles.imageWrapper}>
                <img src={animal.photo} alt={animal.name} className={styles.cardPhoto} />
                <div className={styles.overlayInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardName}>{animal.name}</h3>
                    <span className={styles.cardSpecies}>{animal.species}</span>
                  </div>
                  <div className={styles.cardId}>{animal.id}</div>
                  
                  <div className={styles.hoverContent}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Breed:</span>
                      <span className={styles.detailValue}>{animal.breed}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Age/Sex:</span>
                      <span className={styles.detailValue}>{animal.age} / {animal.sex}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Health:</span>
                      <span className={styles.detailValue}>{animal.healthStatus}</span>
                    </div>
                  </div>

                  <div className={styles.cardBadge}>
                    <span className={`${styles.badge} ${
                      animal.adoptionStatus === 'Available' ? styles.bgTeal : 
                      animal.adoptionStatus === 'Pending' ? styles.bgOrange : styles.bgPrimary
                    }`}>
                      {animal.adoptionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerSection}>
          <div className={styles.toolbarCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Cards per page:</span>
                <select className={styles.selectFilter} style={{ padding: '0 1.5rem 0 0.5rem', height: '32px' }}>
                  <option>18</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>1-18 of 148</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button disabled style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '4px', cursor: 'not-allowed', opacity: 0.4 }}>&larr;</button>
                  <button style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid #cbd5e1', background: '#f1f5f9', borderRadius: '4px', color: '#0f172a', fontWeight: 500 }}>1</button>
                  <button style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '4px', cursor: 'pointer' }}>&rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}