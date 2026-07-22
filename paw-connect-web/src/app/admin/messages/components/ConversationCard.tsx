import React from 'react';
import type { Conversation } from '@/types';
import Avatar from './Avatar';
import RoleBadge from './RoleBadge';
import styles from './ConversationCard.module.css';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: number) => void;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getRoleFromLinkedType(type: Conversation['linked_type']): string {
  switch (type) {
    case 'adoption_application': return 'Adoption Application';
    case 'animal_report': return 'Animal Report';
  }
}

function getLastMessage(conversation: Conversation): string {
  if (conversation.messages.length === 0) return '';
  const last = conversation.messages[conversation.messages.length - 1];
  return last.message_text ?? '[Photo]';
}

function getTimeDisplay(conversation: Conversation): string {
  if (conversation.messages.length === 0) return '';
  const last = conversation.messages[conversation.messages.length - 1];
  const date = new Date(last.sent_at);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function hasUnread(conversation: Conversation): boolean {
  return conversation.messages.some(m => !m.is_read);
}

export default function ConversationCard({ conversation, isActive, onSelect }: ConversationCardProps) {
  const unread = hasUnread(conversation);

  return (
    <div
      onClick={() => onSelect(conversation.thread_id)}
      className={`${styles.convoCard} ${isActive ? styles.convoCardActive : ''}`}
    >
      <div className={styles.avatarSlot}>
        <Avatar name={conversation.resident_name} fallback={getInitials(conversation.resident_name)} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardMetaRow}>
          <span className={styles.userName}>{conversation.resident_name}</span>
          <span className={styles.cardTime}>{getTimeDisplay(conversation)}</span>
        </div>

        <div className={styles.previewRow}>
          <p className={`${styles.msgPreview} ${unread ? styles.msgPreviewUnread : ''}`}>
            {getLastMessage(conversation)}
          </p>
          {unread && <div className={styles.unreadBadge} />}
        </div>

        <RoleBadge role={getRoleFromLinkedType(conversation.linked_type)} />
      </div>
    </div>
  );
}
