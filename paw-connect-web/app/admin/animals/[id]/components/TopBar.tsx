'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './TopBar.module.css';
import EditAnimalModal from './EditAnimalModal';
import DeleteAnimalModal from './DeleteAnimalModal';
import { deleteAnimal, updateAnimal, type UpdateAnimalPayload } from '../../../../lib/api/animals.api';
import type { AnimalCardData } from '../../components/AnimalCard';

type EditableAnimal = AnimalCardData &
  Partial<{
    size: string;
    colorMarkings: string;
    rescueStatus: string;
    vaccinationStatus: string;
    heartRate: string;
    shelterLocation: string;
    location: string;
    dateRescued: string;
    dateAdded: string;
    lastUpdated: string;
    reporterName: string;
  }>;

interface TopBarProps {
  backHref: string;
  backLabel?: string;
  animal: AnimalCardData;
  onArchive?: () => void;
  onUpdated?: () => void | Promise<void>;
}

function toUpdatePayload(form: EditableAnimal): UpdateAnimalPayload {
  return {
    name: form.name,
    species: form.species as UpdateAnimalPayload['species'],
    breed: form.breed,
    sex: form.sex as UpdateAnimalPayload['sex'],
    age: form.age,
    size: form.size as UpdateAnimalPayload['size'],
    colorMarkings: form.colorMarkings,
    rescueStatus: form.rescueStatus as UpdateAnimalPayload['rescueStatus'],
    adoptionStatus: form.adoptionStatus as UpdateAnimalPayload['adoptionStatus'],
    healthStatus: form.healthStatus as UpdateAnimalPayload['healthStatus'],
    vaccinationStatus: form.vaccinationStatus as UpdateAnimalPayload['vaccinationStatus'],
    heartRate: form.heartRate,
    location: form.shelterLocation ?? form.location,
    dateRescued: form.dateRescued,
    dateAdded: form.dateAdded,
    bio: form.bio,
    photo: form.photo,
  };
}

export default function TopBar({
  backHref,
  backLabel = 'Back to Animals Module',
  animal,
  onArchive,
  onUpdated,
}: TopBarProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

  const handleSave = async (updated: EditableAnimal) => {
    setActionError('');
    try {
      await updateAnimal(updated.id, toUpdatePayload(updated));
      await onUpdated?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save changes');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await deleteAnimal(id);
      router.push(backHref);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete record');
      throw err;
    }
  };

  return (
    <div className={styles.topBar}>
      <Link href={backHref} className={styles.backLink}>
        &larr; {backLabel}
      </Link>
      <div className={styles.actionsBar}>
        {actionError && (
          <span className={styles.actionError} role="alert">
            {actionError}
          </span>
        )}
        <button className={styles.actionBtn} onClick={onArchive}>
          Archive
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={() => setIsEditOpen(true)}
        >
          Edit Record
        </button>
      </div>

      <EditAnimalModal
        open={isEditOpen}
        animal={animal}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />

      <DeleteAnimalModal
        open={isDeleteOpen}
        animal={animal}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDelete(animal.id)}
      />
    </div>
  );
}