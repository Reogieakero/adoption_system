'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import FloatingChat from '@/components/chat/FloatingChat';
import styles from './ChatWithAdmin.module.css';

export default function ChatWithAdmin() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started && (
        <Button
          variant="gradient"
          className={styles.fab}
          onClick={() => setStarted(true)}
        >
          <MessageCircle size={20} />
          Chat with Admin
        </Button>
      )}
      {started && <FloatingChat role="resident" autoOpen onClose={() => setStarted(false)} />}
    </>
  );
}
