'use client';

import React, { useState, useEffect } from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import { CommandMenu } from '../navigation/command-menu';
import { Scratchpad } from '../notebook/scratchpad';
import { Providers } from '@/app/providers';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('codebook-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('codebook-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans antialiased transition-colors duration-200">
        {/* Topbar Navigation */}
        <Topbar
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Command Menu Modal (Cmd+K) */}
        <CommandMenu />

        {/* Scratchpad Slide-Out Drawer */}
        <Scratchpad />

        {/* Main Workspace Area: Sidebar + Canvas */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[var(--background)] p-6 sm:p-10">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Providers>
  );
}
