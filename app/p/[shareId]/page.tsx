'use client';

import React, { useState } from 'react';
import { OutputBlock, OutputItem } from '@/components/notebook/output/output-block';
import { Code2, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PublishedPageProps {
  params: Promise<{ shareId: string }>;
}

export default function PublishedAppPage({ params }: PublishedPageProps) {
  const resolvedParams = React.use(params);
  const shareId = resolvedParams.shareId;
  const [showCode, setShowCode] = useState(false);

  // Demo / Published Page State
  const pageTitle = shareId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const demoBlocks = [
    {
      id: 'p-1',
      type: 'heading',
      content: 'Interactive Data Explorer',
    },
    {
      id: 'p-2',
      type: 'text',
      content: 'Adjust the controls below to dynamically update the visualization.',
    },
    {
      id: 'p-3',
      type: 'code',
      content: `import codebook as cb
import numpy as np

rate = cb.ui.slider(min=0.001, max=0.1, default=0.01, label="Learning Rate")
dataset = cb.ui.dropdown(["Iris", "MNIST", "Housing"], label="Select Dataset")

print(f"Loaded dataset {dataset} with learning rate {rate}")`,
      outputs: [
        {
          type: 'widget',
          widgetData: {
            id: 'slider_learning_rate',
            type: 'slider',
            label: 'Learning Rate',
            min: 0.001,
            max: 0.1,
            step: 0.005,
            value: 0.01,
          },
        },
        {
          type: 'widget',
          widgetData: {
            id: 'dropdown_select_dataset',
            type: 'dropdown',
            label: 'Select Dataset',
            options: ['Iris', 'MNIST', 'Housing'],
            value: 'Iris',
          },
        },
        {
          type: 'text',
          content: 'Loaded dataset Iris with learning rate 0.01',
        },
      ] as OutputItem[],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      {/* Top App Bar Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/landing"
            className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CodeBook</span>
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-xs font-semibold">{pageTitle}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Published App
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--border)] bg-[var(--sidebar)] hover:bg-[var(--hover)] text-[var(--foreground)] rounded-md font-medium transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showCode ? 'Hide Code' : 'View Code'}</span>
          </button>
          <Link
            href="/notebook"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 rounded-md font-medium transition-opacity cursor-pointer"
          >
            <span>Open in CodeBook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Published App Canvas */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-2 border-b border-[var(--border)] pb-6">
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Interactive Python Micro-App • Powered by CodeBook Engine
          </p>
        </div>

        <div className="space-y-6">
          {demoBlocks.map((block) => (
            <div key={block.id} className="space-y-3">
              {block.type === 'heading' && (
                <h2 className="text-xl font-semibold tracking-tight">{block.content}</h2>
              )}

              {block.type === 'text' && (
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {block.content}
                </p>
              )}

              {block.type === 'code' && (
                <div className="space-y-3">
                  {showCode && (
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--sidebar)] font-mono text-xs overflow-x-auto whitespace-pre">
                      {block.content}
                    </div>
                  )}

                  {block.outputs && block.outputs.length > 0 && (
                    <OutputBlock outputs={block.outputs} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted-foreground)]">
        Built & Published with <span className="font-semibold text-[var(--foreground)]">CodeBook</span> — The Executable Coding Notebook
      </footer>
    </div>
  );
}
