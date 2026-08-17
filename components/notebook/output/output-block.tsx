'use client';

import React from 'react';
import { TextOutput } from './text-output';
import { ErrorOutput } from './error-output';
import { TableOutput, TableData } from './table-output';
import { ImageOutput } from './image-output';
import { PlotlyOutputRenderer, HTMLOutputRenderer, WebGLOutputRenderer } from './interactive-output';
import { UIWidgetRenderer, UIWidgetData } from '../widgets/ui-widget-renderer';
import { ExecutionTimeline, TraceStep } from '../debugger/execution-timeline';

export type OutputType = 'text' | 'error' | 'table' | 'image' | 'plotly' | 'html' | 'webgl' | 'widget' | 'trace';

export interface OutputItem {
  type: OutputType;
  content?: string;
  tableData?: TableData;
  imageUrl?: string;
  spec?: Record<string, unknown>;
  data?: Record<string, unknown>;
  widgetData?: UIWidgetData;
  traceData?: TraceStep[];
}

interface OutputBlockProps {
  outputs: OutputItem[];
  onWidgetChange?: (widgetId: string, newValue: unknown) => void;
  onTraceStepSelect?: (step: number, line: number) => void;
}

export function OutputBlock({ outputs, onWidgetChange, onTraceStepSelect }: OutputBlockProps) {
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
            {out.type === 'plotly' && out.spec && <PlotlyOutputRenderer spec={out.spec} />}
            {out.type === 'html' && out.content && <HTMLOutputRenderer content={out.content} />}
            {out.type === 'webgl' && out.data && <WebGLOutputRenderer data={out.data} />}
            {out.type === 'widget' && out.widgetData && (
              <UIWidgetRenderer widgetData={out.widgetData} onWidgetChange={onWidgetChange} />
            )}
            {out.type === 'trace' && out.traceData && (
              <ExecutionTimeline traceData={out.traceData} onStepSelect={onTraceStepSelect} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
