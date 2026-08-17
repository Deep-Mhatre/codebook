'use client';

import React from 'react';
import { Sliders, ChevronDown, Type, MousePointerClick } from 'lucide-react';

export interface UIWidgetData {
  id: string;
  type: 'slider' | 'dropdown' | 'text_input' | 'button';
  label: string;
  value: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

interface UIWidgetRendererProps {
  widgetData: UIWidgetData;
  onWidgetChange?: (widgetId: string, newValue: unknown) => void;
}

export function UIWidgetRenderer({ widgetData, onWidgetChange }: UIWidgetRendererProps) {
  const { id, type, label, value, min = 0, max = 100, step = 1, options = [] } = widgetData;

  const handleChange = (val: unknown) => {
    if (onWidgetChange) {
      onWidgetChange(id, val);
    }
  };

  return (
    <div className="my-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--sidebar)] shadow-xs select-none max-w-md">
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)] mb-2">
        <span className="flex items-center gap-1.5">
          {type === 'slider' && <Sliders className="w-3.5 h-3.5 text-blue-500" />}
          {type === 'dropdown' && <ChevronDown className="w-3.5 h-3.5 text-amber-500" />}
          {type === 'text_input' && <Type className="w-3.5 h-3.5 text-emerald-500" />}
          {type === 'button' && <MousePointerClick className="w-3.5 h-3.5 text-purple-500" />}
          <span>{label}</span>
        </span>
        {type === 'slider' && (
          <span className="px-1.5 py-0.5 font-mono text-[11px] bg-[var(--background)] border border-[var(--border)] rounded text-blue-500 font-bold">
            {String(value)}
          </span>
        )}
      </div>

      {type === 'slider' && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number(value) || 0}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      )}

      {type === 'dropdown' && (
        <select
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--border)]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {type === 'text_input' && (
        <input
          type="text"
          value={String(value || '')}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--border)]"
          placeholder="Enter value..."
        />
      )}

      {type === 'button' && (
        <button
          onClick={() => handleChange(true)}
          className="w-full text-xs px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors cursor-pointer"
        >
          {label}
        </button>
      )}
    </div>
  );
}
