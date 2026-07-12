"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  Heart, 
  Check, 
  Trash2, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import styles from './Notification.module.css';

interface NotificationItem {
  id: string;
  category: 'Adoption' | 'Rescue' | 'Reports' | 'Health';
  title: string;
  description: string;
  animalName?: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  isRead: boolean;
  metaData?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    category: 'Adoption',
    title: 'New adoption application received.',
    description: 'Applicant Jane Doe submitted an application for processing pipeline authorization.',
    animalName: 'Max',
    priority: 'Medium',
    time: '5m ago',
    isRead: false,
    metaData: 'Adopter: Jane Doe'
  },
  {
    id: '2',
    category: 'Rescue',
    title: 'New stray animal reported.',
    description: 'Urgent field emergency reported near the North Industrial Sector.',
    animalName: 'Unknown Feline',
    priority: 'High',
    time: '12m ago',
    isRead: false,
    metaData: 'Location: Route 4 Block'
  },
  {
    id: '3',
    category: 'Health',
    title: 'Abnormal heart rate detected.',
    description: 'Biometric tracker flagged consistent spike telemetry alerts.',
    animalName: 'Bella',
    priority: 'High',
    time: '45m ago',
    isRead: false,
    metaData: 'BPM: 168 (Critical)'
  },
  {
    id: '4',
    category: 'Reports',
    title: 'Injured animal reported.',
    description: 'Citizen report filed regarding an injured canine with a fractured limb.',
    priority: 'High',
    time: '1h ago',
    isRead: true,
    metaData: 'Location: West End Dock'
  }
];

export default function IntegratedAdminDashboard() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('All');

  // Mutation Handlers
  const toggleReadStatus = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Derived Connected Counts
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriority = notifications.filter(n => n.priority === 'High').length;
  
  const pendingAdoptionsCount = notifications.filter(n => n.category === 'Adoption' && !n.isRead).length;
  const activeRescuesCount = notifications.filter(n => n.category === 'Rescue' && !n.isRead).length;

  const filteredFeed = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.isRead;
    return n.category === activeTab;
  });

  const resolveContextAction = (category: 'Adoption' | 'Rescue' | 'Health') => {
    const target = notifications.find(n => n.category === category && !n.isRead);
    if (target) toggleReadStatus(target.id);
  };

  return (
    <div className={styles.container}>
      
      {/* Top Dynamic Stat Strip */}
      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span>Active Feed Pool</span>
            <Clock size={14} />
          </div>
          <p className={styles.summaryValue}>{totalCount}</p>
          <p className={styles.summarySubtext}>Total tracked alerts</p>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span>Unread Actions</span>
            <AlertTriangle size={14} style={{ color: unreadCount > 0 ? '#09090b' : '#71717a' }} />
          </div>
          <p className={styles.summaryValue}>{unreadCount}</p>
          <p className={styles.summarySubtext}>Requires immediate check</p>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span>High Priority Alerts</span>
            <AlertTriangle size={14} />
          </div>
          <p className={styles.summaryValue}>{highPriority}</p>
          <p className={styles.summarySubtext}>Critical state conditions</p>
        </div>
      </section>

      {/* Main Workspace Grid Framework */}
      <div className={styles.dashboardWorkspace}>
        
        {/* Left Workspace Panel: Central Notification Stream */}
        <main className={styles.mainPanel}>
          <div className={styles.panelHeader}>
            <h2>Notifications Management Feed</h2>
            <p>Action updates across adoption, rescue missions, and diagnostic metrics.</p>
          </div>

          <div className={styles.filterControlsBar}>
            <div className={styles.toggleGroup}>
              {['All', 'Unread', 'Adoption', 'Rescue', 'Reports', 'Health'].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.toggleButton} ${activeTab === tab ? styles.toggleButtonActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className={styles.actionButton} onClick={markAllAsRead}>
              <Check size={14} /> Mark Feed Read
            </button>
          </div>

          <div className={styles.feedList}>
            {filteredFeed.map((item) => (
              <article 
                key={item.id} 
                className={`${styles.feedCard} ${!item.isRead ? styles.feedCardUnread : ''}`}
              >
                {!item.isRead && <div className={styles.unreadDot} />}
                
                <div className={`${styles.categoryIcon} ${
                  item.category === 'Adoption' ? styles.iconAdoption :
                  item.category === 'Rescue' ? styles.iconRescue :
                  item.category === 'Reports' ? styles.iconReports : styles.iconHealth
                }`}>
                  {item.category === 'Adoption' && <Sparkles size={16} />}
                  {item.category === 'Rescue' && <ShieldAlert size={16} />}
                  {item.category === 'Reports' && <FileText size={16} />}
                  {item.category === 'Health' && <Heart size={16} />}
                </div>

                <div className={styles.feedContent}>
                  <div className={styles.feedTitleRow}>
                    <h4 className={styles.feedTitle}>{item.title}</h4>
                    <span className={styles.feedTime}>{item.time}</span>
                  </div>
                  <p className={styles.feedDesc}>{item.description}</p>
                  
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>{item.category}</span>
                    <span className={`${styles.badge} ${item.priority === 'High' ? styles.priorityHigh : ''}`}>
                      {item.priority}
                    </span>
                    {item.animalName && <span className={styles.badge}>{item.animalName}</span>}
                  </div>
                </div>

                <div className={styles.feedActions}>
                  <button 
                    className={styles.ghostButton} 
                    title={item.isRead ? "Mark Unread" : "Mark Read"}
                    onClick={() => toggleReadStatus(item.id)}
                  >
                    <CheckSquare size={14} style={{ color: item.isRead ? '#16a34a' : 'inherit' }} />
                  </button>
                  <button 
                    className={styles.ghostButton} 
                    title="Dismiss Notification"
                    onClick={() => deleteNotification(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right Sidebar: Contextual Dynamic Resolution Cards */}
        <aside className={styles.rightSidebar}>
          
          <div>
            <div className={styles.sidebarSectionHeader}>
              <h3>Contextual Action Resolution</h3>
            </div>

            <div className={styles.cardStream}>
              <div className={styles.opsCard}>
                <div className={styles.opsCardTitle}>
                  <span>Pending Screening</span>
                  <span className={styles.animalMiniTag}>Queue: {pendingAdoptionsCount}</span>
                </div>
                <p className={styles.opsDataRow}>
                  Process the unread application file alerts submitted for verification processing.
                </p>
                <div className={styles.opsActionWrapper}>
                  <button 
                    className={`${styles.miniButton} ${styles.miniButtonPrimary}`}
                    onClick={() => resolveContextAction('Adoption')}
                    disabled={pendingAdoptionsCount === 0}
                  >
                    Approve Application
                  </button>
                  <button className={styles.miniButton}>Review File</button>
                </div>
              </div>

              <div className={styles.opsCard}>
                <div className={styles.opsCardTitle}>
                  <span>Active Emergency Dispatch</span>
                  <span className={styles.animalMiniTag} style={{color: '#09090b'}}>Pending: {activeRescuesCount}</span>
                </div>
                <p className={styles.opsDataRow}>
                  Coordinate dispatch vehicles to the logged location vectors instantly.
                </p>
                <div className={styles.opsActionWrapper}>
                  <button 
                    className={`${styles.miniButton} ${styles.miniButtonPrimary}`}
                    onClick={() => resolveContextAction('Rescue')}
                    disabled={activeRescuesCount === 0}
                  >
                    Deploy Unit
                  </button>
                </div>
              </div>

              <div className={styles.opsCard}>
                <div className={styles.opsCardTitle}>
                  <span>Critical Biometrics</span>
                  <span className={styles.animalMiniTag}>Telemetry</span>
                </div>
                <p className={styles.opsDataRow}>
                  Automated telemetry health alert flags requiring immediate veterinary check.
                </p>
                <div className={styles.opsActionWrapper}>
                  <button 
                    className={`${styles.miniButton} ${styles.miniButtonPrimary}`}
                    onClick={() => resolveContextAction('Health')}
                  >
                    Acknowledge Pulse Alert <ArrowUpRight size={12} style={{display:'inline', marginLeft:'2px'}} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}