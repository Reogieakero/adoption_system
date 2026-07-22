import React from 'react';
import type { Conversation } from '@/types';
import ChatHeader from './ChatHeader';
import MessageStream from './MessageStream';
import InputBar from './InputBar';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  conversation: Conversation;
  typedMessage: string;
  onTypedMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onViewProfile?: () => void;
}

export default function ChatWindow({
  conversation,
  typedMessage,
  onTypedMessageChange,
  onSendMessage,
  onViewProfile,
}: ChatWindowProps) {
  return (
    <main className={styles.chatWindow}>
      <ChatHeader conversation={conversation} onViewProfile={onViewProfile} />
      <MessageStream messages={conversation.messages} />
      <InputBar value={typedMessage} onChange={onTypedMessageChange} onSend={onSendMessage} />
    </main>
  );
}

