'use client';

import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from '../AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Top Fixed Header */}
      <AdminHeader
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6 sm:gap-8 items-start">
        {/* Desktop Collapsible Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-card h-full p-4 overflow-y-auto shadow-2xl z-10">
              <AdminSidebar />
            </div>
          </div>
        )}

        {/* Main Content Workspace Area */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
