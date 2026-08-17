'use client';

import React, { useState, useRef, useMemo } from 'react';
import { CodeBlock, ExecutionStatus } from './code-block';
import { OutputBlock, OutputItem } from './output/output-block';
import { MediaPermissionBanner } from '../media/media-permission-banner';
import { captureCameraFrame, recordMicrophoneAudio, streamCameraFrames, streamMicrophoneAudio } from '@/lib/media/media-bridge';
import { StreamCanvasOutput } from './output/stream-canvas-output';
import { AudioWaveformOutput } from './output/audio-waveform-output';
import { DAGStatusIndicator } from './dag-status-indicator';
import { Plus, Type, Code2, Heading2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

import { routeAndExecuteCode } from '@/lib/engine/execution-router';
import { buildPageDAG, getStaleBlockIds } from '@/lib/engine/dag-analyzer';

export interface BlockItem {
  id: string;
  type: 'heading' | 'text' | 'code' | 'output';
  content: string;
  language?: string;
  executionStatus?: ExecutionStatus;
  executionEngine?: 'WASM_PYODIDE' | 'CLOUD_DOCKER';
  outputs?: OutputItem[];
  mediaRequest?: { type: 'camera' | 'microphone'; duration?: number } | null;
  streamingFrame?: string | null;
  isAudioStreaming?: boolean;
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
  const [staleBlockIds, setStaleBlockIds] = useState<Set<string>>(new Set());
  const { setWorkspaceFiles, setCameraStreaming, setAudioStreaming, setStopStreamCallback } = useUIStore();
  const activeStreamCleanupRef = useRef<(() => void) | null>(null);

  const dagNodes = useMemo(() => {
    const codeBlocks = blocks.filter((b) => b.type === 'code').map((b) => ({ id: b.id, code: b.content }));
    return buildPageDAG(codeBlocks);
  }, [blocks]);

  const handleUpdateContent = (id: string, newContent: string) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
    setBlocks(updated);

    const staleDeps = getStaleBlockIds(id, dagNodes);
    if (staleDeps.size > 0) {
      setStaleBlockIds((prev) => new Set([...prev, ...staleDeps]));
    }

    if (onBlocksChange) onBlocksChange(updated);
  };

  const handleStopStream = () => {
    if (activeStreamCleanupRef.current) {
      activeStreamCleanupRef.current();
      activeStreamCleanupRef.current = null;
    }
    setCameraStreaming(false);
    setAudioStreaming(false);
    setStopStreamCallback(null);
    setBlocks((prev) => prev.map((b) => ({ ...b, isAudioStreaming: false })));
  };

  const handleExecuteCode = async (blockId: string, code: string) => {
    handleStopStream();
    setStaleBlockIds((prev) => {
      const next = new Set(prev);
      next.delete(blockId);
      return next;
    });

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              executionStatus: 'running',
              outputs: [],
              mediaRequest: null,
              streamingFrame: null,
              isAudioStreaming: false,
            }
          : b
      )
    );

    const executeCloudDocker = async () => {
      const wsUrl = `ws://127.0.0.1:8000/ws/execute/${pageId}`;
      let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(wsUrl);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('WS timeout')), 5000);
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
            setBlocks((prev) =>
              prev.map((b) => (b.id === blockId ? { ...b, mediaRequest: { type: 'camera' } } : b))
            );

            const res = await captureCameraFrame();

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
          } else if (msg.type === 'camera_stream_start') {
            const fps = msg.fps || 30;
            setCameraStreaming(true);

            const stopStream = streamCameraFrames(
              fps,
              (frameDataUrl) => {
                setBlocks((prev) =>
                  prev.map((b) => (b.id === blockId ? { ...b, streamingFrame: frameDataUrl } : b))
                );
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({
                      type: 'camera_stream_frame',
                      session_id: pageId,
                      image_data: frameDataUrl,
                    })
                  );
                }
              }
            );

            activeStreamCleanupRef.current = stopStream;
            setStopStreamCallback(handleStopStream);
          } else if (msg.type === 'microphone_request') {
            const duration = msg.duration || 5.0;

            setBlocks((prev) =>
              prev.map((b) =>
                b.id === blockId ? { ...b, mediaRequest: { type: 'microphone', duration } } : b
              )
            );

            const res = await recordMicrophoneAudio(duration);

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
          } else if (msg.type === 'microphone_stream_start') {
            const chunkSeconds = msg.chunk_seconds || 0.1;
            setAudioStreaming(true);

            setBlocks((prev) =>
              prev.map((b) => (b.id === blockId ? { ...b, isAudioStreaming: true } : b))
            );

            const stopAudioStream = streamMicrophoneAudio(
              chunkSeconds,
              (audioDataUrl, sampleRate) => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({
                      type: 'microphone_stream_chunk',
                      session_id: pageId,
                      audio_data: audioDataUrl,
                      sample_rate: sampleRate,
                    })
                  );
                }
              }
            );

            activeStreamCleanupRef.current = stopAudioStream;
            setStopStreamCallback(handleStopStream);
          } else if (msg.type === 'execution_result') {
            handleStopStream();
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
                        executionEngine: 'CLOUD_DOCKER',
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
                        executionEngine: 'CLOUD_DOCKER',
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

      socket.send(JSON.stringify({ type: 'execute', code, timeout: 35 }));
      return;
    } catch (wsErr) {
      console.warn('WebSocket execution failed, using HTTP POST fallback:', wsErr);
      if (socket) socket.close();
    }

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
                  executionEngine: 'CLOUD_DOCKER',
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
                  executionEngine: 'CLOUD_DOCKER',
                  outputs: [{ type: 'error', content: data.error || 'Execution failed' }],
                  mediaRequest: null,
                }
              : b
          )
        );
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                executionStatus: 'error',
                outputs: [{ type: 'error', content: errorObj?.message || 'Network error' }],
                mediaRequest: null,
              }
            : b
        )
      );
    }
  };

    const routeRes = await routeAndExecuteCode({
      code,
      pageId,
      executeCloudDocker,
    });

    if (routeRes.handledLocally && routeRes.result) {
      const wasmRes = routeRes.result;
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                executionStatus: wasmRes.status === 'success' ? 'success' : 'error',
                executionEngine: 'WASM_PYODIDE',
                outputs: wasmRes.outputs,
                mediaRequest: null,
              }
            : b
        )
      );
    }
  };

  const handleWidgetChange = (blockId: string, widgetId: string, newValue: unknown) => {
    const targetBlock = blocks.find((b) => b.id === blockId);
    if (targetBlock && targetBlock.type === 'code') {
      const envPattern = new RegExp(`# CodeBook UI Widget State\\s*import os\\s*os\\.environ\\["CODEBOOK_UI_${widgetId}"\\] = [^\\n]+\\n*`, 'g');
      const cleanCode = targetBlock.content.replace(envPattern, '');
      const envPrefix = `# CodeBook UI Widget State\nimport os\nos.environ["CODEBOOK_UI_${widgetId}"] = ${JSON.stringify(String(newValue))}\n\n`;
      const updatedCode = envPrefix + cleanCode;

      handleUpdateContent(blockId, updatedCode);
      handleExecuteCode(blockId, updatedCode);
    }
  };

  const handleAddBlock = (index: number, type: 'text' | 'heading' | 'code') => {
    const newBlock: BlockItem = {
      id: `block_${index}_${blocks.length + 1}`,
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

          {block.type === 'code' && (
            <div className="space-y-2">
              <DAGStatusIndicator
                isStale={staleBlockIds.has(block.id)}
                dependsOnCount={dagNodes.get(block.id)?.dependsOnBlockIds.length || 0}
                dependentCount={dagNodes.get(block.id)?.dependentBlockIds.length || 0}
                onRunDependent={() => handleExecuteCode(block.id, block.content)}
              />

              <MediaPermissionBanner
                type={block.mediaRequest?.type || null}
                duration={block.mediaRequest?.duration}
              />

              {block.streamingFrame && (
                <StreamCanvasOutput
                  currentFrame={block.streamingFrame}
                  fps={30}
                  onStopStream={handleStopStream}
                />
              )}

              {block.isAudioStreaming && (
                <AudioWaveformOutput
                  isStreaming={block.isAudioStreaming}
                  onStopStream={handleStopStream}
                />
              )}

              <CodeBlock
                id={block.id}
                initialCode={block.content}
                language={block.language || 'python'}
                status={block.executionStatus || 'idle'}
                executionEngine={block.executionEngine}
                onCodeChange={(code) => handleUpdateContent(block.id, code)}
                onRunCode={(code) => handleExecuteCode(block.id, code)}
              />

              {block.outputs && block.outputs.length > 0 && (
                <OutputBlock
                  outputs={block.outputs}
                  onWidgetChange={(wId, val) => handleWidgetChange(block.id, wId, val)}
                />
              )}
            </div>
          )}

          <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center my-1 transition-opacity">
            <button
              onClick={() => setShowAddMenuIndex(showAddMenuIndex === index ? null : index)}
              className="p-1 rounded-full bg-[var(--sidebar)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="Add block"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

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
