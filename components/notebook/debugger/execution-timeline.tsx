'use client';

import React, { useState } from 'react';
import { SkipBack, SkipForward, Bug, Variable } from 'lucide-react';

export interface TraceStep {
  step: number;
  line: number;
  locals: Record<string, unknown>;
}

interface ExecutionTimelineProps {
  traceData: TraceStep[];
  onStepSelect?: (step: number, line: number) => void;
}

export function ExecutionTimeline({ traceData, onStepSelect }: ExecutionTimelineProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!traceData || traceData.length === 0) return null;

  const currentFrame = traceData[currentStepIdx] || traceData[0];
  const prevFrame = currentStepIdx > 0 ? traceData[currentStepIdx - 1] : null;

  const handleStepChange = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(traceData.length - 1, newIdx));
    setCurrentStepIdx(clamped);
    if (onStepSelect && traceData[clamped]) {
      onStepSelect(clamped + 1, traceData[clamped].line);
    }
  };

  return (
    <div className="my-3 p-3 rounded-lg border border-purple-500/30 bg-purple-950/10 dark:bg-purple-950/20 space-y-3 select-none">
      {/* Time-Travel Debugger Header */}
      <div className="flex items-center justify-between text-xs border-b border-purple-500/20 pb-2">
        <div className="flex items-center gap-2 text-purple-400 font-semibold">
          <Bug className="w-4 h-4 text-purple-400" />
          <span>Visual Time-Travel Debugger</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepChange(currentStepIdx - 1)}
            disabled={currentStepIdx === 0}
            className="p-1 rounded hover:bg-purple-500/20 text-purple-300 disabled:opacity-30 cursor-pointer"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-2 py-0.5 bg-purple-900/30 rounded border border-purple-500/30 text-purple-300">
            Step {currentStepIdx + 1} / {traceData.length} (Line {currentFrame.line})
          </span>
          <button
            onClick={() => handleStepChange(currentStepIdx + 1)}
            disabled={currentStepIdx === traceData.length - 1}
            className="p-1 rounded hover:bg-purple-500/20 text-purple-300 disabled:opacity-30 cursor-pointer"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step Timeline Range Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={traceData.length - 1}
          value={currentStepIdx}
          onChange={(e) => handleStepChange(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-purple-950/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Local Variable Mutation & Inspection Matrix */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
          <Variable className="w-3.5 h-3.5" />
          <span>Active Variable State</span>
        </div>

        {Object.keys(currentFrame.locals).length === 0 ? (
          <div className="text-xs text-[var(--muted-foreground)] italic px-2 py-1">
            No local variables in scope at line {currentFrame.line}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(currentFrame.locals).map(([key, val]) => {
              const prevVal = prevFrame?.locals?.[key];
              const isChanged = prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(val);

              return (
                <div
                  key={key}
                  className={`p-2 rounded border transition-colors flex items-center justify-between ${
                    isChanged
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-[var(--sidebar)] border-[var(--border)] text-[var(--foreground)]'
                  }`}
                >
                  <span className="font-semibold text-purple-400">{key}:</span>
                  <span className="truncate max-w-[180px]" title={JSON.stringify(val)}>
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
