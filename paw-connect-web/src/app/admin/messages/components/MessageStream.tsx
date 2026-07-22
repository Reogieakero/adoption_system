import React from 'react';
import type { Message } from '@/types';
import MessageBubble from './MessageBubble';
import styles from './MessageStream.module.css';

interface MessageStreamProps {
  messages: Message[];
}

export default function MessageStream({ messages }: MessageStreamProps) {
  return (
    <div className={styles.scrollArea}>
      {messages.map((msg) => (
        <MessageBubble key={msg.message_id} message={msg} />
      ))}
    </div>
  );
}
