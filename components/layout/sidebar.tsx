'use client';

import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { TopicTree } from '../navigation/topic-tree';
import { useUIStore } from '@/lib/store/ui-store';

export function Sidebar() {
  const { isSidebarOpen } = useUIStore();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-60 h-[calc(100vh-3rem)] border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col justify-between shrink-0 select-none text-xs transition-all duration-200">
      {/* Upper Content: Active Notebook & Interactive Topic Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Active Notebook Header */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md font-medium text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors cursor-pointer">
          <BookOpen className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="truncate font-semibold text-xs">My Python Notebook</span>
        </div>

        {/* Interactive Topic Navigation Tree */}
        <TopicTree />
      </div>

      {/* Bottom Footer: Quick Action + New Page */}
      <div className="p-2 border-t border-[var(--border)]">
        <button
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors text-xs font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Page</span>
        </button>
      </div>
    </aside>
  );
}
