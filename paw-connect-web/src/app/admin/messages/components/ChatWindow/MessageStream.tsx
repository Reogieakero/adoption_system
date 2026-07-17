import React from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';
import styles from './MessageStream.module.css';

interface MessageStreamProps {
  messages: Message[];
}

export default function MessageStream({ messages }: MessageStreamProps) {
  return (
    <div className={styles.scrollArea}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}

