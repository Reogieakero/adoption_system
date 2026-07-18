"use client";

import React, { useState } from 'react';
import { Conversation, Message } from '@/types';
import { MOCK_CONVERSATIONS } from '@/lib/mock-data/messages';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import styles from './page.module.css';

export default function SaaSMessageWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvoId, setActiveConvoId] = useState<string>('c1');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');

  const activeConvo = conversations.find(c => c.id === activeConvoId) || conversations[0];

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg: Message = {
      id: `m_new_${Date.now()}`,
      sender: 'admin',
      text: typedMessage,
      time: 'Just now',
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvoId) {
        return {
          ...c,
          lastMessage: typedMessage,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setTypedMessage('');
  };

  const selectConversation = (id: string) => {
    setActiveConvoId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isUnread: false } : c));
  };

  return (
    <div className={styles.container}>
      <Sidebar
        conversations={conversations}
        activeConvoId={activeConvoId}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSelectConversation={selectConversation}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
      />

      <ChatWindow
        conversation={activeConvo}
        typedMessage={typedMessage}
        onTypedMessageChange={setTypedMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

