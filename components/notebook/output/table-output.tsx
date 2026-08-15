'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpDown } from 'lucide-react';

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface TableOutputProps {
  data: TableData;
}

export function TableOutput({ data }: TableOutputProps) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colIndex);
      setSortAsc(true);
    }
  };

  const sortedRows = React.useMemo(() => {
    if (sortCol === null) return data.rows;
    return [...data.rows].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data.rows, sortCol, sortAsc]);

  const handleCopyCSV = () => {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map((row) => row.join(',')),
    ].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 select-text">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
        <span>DataFrame preview ({data.rows.length} rows)</span>
        <button
          onClick={handleCopyCSV}
          className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors cursor-pointer"
          title="Copy CSV"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied CSV' : 'Copy CSV'}</span>
        </button>
      </div>

      {/* Styled Spreadsheet Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--background)]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--sidebar)] text-[var(--muted-foreground)] font-medium">
              <th className="py-2 px-3 border-r border-[var(--border)] w-10 text-center text-[10px]">#</th>
              {data.headers.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(idx)}
                  className="py-2 px-3 border-r border-[var(--border)] last:border-r-0 cursor-pointer hover:text-[var(--foreground)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{header}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--hover)] transition-colors"
              >
                <td className="py-1.5 px-3 border-r border-[var(--border)] text-center text-[10px] text-[var(--muted-foreground)]">
                  {rowIndex}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="py-1.5 px-3 border-r border-[var(--border)] last:border-r-0 text-[var(--foreground)]"
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
