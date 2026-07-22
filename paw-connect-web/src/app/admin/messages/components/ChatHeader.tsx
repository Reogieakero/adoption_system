import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Conversation } from '@/types';
import Avatar from './Avatar';
import RoleBadge from './RoleBadge';
import Button from '@/components/ui/button';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  conversation: Conversation;
  onViewProfile?: () => void;
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

function getCaseFocus(conversation: Conversation): string | null {
  if (conversation.linked_type === 'adoption_application') {
    return `Application #${conversation.linked_id}`;
  }
  return `Report #${conversation.linked_id}`;
}

export default function ChatHeader({ conversation, onViewProfile }: ChatHeaderProps) {
  return (
    <header className={styles.chatHeader}>
      <div className={styles.headerUserInfo}>
        <Avatar name={conversation.resident_name} fallback={getInitials(conversation.resident_name)} />
        <div>
          <h3 className={styles.headerTitle}>
            {conversation.resident_name}
            <RoleBadge role={getRoleFromLinkedType(conversation.linked_type)} noMargin />
          </h3>
          <p className={styles.headerMeta}>
            {getCaseFocus(conversation) ? `Case Focus: ${getCaseFocus(conversation)}` : 'No attached animal file'}
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        <Button variant="admin-secondary" onClick={onViewProfile}>View Profile</Button>
        <Button variant="admin-secondary" square>
          <MoreHorizontal size={13} />
        </Button>
      </div>
    </header>
  );
}
