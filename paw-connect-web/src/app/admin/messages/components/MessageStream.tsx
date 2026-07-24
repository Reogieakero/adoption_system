import React, { useEffect, useRef } from 'react';
import type { Message } from '@/types';
import MessageBubble from './MessageBubble';
import styles from './MessageStream.module.css';

interface MessageStreamProps {
  messages: Message[];
}

export default function MessageStream({ messages }: MessageStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.scrollArea} ref={scrollRef}>
      {messages.map((msg) => (
        <MessageBubble key={msg.message_id} message={msg} />
      ))}
    </div>
  );
}
