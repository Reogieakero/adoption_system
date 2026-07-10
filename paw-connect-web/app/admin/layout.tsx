import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {/* Sidebar - fixed width container */}
      <div style={{ width: '64px', flexShrink: 0 }}>
        <AdminSidebar />
      </div>
      
      {/* Main content - takes remaining width */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminNavbar />
        
        <main style={{ flex: 1, backgroundColor: 'white', marginTop: '56px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}