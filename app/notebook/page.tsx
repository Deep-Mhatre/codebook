'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/notebook/page-header';
import { BlockEditor, BlockItem } from '@/components/notebook/block-editor';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useUIStore } from '@/lib/store/ui-store';

const defaultBlocks: BlockItem[] = [
  {
    id: 'block-1',
    type: 'text',
    content: 'A variable stores a value that can be referenced and manipulated later in your Python code.',
  },
  {
    id: 'block-2',
    type: 'heading',
    content: 'Basic Example',
  },
  {
    id: 'block-3',
    type: 'code',
    content: 'name = "Ghost"\nage = 22\n\nprint(f"User: {name}")\nprint(f"Age: {age}")',
    language: 'python',
    executionStatus: 'idle',
    outputs: [
      { type: 'text', content: 'User: Ghost\nAge: 22' },
    ],
  },
];

export default function NotebookPage() {
  const { activePageId } = useUIStore();
  const pageId = activePageId || 'page-variables';
  const [blocks, setBlocks] = useState<BlockItem[]>(defaultBlocks);
  const [pageTitle, setPageTitle] = useState('Variables & Data Types');

  // Load page blocks from backend API when active page changes
  useEffect(() => {
    async function fetchPageBlocks() {
      try {
        const res = await fetch(`/api/pages/${pageId}/blocks`);
        if (res.ok) {
          const data = await res.json();
          if (data.blocks && data.blocks.length > 0) {
            setBlocks(
              data.blocks.map((b: any) => ({
                id: b.id,
                type: b.type,
                content: b.content,
                language: b.language || 'python',
                executionStatus: 'idle',
                outputs: [],
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Using default fallback blocks:', err);
      }
    }
    fetchPageBlocks();
  }, [pageId]);

  // Sync edited blocks with backend API
  const saveBlocks = useCallback(async (currentBlocks: BlockItem[]) => {
    try {
      await fetch(`/api/pages/${pageId}/blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: currentBlocks.map((b, index) => ({
            type: b.type,
            content: b.content,
            language: b.language || 'python',
            position: index,
          })),
        }),
      });
    } catch (err) {
      console.warn('Save blocks warning:', err);
    }
  }, [pageId]);

  const { isSaving, isDirty, saveNow } = useAutoSave({
    data: blocks,
    onSave: saveBlocks,
    delay: 2000,
  });

  // Global ⌘S / Ctrl+S keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveNow]);

  return (
    <AppShell>
      {/* Page Header Breadcrumbs, Title, Workspace Files, Save Status & Explicit Save Button */}
      <PageHeader
        notebookName="Python"
        topicTitle="Fundamentals"
        pageTitle={pageTitle}
        onTitleChange={(title) => setPageTitle(title)}
        lastEdited="Last edited just now"
        isSaving={isSaving}
        isDirty={isDirty}
        onSave={saveNow}
      />

      {/* Main Block Canvas */}
      <BlockEditor
        pageId={pageId}
        initialBlocks={blocks}
        onBlocksChange={(updated) => setBlocks(updated)}
      />
    </AppShell>
  );
}
