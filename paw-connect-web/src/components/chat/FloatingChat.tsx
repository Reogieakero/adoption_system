'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, X, Send, ChevronLeft, User, Image, Maximize2 } from 'lucide-react';
import { useChat } from '@/hooks/chat/use-chat';
import { fetchChatResidents, fetchChatAdmins } from '@/services/chat.api';
import styles from './FloatingChat.module.css';

interface FloatingChatProps {
  role?: 'admin' | 'resident';
  autoOpen?: boolean;
  onClose?: () => void;
  hideBubble?: boolean;
}

export default function FloatingChat({ role, autoOpen, onClose, hideBubble }: FloatingChatProps) {
  const {
    conversations,
    activeConvId,
    messages,
    unreadTotal,
    isLoading,
    isOpen,
    currentUserId,
    toggle,
    selectConversation,
    sendMessage,
    startConversation,
    refetchConversations,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [residents, setResidents] = useState<{ user_id: number; full_name: string }[]>([]);
  const [admins, setAdmins] = useState<{ user_id: number; full_name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const residentInitRef = useRef(false);
  const convRef = useRef(conversations);
  const adminsRef = useRef(admins);

  const router = useRouter();
  const isResident = role === 'resident';
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (activeConvId) {
      setView('chat');
    } else if (!isResident) {
      setView('list');
    }
  }, [activeConvId, isResident]);

  useEffect(() => {
    if (isOpen) {
      refetchConversations();
      if (isAdmin) {
        fetchChatResidents().then(setResidents).catch(() => {});
      } else if (isResident) {
        fetchChatAdmins().then(setAdmins).catch(() => {});
      }
    } else {
      residentInitRef.current = false;
    }
  }, [isOpen, refetchConversations, isAdmin, isResident]);

  // Scroll to bottom when switching views or loading content
  useEffect(() => {
    if (bodyRef.current) {
      requestAnimationFrame(() => {
        if (bodyRef.current) {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
      });
    }
  }, [view, conversations, messages]);

  const autoOpenDoneRef = useRef(false);

  // Auto-open when requested
  useEffect(() => {
    if (autoOpen && !autoOpenDoneRef.current) {
      autoOpenDoneRef.current = true;
      toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent when resident closes (skip initial false)
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Keep refs in sync for latest values in async callbacks
  convRef.current = conversations;
  adminsRef.current = admins;

  // Auto-init resident chat with admin
  useEffect(() => {
    if (!isOpen || !isResident || residentInitRef.current) return;
    if (adminsRef.current.length === 0 || convRef.current.length === 0) return;

    residentInitRef.current = true;

    const init = async () => {
      const list = adminsRef.current.length > 0 ? adminsRef.current : await fetchChatAdmins();
      const target = list.find((a) => a.user_id !== currentUserId) || list[0];
      if (!target || target.user_id === currentUserId) return;

      const existing = convRef.current.find(
        (c) => c.participant_ids?.includes(target.user_id)
      );
      if (existing) {
        selectConversation(existing.conversation_id);
      } else {
        await startConversation(target.user_id, target.full_name);
      }
    };
    init();
  }, [isOpen, isResident, admins, conversations, selectConversation, startConversation]);

  const activeConversation = conversations.find((c) => c.conversation_id === activeConvId);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedPhoto) return;
    await sendMessage(inputText, selectedPhoto || undefined);
    setInputText('');
    setSelectedPhoto(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    selectConversation(0);
    if (!isResident) setView('list');
  };

  return (
    <>
      {!hideBubble && !isResident && (
        <button className={styles.bubble} onClick={toggle} aria-label="Chat" data-admin={isAdmin || undefined}>
          <MessageCircle size={22} />
          {unreadTotal > 0 && (
            <span className={styles.badge}>{unreadTotal > 99 ? '99+' : unreadTotal}</span>
          )}
        </button>
      )}

      {isOpen && (
        <div className={styles.drawer} data-resident={isResident || undefined} data-admin={isAdmin || undefined}>
          <div className={styles.header}>
            {view === 'chat' ? (
              <>
                {!isResident && (
                  <button className={styles.backBtn} onClick={handleBack} aria-label="Back to conversations">
                    <ChevronLeft size={18} />
                  </button>
                )}
                <span className={styles.headerTitle}>{isResident ? 'Spotter' : activeConversation?.other_user_name || 'Admin'}</span>
                {isAdmin && activeConvId && (
                  <button
                    className={styles.fullscreenBtn}
                    onClick={() => router.push('/admin/messages')}
                    aria-label="Full screen"
                  >
                    <Maximize2 size={14} />
                  </button>
                )}
              </>
            ) : (
              <span className={styles.headerTitle}>Messages</span>
            )}
            <button className={styles.closeBtn} onClick={toggle} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {view === 'list' ? (
              isResident ? (
                <div className={styles.empty}>
                  <span>Connecting to Spotter...</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className={styles.empty}>
                  {residents.length === 0 && (
                    <span>No conversations yet</span>
                  )}
                  {residents.length > 0 && (
                    <div className={styles.residentList}>
                      <div className={styles.residentListTitle}>Start a conversation:</div>
                      {residents.map((r) => (
                        <button
                          key={r.user_id}
                          className={styles.convItem}
                          onClick={() => startConversation(r.user_id, r.full_name)}
                        >
                          <div className={styles.convAvatar}>{r.full_name.charAt(0).toUpperCase()}</div>
                          <div className={styles.convInfo}>
                            <div className={styles.convName}>{r.full_name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {conversations.map((conv) => (
                    <button
                      key={conv.conversation_id}
                      className={styles.convItem}
                      onClick={() => selectConversation(conv.conversation_id)}
                    >
                      <div className={styles.convAvatar}>
                        {conv.other_user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.convInfo}>
                        <div className={styles.convName}>{conv.other_user_name}</div>
                        <div className={styles.convPreview}>
                          {conv.last_message?.message_text || 'No messages yet'}
                        </div>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className={styles.convBadge}>
                          {conv.unread_count > 99 ? '99+' : conv.unread_count}
                        </span>
                      )}
                    </button>
                  ))}
                </>
              )
            ) : (
              <div className={styles.messagesContainer}>
                {isLoading ? (
                  <div className={styles.loading}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className={styles.empty}>No messages yet. Say hello!</div>
                ) : (
                  [...messages].sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()).map((msg) => {
                    const isOwn = currentUserId ? msg.sender_id === currentUserId : false;
                    return (
                      <div
                        key={msg.message_id}
                        className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}
                      >
                        {msg.photo_url && (
                          <img
                            src={msg.photo_url.startsWith('blob:') ? msg.photo_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${msg.photo_url}`}
                            alt="Attached image"
                            className={styles.messageImage}
                          />
                        )}
                        {msg.message_text && <div className={styles.messageText}>{msg.message_text}</div>}
                        <div className={styles.messageTime}>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {view === 'chat' && (
            <div className={styles.inputBar}>
              {selectedPhoto && (
                <div className={styles.photoPreview}>
                  <img src={URL.createObjectURL(selectedPhoto)} alt="Preview" className={styles.photoPreviewImg} />
                  <button className={styles.photoPreviewRemove} onClick={() => setSelectedPhoto(null)}>&times;</button>
                </div>
              )}
              <input
                ref={inputRef}
                className={styles.input}
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setSelectedPhoto(f); e.target.value = ''; }}
              />
              <button
                className={styles.attachBtn}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach image"
              >
                <Image size={16} />
              </button>
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!inputText.trim() && !selectedPhoto}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
