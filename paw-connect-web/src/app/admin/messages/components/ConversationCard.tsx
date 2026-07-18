import React from 'react';
import type { Conversation } from '@/types';
import Avatar from './Avatar';
import RoleBadge from './RoleBadge';
import styles from './ConversationCard.module.css';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export default function ConversationCard({ conversation, isActive, onSelect }: ConversationCardProps) {
  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`${styles.convoCard} ${isActive ? styles.convoCardActive : ''}`}
    >
      <div className={styles.avatarSlot}>
        <Avatar name={conversation.userName} fallback={conversation.avatarFallback} url={conversation.avatarUrl} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardMetaRow}>
          <span className={styles.userName}>{conversation.userName}</span>
          <span className={styles.cardTime}>{conversation.time}</span>
        </div>

        <div className={styles.previewRow}>
          <p className={`${styles.msgPreview} ${conversation.isUnread ? styles.msgPreviewUnread : ''}`}>
            {conversation.lastMessage}
          </p>
          {conversation.isUnread && <div className={styles.unreadBadge} />}
        </div>

        <RoleBadge role={conversation.userRole} />
      </div>
    </div>
  );
}

