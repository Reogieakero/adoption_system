"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '@/types';
import { fetchConversations, fetchMessages, sendChatMessage, markChatRead } from '@/services/chat.api';
import { ChatConversation, ChatMessage } from '@/types/chat';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import styles from './page.module.css';

function decodeUserId(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
}

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('adminAuthToken');
}

function chatMsgToMsg(m: ChatMessage, threadId: number): Message {
  return {
    message_id: m.message_id,
    thread_id: threadId,
    sender_id: m.sender_id,
    sender_name: m.sender_name,
    message_text: m.message_text,
    photo_url: m.photo_url,
    is_read: m.is_read,
    sent_at: m.sent_at,
  };
}

export default function AdminMessagesPage() {
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [messagesByConv, setMessagesByConv] = useState<Record<number, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeConvoId, setActiveConvoId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');

  const adminId = getAdminToken() ? decodeUserId(getAdminToken()!) : null;

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const convs = await fetchConversations();
      setChatConversations(convs);

      const msgsMap: Record<number, Message[]> = {};
      await Promise.all(
        convs.map(async (c) => {
          try {
            const msgs = await fetchMessages(c.conversation_id);
            msgsMap[c.conversation_id] = msgs.map((m) => chatMsgToMsg(m, c.conversation_id));
          } catch {
            msgsMap[c.conversation_id] = [];
          }
        })
      );
      setMessagesByConv(msgsMap);

      if (convs.length > 0 && !activeConvoId) {
        setActiveConvoId(convs[0].conversation_id);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [activeConvoId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const activeConvo = chatConversations.find((c) => c.conversation_id === activeConvoId) || chatConversations[0];
  const activeMessages = activeConvo ? messagesByConv[activeConvo.conversation_id] || [] : [];

  const conversationForComponent: Conversation | null = activeConvo
    ? {
        thread_id: activeConvo.conversation_id,
        linked_type: 'adoption_application' as const,
        linked_id: 0,
        resident_id: activeConvo.participant_ids?.find((id: number) => id !== adminId) ?? 0,
        resident_name: activeConvo.other_user_name,
        messages: activeMessages,
        created_at: activeConvo.created_at,
      }
    : null;

  const sidebarConversations: Conversation[] = chatConversations.map((c) => ({
    thread_id: c.conversation_id,
    linked_type: 'adoption_application' as const,
    linked_id: 0,
    resident_id: c.participant_ids?.find((id: number) => id !== adminId) ?? 0,
    resident_name: c.other_user_name,
    messages: messagesByConv[c.conversation_id] || [],
    created_at: c.created_at,
  }));

  const selectConversation = (id: number) => {
    setActiveConvoId(id);
    markChatRead(id).catch(() => {});
    setChatConversations((prev) =>
      prev.map((c) => (c.conversation_id === id ? { ...c, unread_count: 0 } : c))
    );
  };

  const handleSendMessage = async () => {
    if (!typedMessage.trim() || !activeConvo || !adminId) return;
    const recipientId = activeConvo.participant_ids?.find((id: number) => id !== adminId);
    if (!recipientId) return;

    const optimistic: Message = {
      message_id: -Date.now(),
      thread_id: activeConvo.conversation_id,
      sender_id: adminId,
      sender_name: 'You',
      message_text: typedMessage,
      photo_url: null,
      is_read: false,
      sent_at: new Date().toISOString(),
    };

    setMessagesByConv((prev) => ({
      ...prev,
      [activeConvo.conversation_id]: [...(prev[activeConvo.conversation_id] || []), optimistic],
    }));
    setTypedMessage('');

    try {
      const sent = await sendChatMessage(activeConvo.conversation_id, typedMessage, recipientId);
      setMessagesByConv((prev) => ({
        ...prev,
        [activeConvo.conversation_id]: (prev[activeConvo.conversation_id] || []).map((m) =>
          m.message_id === optimistic.message_id
            ? { ...m, message_id: sent.message_id, sent_at: sent.sent_at }
            : m
        ),
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessagesByConv((prev) => ({
        ...prev,
        [activeConvo.conversation_id]: (prev[activeConvo.conversation_id] || []).filter(
          (m) => m.message_id !== optimistic.message_id
        ),
      }));
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading conversations...</div>;
  }

  if (!conversationForComponent) {
    return <div className={styles.container}>No conversations found.</div>;
  }

  return (
    <div className={styles.container}>
      <Sidebar
        conversations={sidebarConversations}
        activeConvoId={activeConvoId}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSelectConversation={selectConversation}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
      />
      <ChatWindow
        conversation={conversationForComponent}
        typedMessage={typedMessage}
        onTypedMessageChange={setTypedMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
