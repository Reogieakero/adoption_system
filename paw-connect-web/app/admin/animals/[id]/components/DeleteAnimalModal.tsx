'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import type { AnimalCardData } from '../../components/AnimalCard';

interface DeleteAnimalModalProps {
  open: boolean;
  animal: Pick<AnimalCardData, 'name' | 'id'>;
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
      description={`This permanently removes ${animal.name} (${animal.id}). This can't be undone.`}
      footer={
        <>
          <button type="button" className={styles.btn} onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" className={styles.btnDanger} onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete record'}
          </button>
        </>
      }
    >
      <p className={styles.warningText}>
        Deleting removes {animal.name} from adoption listings, health logs, and reporting immediately.
      </p>
    </Modal>
  );
}