'use client';

import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, Pencil, Trash2, Check } from 'lucide-react';
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
      { id: 'page-variables', title: 'Variables & Data Types' },
      { id: 'page-data-types', title: 'Data Types' },
      { id: 'page-operators', title: 'Operators' },
      { id: 'page-io', title: 'Input & Output' },
    ],
    subtopics: [
      {
        id: 'advanced-fundamentals',
        title: 'Memory & Pointers',
        pages: [
          { id: 'page-garbage-collection', title: 'Garbage Collection' },
          { id: 'page-namespaces', title: 'Namespaces & Scope' },
        ],
      },
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
      { id: 'page-vision', title: 'MediaPipe Vision AI' },
    ],
  },
];

export function TopicTree() {
  const { activePageId, setActivePage, expandedTopicIds, toggleTopicExpand } = useUIStore();
  const [topics, setTopics] = useState<TopicNode[]>(INITIAL_TOPICS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleAddTopic = () => {
    const newTopicId = `topic-${Date.now()}`;
    const newPageId = `page-${Date.now()}`;
    const newTopic: TopicNode = {
      id: newTopicId,
      title: 'New Topic Folder',
      pages: [{ id: newPageId, title: 'Untitled Page' }],
    };

    setTopics([...topics, newTopic]);

    if (!expandedTopicIds[newTopicId]) {
      toggleTopicExpand(newTopicId);
    }
    setActivePage(newPageId, newTopicId, 'Untitled Page', 'New Topic Folder');
  };

  const handleAddPage = (topicId: string, topicTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPageId = `page-${Date.now()}`;
    const newPage = { id: newPageId, title: 'Untitled Page' };

    setTopics(
      topics.map((topic) => {
        if (topic.id === topicId) {
          return { ...topic, pages: [...topic.pages, newPage] };
        }
        return topic;
      })
    );

    if (!expandedTopicIds[topicId]) {
      toggleTopicExpand(topicId);
    }
    setActivePage(newPageId, topicId, 'Untitled Page', topicTitle);
  };

  const handleDeleteTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTopics(topics.filter((t) => t.id !== topicId));
  };

  const handleDeletePage = (topicId: string, pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTopics(
      topics.map((topic) => {
        if (topic.id === topicId) {
          return { ...topic, pages: topic.pages.filter((p) => p.id !== pageId) };
        }
        return topic;
      })
    );
  };

  const startEditing = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingText(currentTitle);
  };

  const saveEditing = (type: 'topic' | 'page', topicId: string, pageId?: string) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }

    if (type === 'topic') {
      setTopics(
        topics.map((t) => (t.id === topicId ? { ...t, title: editingText.trim() } : t))
      );
    } else if (type === 'page' && pageId) {
      setTopics(
        topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              pages: t.pages.map((p) => (p.id === pageId ? { ...p, title: editingText.trim() } : p)),
            };
          }
          return t;
        })
      );
    }
    setEditingId(null);
  };

  const renderTopicNode = (topic: TopicNode, level: number = 0) => {
    const isExpanded = expandedTopicIds[topic.id] ?? false;
    const isEditingTopic = editingId === topic.id;

    return (
      <div key={topic.id} className="space-y-0.5">
        {/* Topic Item Bar */}
        <div
          onClick={() => toggleTopicExpand(topic.id)}
          className="group flex items-center justify-between px-2 py-1 rounded-md hover:bg-[var(--hover)] cursor-pointer text-[var(--foreground)] transition-colors"
          style={{ paddingLeft: `${Math.max(8, level * 16)}px` }}
        >
          <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
            )}
            <Folder className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />

            {isEditingTopic ? (
              <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing('topic', topic.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                  className="w-full bg-[var(--card)] text-[var(--foreground)] border border-blue-500 rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <button
                  onClick={() => saveEditing('topic', topic.id)}
                  className="p-0.5 text-emerald-500 hover:bg-emerald-500/10 rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                onDoubleClick={(e) => startEditing(topic.id, topic.title, e)}
                className="truncate font-medium hover:underline"
                title="Double-click to rename"
              >
                {topic.title}
              </span>
            )}
          </div>

          {/* Hover Actions */}
          {!isEditingTopic && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={(e) => handleAddPage(topic.id, topic.title, e)}
                className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] cursor-pointer"
                title="Add Page File"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => startEditing(topic.id, topic.title, e)}
                className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] cursor-pointer"
                title="Rename Folder"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => handleDeleteTopic(topic.id, e)}
                className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--background)] cursor-pointer"
                title="Delete Folder"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Child Pages & Subtopics list */}
        {isExpanded && (
          <div className="pl-4 space-y-0.5 border-l border-[var(--border)] ml-3.5 my-0.5">
            {/* Render Subtopics Recursively */}
            {topic.subtopics && topic.subtopics.map((sub) => renderTopicNode(sub, level + 1))}

            {/* Render Pages */}
            {topic.pages.map((page) => {
              const isActive = activePageId === page.id;
              const isEditingPage = editingId === page.id;

              return (
                <div
                  key={page.id}
                  onClick={() => setActivePage(page.id, topic.id, page.title, topic.title)}
                  className={`group flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[var(--hover)] text-[var(--foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                    <FileText
                      className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-500' : ''}`}
                    />
                    {isEditingPage ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing('page', topic.id, page.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="w-full bg-[var(--card)] text-[var(--foreground)] border border-blue-500 rounded px-1 py-0.5 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => saveEditing('page', topic.id, page.id)}
                          className="p-0.5 text-emerald-500 hover:bg-emerald-500/10 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onDoubleClick={(e) => startEditing(page.id, page.title, e)}
                        className="truncate"
                        title="Double-click to rename"
                      >
                        {page.title}
                      </span>
                    )}
                  </div>

                  {/* Hover Actions */}
                  {!isEditingPage && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      <button
                        onClick={(e) => startEditing(page.id, page.title, e)}
                        className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                        title="Rename File"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePage(topic.id, page.id, e)}
                        className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-red-500 cursor-pointer"
                        title="Delete File"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1 text-xs select-none">
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-[var(--muted-foreground)] tracking-wider uppercase">
        <span>Notebook Topics</span>
        <button
          onClick={handleAddTopic}
          className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
          title="Add New Topic Folder"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-0.5">{topics.map((topic) => renderTopicNode(topic, 0))}</div>
    </div>
  );
}
