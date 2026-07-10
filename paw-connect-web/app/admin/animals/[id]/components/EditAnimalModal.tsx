'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import modalStyles from './Modal.module.css';
import styles from './FormControls.module.css';
import type { AnimalCardData } from '../../components/AnimalCard';

interface EditAnimalModalProps {
  open: boolean;
  animal: AnimalCardData;
  onClose: () => void;
  onSave: (updated: AnimalCardData) => void | Promise<void>;
}

const SEX_OPTIONS = ['Male', 'Female', 'Unknown'];
const HEALTH_OPTIONS = ['Healthy', 'Recovering', 'Under Treatment', 'Critical'];
const ADOPTION_OPTIONS = ['Available', 'Pending', 'Adopted'];

function Chevron() {
  return (
    <svg
      className={styles.selectChevron}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.5 5.25L7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EditAnimalModal({ open, animal, onClose, onSave }: EditAnimalModalProps) {
  const [form, setForm] = useState<AnimalCardData>(animal);
  const [wasOpen, setWasOpen] = useState(open);
  const [isSaving, setIsSaving] = useState(false);

  // Reset the form whenever the modal transitions from closed to open.
  // Adjusting state during render (rather than in a useEffect) avoids an
  // extra render pass and the set-state-in-effect lint warning.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(animal);
    }
  }

  const update = <K extends keyof AnimalCardData>(key: K, value: AnimalCardData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit animal record"
      description={`Update details for ${animal.name} (${animal.id}).`}
      footer={
        <>
          <button type="button" className={modalStyles.btn} onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button type="button" className={modalStyles.btnPrimary} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.photoPreviewRow}>
          <img
            src={form.photo || undefined}
            alt=""
            className={styles.photoPreview}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
          <div className={styles.field} style={{ marginBottom: 0, flex: 1 }}>
            <label className={styles.label} htmlFor="animal-photo">
              Photo URL
            </label>
            <input
              id="animal-photo"
              className={styles.input}
              type="text"
              value={form.photo}
              onChange={(e) => update('photo', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-name">
              Name
            </label>
            <input
              id="animal-name"
              className={styles.input}
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-species">
              Species
            </label>
            <input
              id="animal-species"
              className={styles.input}
              type="text"
              value={form.species}
              onChange={(e) => update('species', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-breed">
              Breed
            </label>
            <input
              id="animal-breed"
              className={styles.input}
              type="text"
              value={form.breed}
              onChange={(e) => update('breed', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-age">
              Age
            </label>
            <input
              id="animal-age"
              className={styles.input}
              type="text"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="e.g. 2 years"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-sex">
              Sex
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="animal-sex"
                className={styles.select}
                value={form.sex}
                onChange={(e) => update('sex', e.target.value)}
              >
                {SEX_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="animal-health">
              Health status
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="animal-health"
                className={styles.select}
                value={form.healthStatus}
                onChange={(e) => update('healthStatus', e.target.value)}
              >
                {HEALTH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="animal-adoption">
            Adoption status
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="animal-adoption"
              className={styles.select}
              value={form.adoptionStatus}
              onChange={(e) => update('adoptionStatus', e.target.value)}
            >
              {ADOPTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        <div className={styles.field} style={{ marginBottom: 0 }}>
          <label className={styles.label} htmlFor="animal-bio">
            Bio
          </label>
          <textarea
            id="animal-bio"
            className={styles.textarea}
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Short description for adoption listings..."
          />
        </div>
      </form>
    </Modal>
  );
}