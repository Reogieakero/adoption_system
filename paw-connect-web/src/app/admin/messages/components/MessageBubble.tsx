import React from 'react';
import { CheckCheck, Check } from 'lucide-react';
import type { Message } from '@/types';
const ADMIN_SENDER_ID = 1;
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender_id === ADMIN_SENDER_ID;

  return (
    <div className={`${styles.msgRow} ${isAdmin ? styles.msgAdmin : styles.msgIncoming}`}>
      <div className={`${styles.bubble} ${isAdmin ? styles.bubbleAdmin : styles.bubbleIncoming}`}>
        {message.message_text}

        {message.photo_url && (
          <div className={styles.attachmentPreview}>
            <img src={message.photo_url} alt="Attachment payload" className={styles.attachmentImage} />
          </div>
        )}
      </div>

      <div className={`${styles.msgMeta} ${isAdmin ? styles.msgMetaAdmin : ''}`}>
        <span>{formatTime(message.sent_at)}</span>
        {isAdmin && (
          <span>
            {message.is_read ? <CheckCheck size={10} className={styles.readIcon} /> : <Check size={10} />}
          </span>
        )}
      </div>
    </div>
  );
}
