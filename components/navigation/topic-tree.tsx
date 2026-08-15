'use client';

import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export interface PageNode {
  id: string;
  title: string;
}

export interface TopicNode {
  id: string;
  title: string;
  pages: PageNode[];
  subtopics?: TopicNode[];
}

const INITIAL_TOPICS: TopicNode[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    pages: [
      { id: 'page-variables', title: 'Variables' },
      { id: 'page-data-types', title: 'Data Types' },
      { id: 'page-operators', title: 'Operators' },
      { id: 'page-io', title: 'Input & Output' },
    ],
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    pages: [
      { id: 'page-if-else', title: 'If / Else' },
      { id: 'page-for-loops', title: 'For Loops' },
      { id: 'page-while-loops', title: 'While Loops' },
    ],
  },
  {
    id: 'functions',
    title: 'Functions',
    pages: [
      { id: 'page-functions-intro', title: 'Functions' },
      { id: 'page-params', title: 'Parameters' },
      { id: 'page-returns', title: 'Return Values' },
    ],
  },
  {
    id: 'libraries',
    title: 'Libraries',
    pages: [
      { id: 'page-numpy', title: 'NumPy' },
      { id: 'page-pandas', title: 'Pandas' },
      { id: 'page-matplotlib', title: 'Matplotlib' },
    ],
  },
];

export function TopicTree() {
  const { activePageId, setActivePage, expandedTopicIds, toggleTopicExpand } = useUIStore();
  const [topics, setTopics] = useState<TopicNode[]>(INITIAL_TOPICS);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleAddTopic = () => {
    const newTopic: TopicNode = {
      id: `topic-${Date.now()}`,
      title: 'New Topic',
      pages: [{ id: `page-${Date.now()}`, title: 'Untitled Page' }],
    };
    setTopics([...topics, newTopic]);
  };

  const handleAddPage = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTopics(
      topics.map((topic) => {
        if (topic.id === topicId) {
          const newPage = { id: `page-${Date.now()}`, title: 'Untitled Page' };
          return { ...topic, pages: [...topic.pages, newPage] };
        }
        return topic;
      })
    );
  };

  return (
    <div className="space-y-1 text-xs select-none">
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-[var(--muted-foreground)] tracking-wider uppercase">
        <span>Notebook Topics</span>
        <button
          onClick={handleAddTopic}
          className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors"
          title="Add Topic"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-0.5">
        {topics.map((topic) => {
          const isExpanded = expandedTopicIds[topic.id] ?? false;

          return (
            <div key={topic.id} className="space-y-0.5">
              {/* Topic Item Bar */}
              <div
                onClick={() => toggleTopicExpand(topic.id)}
                className="group flex items-center justify-between px-2 py-1 rounded-md hover:bg-[var(--hover)] cursor-pointer text-[var(--foreground)] transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
                  )}
                  <Folder className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
                  <span className="truncate font-medium">{topic.title}</span>
                </div>

                {/* Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={(e) => handleAddPage(topic.id, e)}
                    className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                    title="Add Page to Topic"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Child Pages list */}
              {isExpanded && (
                <div className="pl-6 space-y-0.5 border-l border-[var(--border)] ml-3.5 my-0.5">
                  {topic.pages.map((page) => {
                    const isActive = activePageId === page.id;

                    return (
                      <div
                        key={page.id}
                        onClick={() => setActivePage(page.id, topic.id)}
                        className={`group flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[var(--hover)] text-[var(--foreground)] font-medium'
                            : 'text-[var(--muted-foreground)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-blue-500' : ''
                            }`}
                          />
                          <span className="truncate">{page.title}</span>
                        </div>

                        {/* Hover More Options */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === page.id ? null : page.id);
                            }}
                            className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
