'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import styles from './TopBar.module.css';
import DeleteAnimalModal from './DeleteAnimalModal';
import { deleteAnimal } from '@/services/animals.api';
import type { AnimalCardData } from '../../components/AnimalCard';

interface TopBarProps {
  backHref: string;
  backLabel?: string;
  animal: AnimalCardData;
  onArchive?: () => void;
}

export default function TopBar({
  backHref,
  backLabel = 'Back to Animals Module',
  animal,
  onArchive,
}: TopBarProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

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
        <Button variant="admin-secondary" onClick={onArchive}>Archive</Button>
        <Button variant="admin-primary" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        <Link href={`/admin/animals/${animal.id}/edit`}>
          <Button variant="admin-primary">Edit Record</Button>
        </Link>
      </div>

      <DeleteAnimalModal
        open={isDeleteOpen}
        animal={animal}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDelete(animal.id)}
      />
    </div>
  );
}
