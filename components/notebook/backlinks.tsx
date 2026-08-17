'use client';

import React from 'react';
import { Link2, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface BacklinkItem {
  id: string;
  title: string;
  notebookName?: string;
  topicTitle?: string;
  snippet?: string;
}

interface BacklinksProps {
  backlinks?: BacklinkItem[];
}

export function Backlinks({ backlinks = [] }: BacklinksProps) {
  if (!backlinks || backlinks.length === 0) return null;

  return (
    <div className="mt-12 pt-6 border-t border-[var(--border)] space-y-3 select-none">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
        <Link2 className="w-3.5 h-3.5 text-blue-500" />
        <span>Backlinks ({backlinks.length}) — Pages linking here</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {backlinks.map((item) => (
          <Link
            key={item.id}
            href={`/notebook?page=${item.id}`}
            className="p-3 rounded-lg border border-[var(--border)] bg-[var(--sidebar)] hover:border-[var(--foreground)]/30 transition-all flex items-start justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] group-hover:text-blue-500 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                <span>{item.title}</span>
              </div>
              {item.snippet && (
                <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 italic">
                  &quot;{item.snippet}&quot;
                </p>
              )}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
