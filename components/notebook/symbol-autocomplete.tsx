'use client';

import React from 'react';
import { Code2, Box, Variable, Sparkles } from 'lucide-react';
import { ParsedSymbol } from '@/lib/parser/python-ast';

interface SymbolAutocompleteProps {
  symbols: ParsedSymbol[];
  onSelectSymbol: (symbol: ParsedSymbol) => void;
  onClose: () => void;
}

export function SymbolAutocomplete({ symbols, onSelectSymbol, onClose }: SymbolAutocompleteProps) {
  if (!symbols || symbols.length === 0) return null;

  return (
    <div className="absolute z-50 mt-1 w-72 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl p-1 select-none text-xs">
      <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-[var(--muted-foreground)] border-b border-[var(--border)] mb-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span>Workspace Symbols</span>
        </span>
        <button onClick={onClose} className="hover:text-[var(--foreground)]">✕</button>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {symbols.map((sym, idx) => (
          <div
            key={`${sym.name}_${idx}`}
            onClick={() => onSelectSymbol(sym)}
            className="px-2.5 py-1.5 rounded hover:bg-[var(--hover)] cursor-pointer flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-2 truncate">
              {sym.type === 'function' && <Code2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
              {sym.type === 'class' && <Box className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
              {sym.type === 'variable' && <Variable className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              <span className="font-mono font-medium text-[var(--foreground)] truncate">{sym.name}</span>
            </div>

            <span className="text-[10px] font-mono text-[var(--muted-foreground)] opacity-70 group-hover:opacity-100 shrink-0">
              {sym.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
