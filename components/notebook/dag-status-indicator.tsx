'use client';

import React from 'react';
import { AlertCircle, RefreshCw, GitFork } from 'lucide-react';

interface DAGStatusIndicatorProps {
  isStale?: boolean;
  dependsOnCount?: number;
  dependentCount?: number;
  onRunDependent?: () => void;
}

export function DAGStatusIndicator({
  isStale = false,
  dependsOnCount = 0,
  dependentCount = 0,
  onRunDependent,
}: DAGStatusIndicatorProps) {
  if (!isStale && dependsOnCount === 0 && dependentCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-md border bg-[var(--sidebar)] transition-all my-1 select-none">
      <div className="flex items-center gap-2">
        {isStale ? (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span>Stale Output — Upstream variable changed</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
            <GitFork className="w-3.5 h-3.5" />
            <span>
              {dependsOnCount > 0 ? `Depends on ${dependsOnCount} block${dependsOnCount > 1 ? 's' : ''}` : ''}
              {dependsOnCount > 0 && dependentCount > 0 ? ' • ' : ''}
              {dependentCount > 0 ? `Used by ${dependentCount} block${dependentCount > 1 ? 's' : ''}` : ''}
            </span>
          </div>
        )}
      </div>

      {isStale && onRunDependent && (
        <button
          onClick={onRunDependent}
          className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
          title="Re-run downstream dependent blocks"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Re-run Block</span>
        </button>
      )}
    </div>
  );
}
