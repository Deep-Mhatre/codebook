'use client';

import React from 'react';

interface TextOutputProps {
  content: string;
}

export function TextOutput({ content }: TextOutputProps) {
  return (
    <div className="font-mono text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-wrap select-text">
      {content}
    </div>
  );
}
