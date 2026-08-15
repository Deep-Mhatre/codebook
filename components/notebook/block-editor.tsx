'use client';

import React, { useState } from 'react';
import { CodeBlock, ExecutionStatus } from './code-block';
import { OutputBlock, OutputItem } from './output/output-block';
import { Plus, Type, Code2, Heading2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export interface BlockItem {
  id: string;
  type: 'heading' | 'text' | 'code' | 'output';
  content: string;
  language?: string;
  executionStatus?: ExecutionStatus;
  outputs?: OutputItem[];
}

interface BlockEditorProps {
  initialBlocks?: BlockItem[];
  pageId?: string;
  onBlocksChange?: (blocks: BlockItem[]) => void;
}

export function BlockEditor({
  initialBlocks = [
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
  ],
  pageId = 'default-page',
  onBlocksChange,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<BlockItem[]>(initialBlocks);
  const [showAddMenuIndex, setShowAddMenuIndex] = useState<number | null>(null);
  const { setWorkspaceFiles } = useUIStore();

  const handleUpdateContent = (id: string, newContent: string) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
    setBlocks(updated);
    if (onBlocksChange) onBlocksChange(updated);
  };

  const handleExecuteCode = async (blockId: string, code: string) => {
    // 1. Mark block status as 'running'
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, executionStatus: 'running' } : b))
    );

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'python', session_id: pageId }),
      });

      const data = await res.json();

      if (data.workspaceFiles) {
        setWorkspaceFiles(data.workspaceFiles);
      }

      if (res.ok && data.outputs) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  executionStatus: 'success',
                  outputs: data.outputs,
                }
              : b
          )
        );
      } else {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  executionStatus: 'error',
                  outputs: [{ type: 'error', content: data.error || 'Execution failed' }],
                }
              : b
          )
        );
      }
    } catch (err: any) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                executionStatus: 'error',
                outputs: [{ type: 'error', content: err.message || 'Network error' }],
              }
            : b
        )
      );
    }
  };

  const handleAddBlock = (index: number, type: 'text' | 'heading' | 'code') => {
    const newBlock: BlockItem = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'code' ? 'print("New code snippet")' : '',
      language: type === 'code' ? 'python' : undefined,
      executionStatus: type === 'code' ? 'idle' : undefined,
      outputs: [],
    };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setShowAddMenuIndex(null);
    if (onBlocksChange) onBlocksChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="group relative">
          {/* Heading Block */}
          {block.type === 'heading' && (
            <h3
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdateContent(block.id, e.currentTarget.textContent || '')}
              className="text-xl font-semibold tracking-tight text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--border)] rounded px-1 -ml-1 py-1"
            >
              {block.content}
            </h3>
          )}

          {/* Text Block */}
          {block.type === 'text' && (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdateContent(block.id, e.currentTarget.textContent || '')}
              className="text-sm leading-relaxed text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--border)] rounded px-1 -ml-1 py-1"
            >
              {block.content}
            </p>
          )}

          {/* Monaco Code Block */}
          {block.type === 'code' && (
            <div className="space-y-2">
              <CodeBlock
                id={block.id}
                initialCode={block.content}
                language={block.language || 'python'}
                status={block.executionStatus || 'idle'}
                onCodeChange={(code) => handleUpdateContent(block.id, code)}
                onRunCode={(code) => handleExecuteCode(block.id, code)}
              />

              {/* Render Block Outputs */}
              {block.outputs && block.outputs.length > 0 && (
                <OutputBlock outputs={block.outputs} />
              )}
            </div>
          )}

          {/* Inline Add Block Handle (+) */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center my-1 transition-opacity">
            <button
              onClick={() => setShowAddMenuIndex(showAddMenuIndex === index ? null : index)}
              className="p-1 rounded-full bg-[var(--sidebar)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="Add block"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Block Options Menu */}
          {showAddMenuIndex === index && (
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg my-2 text-xs">
              <button
                onClick={() => handleAddBlock(index, 'text')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[var(--hover)] text-[var(--foreground)]"
              >
                <Type className="w-3.5 h-3.5 text-blue-500" />
                <span>Text</span>
              </button>
              <button
                onClick={() => handleAddBlock(index, 'heading')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[var(--hover)] text-[var(--foreground)]"
              >
                <Heading2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Heading</span>
              </button>
              <button
                onClick={() => handleAddBlock(index, 'code')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[var(--hover)] text-[var(--foreground)]"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Code Block</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
