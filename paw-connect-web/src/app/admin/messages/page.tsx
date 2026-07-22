"use client";

import React, { useState, useEffect } from 'react';
import { Conversation, Message } from '@/types';
import { createServiceClient } from '@/lib/api-client';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import styles from './page.module.css';

const ADMIN_SENDER_ID = 1;

export default function SaaSMessageWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvoId, setActiveConvoId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');

  useEffect(() => {
    async function fetchConversations() {
      try {
        const { request } = createServiceClient('/api/admin/messages');
        const threadsRes = await request<{ success: boolean; threads: any[] }>('');
        const threads = threadsRes.threads;

        const convos = await Promise.all(
          threads.map(async (thread) => {
            const msgRes = await request<{ success: boolean; messages: Message[] }>(`/${thread.thread_id}/messages`);
            return {
              thread_id: thread.thread_id,
              linked_type: thread.linked_type,
              linked_id: thread.linked_id,
              resident_id: thread.resident_id,
              resident_name: thread.resident_name,
              created_at: thread.created_at,
              messages: msgRes.messages,
            } satisfies Conversation;
          })
        );

        setConversations(convos);
        if (convos.length > 0) {
          setActiveConvoId(convos[0].thread_id);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const activeConvo = conversations.find(c => c.thread_id === activeConvoId) || conversations[0];

  if (loading) {
    return <div className={styles.container}>Loading conversations...</div>;
  }

  if (!activeConvo) {
    return <div className={styles.container}>No conversations found.</div>;
  }

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const lastMsgId = activeConvo.messages.length > 0
      ? Math.max(...activeConvo.messages.map(m => m.message_id))
      : 0;

    const newMsg: Message = {
      message_id: lastMsgId + 1,
      thread_id: activeConvo.thread_id,
      sender_id: ADMIN_SENDER_ID,
      sender_name: 'Admin',
      message_text: typedMessage,
      photo_url: null,
      is_read: false,
      sent_at: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => {
      if (c.thread_id === activeConvoId) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setTypedMessage('');
  };

  const selectConversation = (id: number) => {
    setActiveConvoId(id);
    setConversations(prev => prev.map(c =>
      c.thread_id === id
        ? { ...c, messages: c.messages.map(m => ({ ...m, is_read: true })) }
        : c
    ));
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
        onViewProfile={() => alert(`View profile for ${activeConvo.resident_name}`)}
      />
    </div>
  );
}
