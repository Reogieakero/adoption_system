import React from 'react';
import { SquarePen } from 'lucide-react';
import type { Conversation } from '@/types';
import Button from '@/components/ui/button';
import SearchBar from '@/components/ui/search-bar';
import TabsBar from './TabsBar';
import ConversationCard from './ConversationCard';
import styles from './Sidebar.module.css';

interface SidebarProps {
  conversations: Conversation[];
  activeConvoId: number;
  activeTab: string;
  searchQuery: string;
  onSelectConversation: (id: number) => void;
  onTabChange: (tab: string) => void;
  onSearchChange: (value: string) => void;
}

function getLastMessageText(conversation: Conversation): string {
  if (conversation.messages.length === 0) return '';
  const last = conversation.messages[conversation.messages.length - 1];
  return last.message_text ?? '';
}

function hasUnread(conversation: Conversation): boolean {
  return conversation.messages.some(m => !m.is_read);
}

function getCategory(linked_type: Conversation['linked_type']): string {
  switch (linked_type) {
    case 'adoption_application': return 'Adoption';
    case 'animal_report': return 'Report';
  }
}

export default function Sidebar({
  conversations,
  activeConvoId,
  activeTab,
  searchQuery,
  onSelectConversation,
  onTabChange,
  onSearchChange
}: SidebarProps) {
  const filteredConversations = conversations.filter(c => {
    const lastMsg = getLastMessageText(c);
    const matchesSearch = c.resident_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lastMsg.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return hasUnread(c);
    return getCategory(c.linked_type).toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.titleRow}>
          <h1>Messages</h1>
          <Button variant="admin-ghost" square title="New Conversation">
            <SquarePen size={13} />
          </Button>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search conversations..." />
      </div>

      <TabsBar activeTab={activeTab} onChange={onTabChange} />

      <div className={styles.conversationList}>
        {filteredConversations.map(convo => (
          <ConversationCard
            key={convo.thread_id}
            conversation={convo}
            isActive={convo.thread_id === activeConvoId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
}
