'use client';

import React, { useState } from 'react';
import { Zap, X, Play, BookmarkPlus, Check } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import Editor from '@monaco-editor/react';

export function Scratchpad() {
  const { isScratchpadOpen, setScratchpadOpen } = useUIStore();
  const [code, setCode] = useState('numbers = [1, 2, 3, 4, 5]\nprint(f"Sum: {sum(numbers)}")');
  const [output, setOutput] = useState<string | null>('Sum: 15');
  const [saved, setSaved] = useState(false);

  if (!isScratchpadOpen) return null;

  const handleRun = () => {
    setOutput('Running Scratchpad...');
    setTimeout(() => {
      setOutput(`Output:\nSum: 15\n(Executed at ${new Date().toLocaleTimeString()})`);
    }, 400);
  };

  const handleSaveToNotebook = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[var(--card)] text-[var(--card-foreground)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Scratchpad Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span>⚡ Scratchpad (Temporary Sandbox)</span>
        </div>
        <button
          onClick={() => setScratchpadOpen(false)}
          className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Section */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="text-xs text-[var(--muted-foreground)]">
          Experiment with Python code snippets here without cluttering your permanent notebook pages.
        </div>

        {/* Monaco Sandbox Editor */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--code-bg)] overflow-hidden">
          <div className="px-3 py-1.5 border-b border-[var(--border)] bg-[var(--sidebar)] text-[11px] text-[var(--muted-foreground)] font-mono">
            scratchpad.py
          </div>
          <Editor
            height="180px"
            language="python"
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Experiment</span>
          </button>

          <button
            onClick={handleSaveToNotebook}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] bg-[var(--sidebar)] hover:bg-[var(--hover)] text-xs font-medium rounded-md transition-colors cursor-pointer text-[var(--foreground)]"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Saved to Notebook!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to Notebook</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        {output && (
          <div className="space-y-1.5 pt-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Scratchpad Output
            </div>
            <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--code-bg)] font-mono text-xs text-[var(--foreground)] whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
