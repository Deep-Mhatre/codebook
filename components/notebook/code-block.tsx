'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Copy, Check, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

interface CodeBlockProps {
  id?: string;
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onRunCode?: (code: string) => void;
  status?: ExecutionStatus;
  executionEngine?: 'WASM_PYODIDE' | 'CLOUD_DOCKER';
}

export function CodeBlock({
  initialCode = 'print("Hello CodeBook")',
  language = 'python',
  onCodeChange,
  onRunCode,
  status = 'idle',
  executionEngine,
}: CodeBlockProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    const updated = value || '';
    setCode(updated);
    if (onCodeChange) {
      onCodeChange(updated);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (onRunCode) {
      onRunCode(code);
    }
  };

  // Keyboard shortcut listener inside Monaco Editor: Ctrl/Cmd + Enter
  const handleEditorMount = (editor: { addCommand: (key: number, handler: () => void) => void }, monaco: { KeyMod: { CtrlCmd: number }, KeyCode: { Enter: number } }) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };

  return (
    <div className="my-4 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] overflow-hidden transition-all duration-150">
      {/* Code Block Header */}
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--sidebar)] flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--foreground)] uppercase text-[11px] tracking-wider">
            {language}
          </span>
          {executionEngine === 'WASM_PYODIDE' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span>⚡</span> Wasm (Sub-10ms)
            </span>
          )}
          {executionEngine === 'CLOUD_DOCKER' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <span>☁️</span> Cloud Docker
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <button
            onClick={handleCopy}
            className="p-1 hover:text-[var(--foreground)] transition-colors rounded cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="py-2">
        <Editor
          height="140px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
            renderLineHighlight: 'none',
            folding: true,
            tabSize: 4,
          }}
        />
      </div>

      {/* Block Footer Toolbar */}
      <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--sidebar)] flex items-center justify-between text-xs">
        <div className="text-[11px] text-[var(--muted-foreground)] hidden sm:block">
          Press <kbd className="px-1 py-0.5 font-mono text-[10px] bg-[var(--background)] border border-[var(--border)] rounded">⌘ + Enter</kbd> to run
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {status === 'running' && (
            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium rounded-md cursor-not-allowed"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </button>
          )}

          {status === 'success' && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>
          )}

          {status === 'error' && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Error — Re-run</span>
            </button>
          )}

          {status === 'idle' && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
