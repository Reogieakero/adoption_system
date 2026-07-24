'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatConversation, ChatMessage } from '@/types/chat';
import {
  fetchConversations,
  fetchMessages,
  sendChatMessage,
  findOrCreateConversation,
  markChatRead,
} from '@/services/chat.api';

interface UseChatResult {
  conversations: ChatConversation[];
  activeConvId: number | null;
  messages: ChatMessage[];
  unreadTotal: number;
  isLoading: boolean;
  isOpen: boolean;
  currentUserId: number | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectConversation: (id: number) => void;
  sendMessage: (text: string, photoFile?: File) => Promise<void>;
  startConversation: (recipientId: number, recipientName: string) => Promise<void>;
  refetchConversations: () => Promise<void>;
}

function decodeUserId(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
}

export function useChat(): UseChatResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const currentUserIdRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const hasAdminToken = !!sessionStorage.getItem('adminAuthToken');
    const hasResidentToken = !!sessionStorage.getItem('authToken') || !!localStorage.getItem('authToken');
    if (hasAdminToken && !hasResidentToken) return sessionStorage.getItem('adminAuthToken');
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const convs = await fetchConversations();
      convs.sort((a, b) => {
        const aTime = a.last_message_at || a.created_at;
        const bTime = b.last_message_at || b.created_at;
        return new Date(aTime).getTime() - new Date(bTime).getTime();
      });
      setConversations(convs);
      const total = convs.reduce((sum, c) => sum + c.unread_count, 0);
      setUnreadTotal(total);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decodedId = decodeUserId(token);
    setCurrentUserId(decodedId);
    currentUserIdRef.current = decodedId;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      loadConversations();
    });

    socket.on('chat:new-message', (msg: ChatMessage) => {
      if (msg.sender_id === currentUserIdRef.current) return;
      setMessages((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].conversation_id !== msg.conversation_id) {
          return prev;
        }
        if (prev.some((m) => m.message_id === msg.message_id)) return prev;
        return [...prev, msg];
      });
      setConversations((prev) => {
        const exists = prev.some((c) => c.conversation_id === msg.conversation_id);
        if (!exists) {
          loadConversations();
          return prev;
        }
        const updated = prev.map((c) => {
          if (c.conversation_id !== msg.conversation_id) return c;
          return {
            ...c,
            last_message: {
              message_id: msg.message_id,
              message_text: msg.message_text,
              sender_id: msg.sender_id,
              sent_at: msg.sent_at,
            },
            last_message_at: msg.sent_at,
            unread_count: msg.sender_id !== currentUserIdRef.current ? c.unread_count + 1 : 0,
          };
        });
        const total = updated.reduce((sum, c) => sum + c.unread_count, 0);
        setUnreadTotal(total);
        return updated.sort((a, b) => {
          const aTime = a.last_message_at || a.created_at;
          const bTime = b.last_message_at || b.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [getToken, loadConversations]);

  const selectConversation = useCallback(async (id: number) => {
    setActiveConvId(id);
    if (id === 0) return;
    setIsLoading(true);
    try {
      const msgs = await fetchMessages(id);
      setMessages(msgs);
      await markChatRead(id);
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.conversation_id === id ? { ...c, unread_count: 0 } : c
        );
        const total = updated.reduce((sum, c) => sum + c.unread_count, 0);
        setUnreadTotal(total);
        return updated;
      });
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string, photoFile?: File) => {
    if (!activeConvId || (!text.trim() && !photoFile)) return;
    const conv = conversations.find((c) => c.conversation_id === activeConvId);
    if (!conv) return;
    const uid = currentUserIdRef.current;
    const recipientId = conv.participant_ids.find((id) => id !== uid);
    if (!recipientId) return;
    const optimistic: ChatMessage = {
      message_id: -Date.now(),
      conversation_id: activeConvId,
      sender_id: uid ?? 0,
      sender_name: 'You',
      message_text: text,
      photo_url: photoFile ? URL.createObjectURL(photoFile) : null,
      is_read: false,
      sent_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const sent = await sendChatMessage(activeConvId, text, recipientId, photoFile);
      setMessages((prev) => prev.map((m) => m.message_id === optimistic.message_id ? { ...m, message_id: sent.message_id, photo_url: sent.photo_url } : m));
    } catch {
      setMessages((prev) => prev.filter((m) => m.message_id !== optimistic.message_id));
    }
  }, [activeConvId, conversations]);

  const startConversation = useCallback(async (recipientId: number, _recipientName: string) => {
    try {
      const { conversation_id } = await findOrCreateConversation(recipientId);
      await loadConversations();
      setActiveConvId(conversation_id);
      setIsOpen(true);
    } catch (err) {
      console.error('startConversation error:', err);
    }
  }, [loadConversations]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return {
    conversations,
    activeConvId,
    messages,
    unreadTotal,
    isLoading,
    isOpen,
    currentUserId,
    open,
    close,
    toggle,
    selectConversation,
    sendMessage,
    startConversation,
    refetchConversations: loadConversations,
  };
}