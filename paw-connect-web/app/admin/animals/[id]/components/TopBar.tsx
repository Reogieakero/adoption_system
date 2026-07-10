'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './TopBar.module.css';
import EditAnimalModal from './EditAnimalModal';
import DeleteAnimalModal from './DeleteAnimalModal';
import type { AnimalCardData } from '../../components/AnimalCard';

interface TopBarProps {
  /** Where the back link should navigate to. */
  backHref: string;
  /** Optional label override for the back link. */
  backLabel?: string;
  /** The animal shown on this detail page — powers the edit/delete modals. */
  animal: AnimalCardData;
  onArchive?: () => void;
}

export default function TopBar({
  backHref,
  backLabel = 'Back to Animals Module',
  animal,
  onArchive,
}: TopBarProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (updated: AnimalCardData) => {
    // TODO: replace with your real persistence call, e.g.:
    // await fetch(`/api/animals/${updated.id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(updated),
    // });
    router.refresh(); // re-fetch the server-rendered animal data on this page
  };

  const handleDelete = async (id: string) => {
    // TODO: replace with your real persistence call, e.g.:
    // await fetch(`/api/animals/${id}`, { method: 'DELETE' });
    router.push(backHref);
  };

  return (
    <div className={styles.topBar}>
      <Link href={backHref} className={styles.backLink}>
        &larr; {backLabel}
      </Link>
      <div className={styles.actionsBar}>
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