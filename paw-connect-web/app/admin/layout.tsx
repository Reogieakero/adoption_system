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
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-geist-mono), monospace' }}>
            An unexpected render issue occurred.
          </p>
          <button 
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              background: '#ffffff'
            }}
          >
            Reload workspace view
          </button>
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
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* Fixed sidebar workspace width */}
      <div style={{ width: '64px', flexShrink: 0 }}>
        <AdminSidebar />
      </div>
      
      {/* Content wrapper panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar />
        
        {/* Main section wrapper with scroll allowance */}
        <main style={{ flex: 1, backgroundColor: '#ffffff', marginTop: '56px', padding: '1.5rem' }}>
          <SafeErrorBoundary>
            {children}
          </SafeErrorBoundary>
        </main>
      </div>
    </div>
  );
}