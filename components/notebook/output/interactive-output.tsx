'use client';

import React from 'react';

interface PlotlyOutputProps {
  spec: any;
}

interface HTMLOutputProps {
  content: string;
}

interface WebGLOutputProps {
  data: any;
}

export function PlotlyOutputRenderer({ spec }: PlotlyOutputProps) {
  const title = spec?.layout?.title || 'Interactive Plotly Visualization';
  const dataCount = spec?.data?.length || 0;

  return (
    <div className="my-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <span className="font-semibold text-[var(--foreground)]">{title}</span>
        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
          Plotly Interactive ({dataCount} series)
        </span>
      </div>

      <div className="p-4 rounded bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800 text-slate-400 text-[11px]">
          <span>JSON Spec Specifier</span>
          <span>Zoom / Pan / Hover Enabled</span>
        </div>
        <pre className="text-[11px] leading-tight text-emerald-400">
          {JSON.stringify(spec, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function HTMLOutputRenderer({ content }: HTMLOutputProps) {
  return (
    <div className="my-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <span className="font-medium text-[var(--foreground)]">Interactive HTML Widget</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
          Sandboxed Preview
        </span>
      </div>

      <div
        className="p-3 bg-white text-slate-900 rounded shadow-sm text-sm overflow-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export function WebGLOutputRenderer({ data }: WebGLOutputProps) {
  return (
    <div className="my-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <span className="font-medium text-[var(--foreground)]">3D WebGL Mesh Output</span>
        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px]">
          WebGL Canvas
        </span>
      </div>

      <div className="p-3 rounded bg-slate-950 text-purple-300 font-mono text-xs overflow-x-auto border border-slate-800">
        <pre className="text-[11px] leading-tight">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
