'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import FloatingChat from '@/components/chat/FloatingChat';
import styles from './AdminChatWidget.module.css';

export default function AdminChatWidget() {
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
          Messages
        </Button>
      )}
      {started && <FloatingChat role="admin" autoOpen onClose={() => setStarted(false)} hideBubble />}
    </>
  );
}
