'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorOutputProps {
  content: string;
}

export function ErrorOutput({ content }: ErrorOutputProps) {
  return (
    <div className="p-3.5 rounded-md border border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400 font-mono text-xs leading-relaxed space-y-1.5 select-text">
      <div className="flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Execution Error</span>
      </div>
      <div className="whitespace-pre-wrap pl-6">{content}</div>
    </div>
  );
}
