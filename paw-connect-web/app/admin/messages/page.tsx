"use client";

import React, { useState } from 'react';
import { 
  SquarePen, 
  Search, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  SendHorizontal, 
  FileText,
  CheckCheck,
  Check
} from 'lucide-react';
import styles from './Messages.module.css';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url?: string;
    name?: string;
    size?: string;
  };
}

interface Conversation {
  id: string;
  userName: string;
  userRole: 'Citizen' | 'Adopter' | 'Rescuer';
  avatarFallback: string;
  avatarUrl?: string;
  relatedAnimal?: string;
  category: 'Adoption' | 'Rescue' | 'General';
  lastMessage: string;
  time: string;
  isUnread: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userName: 'Jane Miller',
    userRole: 'Adopter',
    avatarFallback: 'JM',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
    relatedAnimal: 'Max (Beagle)',
    category: 'Adoption',
    lastMessage: 'Sure, I will upload the residential verification docs tonight.',
    time: '2m ago',
    isUnread: true,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hello, I wanted to inquire about the home layout checks required for Max.', time: '10:30 AM', status: 'read' },
      { id: 'm2', sender: 'admin', text: 'Hi Jane! We need a quick video walkthrough or document verification proving space compliance.', time: '10:32 AM', status: 'read' },
      { id: 'm3', sender: 'user', text: 'Sure, I will upload the residential verification docs tonight.', time: '10:35 AM', status: 'read', 
        attachment: { type: 'file', name: 'housing_agreement.pdf', size: '1.2 MB' } }
    ]
  },
  {
    id: 'c2',
    userName: 'Marcus Vance',
    userRole: 'Rescuer',
    avatarFallback: 'MV',
    relatedAnimal: 'Case #4093 (Shadow)',
    category: 'Rescue',
    lastMessage: 'Unit 4 cleared the sector. The canine is secure inside the crate.',
    time: '1h ago',
    isUnread: false,
    messages: [
      { id: 'm4', sender: 'admin', text: 'Marcus, what is your current ETA to the North Industrial Block?', time: '09:12 AM', status: 'read' },
      { id: 'm5', sender: 'user', text: 'Unit 4 cleared the sector. The canine is secure inside the crate.', time: '09:20 AM', status: 'read',
        attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=60' } }
    ]
  },
  {
    id: 'c3',
    userName: 'Alice Cooper',
    userRole: 'Citizen',
    category: 'General',
    avatarFallback: 'AC',
    lastMessage: 'Thank you for the update on the public stray tracking procedures.',
    time: 'Yesterday',
    isUnread: false,
    messages: [
      { id: 'm6', sender: 'user', text: 'How do I report stray integration lines without creating false emergency alarms?', time: 'Yesterday', status: 'read' },
      { id: 'm7', sender: 'admin', text: 'You can flag them using the General portal tier right inside our utility app.', time: 'Yesterday', status: 'read' },
      { id: 'm8', sender: 'user', text: 'Thank you for the update on the public stray tracking procedures.', time: 'Yesterday', status: 'read' }
    ]
  }
];

export default function SaaSMessageWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvoId, setActiveConvoId] = useState<string>('c1');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');

  const activeConvo = conversations.find(c => c.id === activeConvoId) || conversations[0];

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg: Message = {
      id: `m_new_${Date.now()}`,
      sender: 'admin',
      text: typedMessage,
      time: 'Just now',
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvoId) {
        return {
          ...c,
          lastMessage: typedMessage,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setTypedMessage('');
  };

  const selectConversation = (id: string) => {
    setActiveConvoId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isUnread: false } : c));
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return c.isUnread;
    return c.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className={styles.container}>
      
      {/* Left Sidebar Frame Context */}
      <aside className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.titleRow}>
            <h1>Messages</h1>
            <button className={`${styles.btn} ${styles.btnSquare}`} title="New Conversation">
              <SquarePen size={13} />
            </button>
          </div>

          {/* Supabase Search Input Mimicry */}
          <div className={styles.supabaseSearchWrapper}>
            <Search size={13} className={styles.searchIconLeft} />
            <input 
              type="text"
              placeholder="Search conversations..."
              className={styles.supabaseSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.kbdShortcutHint}>
              <span>⌘</span><span>K</span>
            </div>
          </div>
        </div>

        {/* Tab Controls Segment Track */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsTrack}>
            {['All', 'Unread', 'Adoption', 'Rescue', 'General'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Contact list area */}
        <div className={styles.conversationList}>
          {filteredConversations.map(convo => {
            const isActive = convo.id === activeConvoId;
            return (
              <div 
                key={convo.id}
                onClick={() => selectConversation(convo.id)}
                className={`${styles.convoCard} ${isActive ? styles.convoCardActive : ''}`}
              >
                <div className="relative flex-shrink-0">
                  {convo.avatarUrl ? (
                    <img src={convo.avatarUrl} alt={convo.userName} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-[10px] font-semibold text-zinc-600">
                      {convo.avatarFallback}
                    </div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.userName}>{convo.userName}</span>
                    <span className={styles.cardTime}>{convo.time}</span>
                  </div>

                  <div className={styles.previewRow}>
                    <p className={`${styles.msgPreview} ${convo.isUnread ? styles.msgPreviewUnread : ''}`}>
                      {convo.lastMessage}
                    </p>
                    {convo.isUnread && <div className={styles.unreadBadge} />}
                  </div>
                  
                  <span className={styles.roleBadge}>
                    {convo.userRole}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Workspace Frame Window */}
      <main className={styles.chatWindow}>
        <header className={styles.chatHeader}>
          <div className={styles.headerUserInfo}>
            {activeConvo.avatarUrl ? (
              <img src={activeConvo.avatarUrl} alt={activeConvo.userName} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-[10px] font-semibold text-zinc-600">
                {activeConvo.avatarFallback}
              </div>
            )}
            <div>
              <h3 className={styles.headerTitle}>
                {activeConvo.userName} 
                <span className={styles.roleBadge} style={{ marginTop: 0 }}>
                  {activeConvo.userRole}
                </span>
              </h3>
              <p className={styles.headerMeta}>
                {activeConvo.relatedAnimal ? `Case Focus: ${activeConvo.relatedAnimal}` : 'No attached animal file'}
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.btn}>
              View Profile
            </button>
            <button className={`${styles.btn} ${styles.btnSquare}`}>
              <MoreHorizontal size={13} />
            </button>
          </div>
        </header>

        {/* Scrollable message stream */}
        <div className={styles.scrollArea}>
          {activeConvo.messages.map((msg) => {
            const isAdmin = msg.sender === 'admin';
            return (
              <div 
                key={msg.id} 
                className={`${styles.msgRow} ${isAdmin ? styles.msgAdmin : styles.msgIncoming}`}
              >
                <div className={`${styles.bubble} ${isAdmin ? styles.bubbleAdmin : styles.bubbleIncoming}`}>
                  {msg.text}

                  {msg.attachment?.type === 'image' && (
                    <div className={styles.attachmentPreview}>
                      <img src={msg.attachment.url} alt="Attachment payload" className="w-full h-auto max-h-36 object-cover" />
                    </div>
                  )}

                  {msg.attachment?.type === 'file' && (
                    <div className={styles.attachmentPreview}>
                      <div className={styles.fileAttachment}>
                        <FileText size={12} className="text-zinc-500" />
                        <div className="truncate">
                          <p className="font-medium truncate">{msg.attachment.name}</p>
                          <p className="text-[9px] text-zinc-400">{msg.attachment.size}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${styles.msgMeta} ${isAdmin ? styles.msgMetaAdmin : ''}`}>
                  <span>{msg.time}</span>
                  {isAdmin && (
                    <span>
                      {msg.status === 'read' ? <CheckCheck size={10} className="text-zinc-400" /> : <Check size={10} />}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Interface Dock */}
        <footer className={styles.inputBar}>
          <div className={styles.actionPaneWrapper}>
            <button className={`${styles.btn} ${styles.btnSquare}`} title="Attach operational file">
              <Paperclip size={13} className="text-zinc-500" />
            </button>
            <button className={`${styles.btn} ${styles.btnSquare}`} title="Add emoji response">
              <Smile size={13} className="text-zinc-500" />
            </button>
          </div>

          <input 
            type="text"
            placeholder="Type your message here..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className={styles.messageInput}
          />

          <button 
            onClick={handleSendMessage}
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ gap: '0.25rem' }}
          >
            <span>Send</span>
            <SendHorizontal size={11} />
          </button>
        </footer>
      </main>
    </div>
  );
}