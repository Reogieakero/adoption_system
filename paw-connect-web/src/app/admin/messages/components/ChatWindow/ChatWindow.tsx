import React from 'react';
import { Conversation } from '../../types';
import ChatHeader from './ChatHeader';
import MessageStream from './MessageStream';
import InputBar from './InputBar';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  conversation: Conversation;
  typedMessage: string;
  onTypedMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function ChatWindow({
  conversation,
  typedMessage,
  onTypedMessageChange,
  onSendMessage
}: ChatWindowProps) {
  return (
    <main className={styles.chatWindow}>
      <ChatHeader conversation={conversation} />
      <MessageStream messages={conversation.messages} />
      <InputBar value={typedMessage} onChange={onTypedMessageChange} onSend={onSendMessage} />
    </main>
  );
}

