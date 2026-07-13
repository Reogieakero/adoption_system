import React from 'react';
import { SquarePen } from 'lucide-react';
import { Conversation } from '../../types';
import Button from '../shared/Button';
import SearchBar from './SearchBar';
import TabsBar from './TabsBar';
import ConversationCard from './ConversationCard';
import styles from './Sidebar.module.css';

interface SidebarProps {
  conversations: Conversation[];
  activeConvoId: string;
  activeTab: string;
  searchQuery: string;
  onSelectConversation: (id: string) => void;
  onTabChange: (tab: string) => void;
  onSearchChange: (value: string) => void;
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
    const matchesSearch = c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return c.isUnread;
    return c.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.titleRow}>
          <h1>Messages</h1>
          <Button square title="New Conversation">
            <SquarePen size={13} />
          </Button>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      <TabsBar activeTab={activeTab} onChange={onTabChange} />

      <div className={styles.conversationList}>
        {filteredConversations.map(convo => (
          <ConversationCard
            key={convo.id}
            conversation={convo}
            isActive={convo.id === activeConvoId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
}
