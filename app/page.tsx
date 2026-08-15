'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/notebook/page-header';
import { BlockEditor, BlockItem } from '@/components/notebook/block-editor';
import { useAutoSave } from '@/hooks/use-auto-save';

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

export default function Home() {
  const [blocks, setBlocks] = useState<BlockItem[]>(defaultBlocks);
  const [pageTitle, setPageTitle] = useState('Variables');

  const saveBlocks = useCallback(async (currentBlocks: BlockItem[]) => {
    // In production, sync with /api/pages/[id]/blocks
    console.log('Saving blocks to backend:', currentBlocks);
  }, []);

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
      {/* Page Header Breadcrumbs, Title, Save Status & Explicit Save Button */}
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
      <BlockEditor initialBlocks={blocks} onBlocksChange={(updated) => setBlocks(updated)} />
    </AppShell>
  );
}
