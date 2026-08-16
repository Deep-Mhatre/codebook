'use client';

import React, { useEffect, useState } from 'react';
import { Search, Sun, Moon, Settings, User, PanelLeftClose, PanelLeftOpen, Zap, LogOut } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { createClient } from '@/lib/auth/supabase-browser';
import { useRouter } from 'next/navigation';
import { StreamStatusBar } from '../media/stream-status-bar';

interface TopbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Topbar({ theme, onToggleTheme }: TopbarProps) {
  const { isSidebarOpen, toggleSidebar, setSearchOpen, toggleScratchpad } = useUIStore();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-12 border-b border-[var(--border)] bg-[var(--background)] px-3 flex items-center justify-between text-sm select-none shrink-0 transition-colors duration-200 relative">
      {/* Left: Sidebar toggle & Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors focus:outline-none cursor-pointer"
          title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-1.5 font-medium tracking-tight text-[var(--foreground)] cursor-pointer">
          <span className="text-base font-serif">◈</span>
          <span className="font-semibold text-sm">CodeBook</span>
        </div>
      </div>

      {/* Center: Live Media Stream Security Status Bar */}
      <div className="flex items-center">
        <StreamStatusBar />
      </div>

      {/* Right: Search, Scratchpad, Theme Toggle, Settings, User */}
      <div className="flex items-center gap-1">
        {/* Search trigger button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--sidebar)] hover:bg-[var(--hover)] border border-[var(--border)] rounded-md transition-colors mr-1 cursor-pointer"
          title="Search (Ctrl/Cmd + K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[var(--background)] border border-[var(--border)] rounded text-[var(--muted-foreground)]">
            ⌘K
          </kbd>
        </button>

        {/* Scratchpad Button */}
        <button
          onClick={toggleScratchpad}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-md transition-colors mr-1 cursor-pointer font-medium"
          title="Open Scratchpad"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Scratchpad</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors focus:outline-none cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Settings button */}
        <button
          className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors focus:outline-none cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors focus:outline-none cursor-pointer"
            title={userEmail || 'User Account'}
            aria-label="User Profile"
          >
            <User className="w-4 h-4" />
            {userEmail && (
              <span className="hidden md:inline-block text-xs font-mono text-[var(--muted-foreground)] truncate max-w-[120px]">
                {userEmail.split('@')[0]}
              </span>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-10 w-52 bg-[var(--sidebar)] border border-[var(--border)] rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[var(--border)] font-mono text-[var(--muted-foreground)] truncate">
                {userEmail || 'Signed in'}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
