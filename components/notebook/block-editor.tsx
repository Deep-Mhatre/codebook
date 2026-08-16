'use client';

import React, { useState } from 'react';
import { CodeBlock, ExecutionStatus } from './code-block';
import { OutputBlock, OutputItem } from './output/output-block';
import { MediaPermissionBanner } from '../media/media-permission-banner';
import { captureCameraFrame, recordMicrophoneAudio } from '@/lib/media/media-bridge';
import { Plus, Type, Code2, Heading2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export interface BlockItem {
  id: string;
  type: 'heading' | 'text' | 'code' | 'output';
  content: string;
  language?: string;
  executionStatus?: ExecutionStatus;
  outputs?: OutputItem[];
  mediaRequest?: { type: 'camera' | 'microphone'; duration?: number } | null;
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
    // 1. Mark block status as 'running' & clear previous media banners
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, executionStatus: 'running', mediaRequest: null } : b))
    );

    // Attempt interactive WebSocket execution for camera & microphone support
    const wsUrl = `ws://localhost:8000/ws/execute/${pageId}`;
    let socket: WebSocket | null = null;
    let wsSuccess = false;

    try {
      socket = new WebSocket(wsUrl);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('WS timeout')), 1500);
        socket!.onopen = () => {
          clearTimeout(timeout);
          resolve();
        };
        socket!.onerror = (e) => {
          clearTimeout(timeout);
          reject(e);
        };
      });

      socket.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'camera_request') {
            // Show Camera Banner UI
            setBlocks((prev) =>
              prev.map((b) => (b.id === blockId ? { ...b, mediaRequest: { type: 'camera' } } : b))
            );

            // Capture camera frame from browser
            const res = await captureCameraFrame();

            // Clear Camera Banner UI
            setBlocks((prev) =>
              prev.map((b) => (b.id === blockId ? { ...b, mediaRequest: null } : b))
            );

            if (res.error) {
              socket?.send(
                JSON.stringify({
                  type: 'camera_response',
                  session_id: pageId,
                  status: 'error',
                  error_type: res.error.errorType,
                  message: res.error.message,
                })
              );
            } else {
              socket?.send(
                JSON.stringify({
                  type: 'camera_response',
                  session_id: pageId,
                  status: 'success',
                  image_data: res.dataUrl,
                })
              );
            }
          } else if (msg.type === 'microphone_request') {
            const duration = msg.duration || 5.0;

            // Show Microphone Banner UI
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === blockId ? { ...b, mediaRequest: { type: 'microphone', duration } } : b
              )
            );

            // Record audio from browser microphone
            const res = await recordMicrophoneAudio(duration);

            // Clear Microphone Banner UI
            setBlocks((prev) =>
              prev.map((b) => (b.id === blockId ? { ...b, mediaRequest: null } : b))
            );

            if (res.error) {
              socket?.send(
                JSON.stringify({
                  type: 'microphone_response',
                  session_id: pageId,
                  status: 'error',
                  error_type: res.error.errorType,
                  message: res.error.message,
                })
              );
            } else {
              socket?.send(
                JSON.stringify({
                  type: 'microphone_response',
                  session_id: pageId,
                  status: 'success',
                  audio_data: res.dataUrl,
                  sample_rate: res.sampleRate,
                })
              );
            }
          } else if (msg.type === 'execution_result') {
            wsSuccess = true;
            const data = msg.data;
            if (data.workspaceFiles) {
              setWorkspaceFiles(data.workspaceFiles);
            }

            if (data.status === 'success' && data.outputs) {
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === blockId
                    ? {
                        ...b,
                        executionStatus: 'success',
                        outputs: data.outputs,
                        mediaRequest: null,
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
                        outputs: data.outputs || [{ type: 'error', content: data.error || 'Execution failed' }],
                        mediaRequest: null,
                      }
                    : b
                )
              );
            }
            socket?.close();
          }
        } catch (err) {
          console.warn('WebSocket message error:', err);
        }
      };

      // Start execution over WebSocket
      socket.send(JSON.stringify({ type: 'execute', code, timeout: 35 }));
      return;
    } catch (wsErr) {
      console.warn('WebSocket execution failed, using HTTP POST fallback:', wsErr);
      if (socket) socket.close();
    }

    // Fallback HTTP POST execution handler
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
                  mediaRequest: null,
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
                  mediaRequest: null,
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
                mediaRequest: null,
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
              <MediaPermissionBanner
                type={block.mediaRequest?.type || null}
                duration={block.mediaRequest?.duration}
              />

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
