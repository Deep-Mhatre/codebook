'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Code2, Folder, X } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface SearchItem {
  id: string;
  type: 'topic' | 'page' | 'code';
  title: string;
  path: string;
  snippet?: string;
}

const SAMPLE_SEARCH_DATA: SearchItem[] = [
  { id: 'page-variables', type: 'page', title: 'Variables', path: 'Python / Fundamentals' },
  { id: 'page-data-types', type: 'page', title: 'Data Types', path: 'Python / Fundamentals' },
  { id: 'page-operators', type: 'page', title: 'Operators', path: 'Python / Fundamentals' },
  { id: 'page-if-else', type: 'page', title: 'If / Else', path: 'Python / Control Flow' },
  { id: 'page-for-loops', type: 'page', title: 'For Loops', path: 'Python / Control Flow' },
  { id: 'page-pandas', type: 'page', title: 'Pandas DataFrames', path: 'Python / Libraries' },
  { id: 'code-1', type: 'code', title: 'import pandas as pd', path: 'Python / Libraries / Pandas', snippet: 'df = pd.DataFrame({"Name": ["A", "B"]})' },
  { id: 'code-2', type: 'code', title: 'matplotlib.pyplot plot', path: 'Python / Libraries / Matplotlib', snippet: 'plt.plot(months, sales); plt.show()' },
];

export function CommandMenu() {
  const { isSearchOpen, setSearchOpen, setActivePage } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredItems = query.trim() === ''
    ? SAMPLE_SEARCH_DATA
    : SAMPLE_SEARCH_DATA.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase()) ||
        (item.snippet && item.snippet.toLowerCase().includes(query.toLowerCase()))
      );

  const handleSelectItem = (item: SearchItem) => {
    setActivePage(item.id);
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search notebook notes, topics, or Python code..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[var(--muted-foreground)]"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
              No matching pages or code snippets found.
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  index === selectedIndex
                    ? 'bg-[var(--hover)] text-[var(--foreground)] font-medium'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                }`}
              >
                {/* Icon mapping */}
                {item.type === 'page' && <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                {item.type === 'topic' && <Folder className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                {item.type === 'code' && <Code2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-[var(--foreground)]">{item.title}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">{item.path}</span>
                  </div>
                  {item.snippet && (
                    <div className="text-[11px] font-mono text-[var(--muted-foreground)] truncate pt-0.5">
                      {item.snippet}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--sidebar)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
          <span>Navigate with arrows, select with Enter</span>
          <span className="font-mono text-[10px]">[Esc] Close</span>
        </div>
      </div>
    </div>
  );
}
