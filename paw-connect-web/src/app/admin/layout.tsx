"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminNavbar from '@/components/admin/admin-navbar';
import Button from '@/components/ui/button';
import AdminChatWidget from '@/components/admin/AdminChatWidget';
import styles from './AdminLayout.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Return true to prevent React infinite loops, allowing local recovery
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Muted component transition artifact:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles['error-container']}>
          <p className={styles['error-text']}>
            An unexpected render issue occurred.
          </p>
          <Button variant="admin-secondary" onClick={() => this.setState({ hasError: false })}>
            Reload workspace view
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles['layout-wrapper']}>
      <div className={styles['sidebar-container']}>
        <AdminSidebar />
      </div>
      
      <div className={styles['content-wrapper']}>
        <AdminNavbar />
        
        <main className={styles['main-content']}>
          <SafeErrorBoundary>
            {children}
          </SafeErrorBoundary>
        </main>
      </div>
      <AdminChatWidget />
    </div>
  );
}
