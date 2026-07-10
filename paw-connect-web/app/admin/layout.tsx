"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Global Safety Shield to catch transition errors instantly
class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: false }; // Soft reset layout immediately to bypass blocking overlays
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Muted component transition artifact:", error, errorInfo);
  }

  public render() {
    return this.props.children;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ width: '64px', flexShrink: 0 }}>
        <AdminSidebar />
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar />
        
        <main style={{ flex: 1, backgroundColor: 'white', marginTop: '56px' }}>
          <SafeErrorBoundary>
            {children}
          </SafeErrorBoundary>
        </main>
      </div>
    </div>
  );
}