'use client';

import React from 'react';
import { TextOutput } from './text-output';
import { ErrorOutput } from './error-output';
import { TableOutput, TableData } from './table-output';
import { ImageOutput } from './image-output';

export type OutputType = 'text' | 'error' | 'table' | 'image';

export interface OutputItem {
  type: OutputType;
  content?: string;
  tableData?: TableData;
  imageUrl?: string;
}

interface OutputBlockProps {
  outputs: OutputItem[];
}

export function OutputBlock({ outputs }: OutputBlockProps) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1">
        Output
      </div>

      <div className="space-y-3">
        {outputs.map((out, idx) => (
          <div key={idx}>
            {out.type === 'text' && out.content && <TextOutput content={out.content} />}
            {out.type === 'error' && out.content && <ErrorOutput content={out.content} />}
            {out.type === 'table' && out.tableData && <TableOutput data={out.tableData} />}
            {out.type === 'image' && out.imageUrl && <ImageOutput src={out.imageUrl} />}
          </div>
        ))}
      </div>
    </div>
  );
}
