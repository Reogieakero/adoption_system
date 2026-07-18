import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Conversation } from '@/types';
import Avatar from './Avatar';
import RoleBadge from './RoleBadge';
import Button from '@/components/ui/button';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  conversation: Conversation;
}

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className={styles.chatHeader}>
      <div className={styles.headerUserInfo}>
        <Avatar name={conversation.userName} fallback={conversation.avatarFallback} url={conversation.avatarUrl} />
        <div>
          <h3 className={styles.headerTitle}>
            {conversation.userName}
            <RoleBadge role={conversation.userRole} noMargin />
          </h3>
          <p className={styles.headerMeta}>
            {conversation.relatedAnimal ? `Case Focus: ${conversation.relatedAnimal}` : 'No attached animal file'}
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        <Button variant="admin-secondary">View Profile</Button>
        <Button variant="admin-secondary" square>
          <MoreHorizontal size={13} />
        </Button>
      </div>
    </header>
  );
}

