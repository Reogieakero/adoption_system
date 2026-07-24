'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import FloatingChat from '@/components/chat/FloatingChat';
import { fetchChatUnreadCount } from '@/services/chat.api';
import styles from './AdminChatWidget.module.css';

export default function AdminChatWidget() {
  const [started, setStarted] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const poll = async () => {
      try {
        const count = await fetchChatUnreadCount();
        setUnread(count);
      } catch {
        // ignore
      }
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, []);

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
          {unread > 0 && <span className={styles.badge}>{unread > 99 ? '99+' : unread}</span>}
        </Button>
      )}
      {started && <FloatingChat role="admin" autoOpen onClose={() => setStarted(false)} hideBubble />}
    </>
  );
}
