'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/ui/button';
import styles from './Modal.module.css';
import type { Pet } from '@/types';

interface DeleteAnimalModalProps {
  open: boolean;
  animal: Pick<Pet, 'name' | 'pet_id'>;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteAnimalModal({ open, animal, onClose, onConfirm }: DeleteAnimalModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Delete ${animal.name}?`}
      description={`This permanently removes ${animal.name} (${animal.pet_id}). This can't be undone.`}
      footer={
        <>
          <Button variant="admin-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="admin-primary" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete record'}
          </Button>
        </>
      }
    >
      <p className={styles.warningText}>
        Deleting removes {animal.name} from adoption listings, health logs, and reporting immediately.
      </p>
    </Modal>
  );
}