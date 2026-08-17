'use client';

import React from 'react';
import { Save, Check, RefreshCw, Folder, FileUp, FileDown } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface PageHeaderProps {
  notebookName?: string;
  topicTitle?: string;
  pageTitle: string;
  lastEdited?: string;
  isSaving?: boolean;
  isDirty?: boolean;
  onTitleChange?: (newTitle: string) => void;
  onSave?: () => void;
  onImportIpynb?: (content: string) => void;
  onExportIpynb?: () => void;
}

export function PageHeader({
  notebookName = 'Python',
  topicTitle = 'Fundamentals',
  pageTitle,
  lastEdited = 'Last edited 2 minutes ago',
  isSaving = false,
  isDirty = false,
  onTitleChange,
  onSave,
  onImportIpynb,
  onExportIpynb,
}: PageHeaderProps) {
  const { toggleWorkspaceExplorer, workspaceFiles } = useUIStore();

  return (
    <div className="mb-6 space-y-2 select-none">
      {/* Top Bar inside Header: Category Hierarchy Path & Save Controls */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 font-medium">
          <span>{notebookName}</span>
          <span>/</span>
          <span>{topicTitle}</span>
          <span>/</span>
          <span className="text-[var(--foreground)]">{pageTitle}</span>
        </div>

        {/* Save Status, Workspace Explorer & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Workspace Explorer Trigger Button */}
          <button
            onClick={toggleWorkspaceExplorer}
            className="flex items-center gap-1.5 px-2 py-1 text-xs border border-[var(--border)] bg-[var(--sidebar)] hover:bg-[var(--hover)] text-[var(--foreground)] rounded-md font-medium transition-colors cursor-pointer"
            title="Open Session Workspace Files"
          >
            <Folder className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Files</span>
            {workspaceFiles.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full">
                {workspaceFiles.length}
              </span>
            )}
          </button>

          {/* Import .ipynb Button */}
          {onImportIpynb && (
            <label className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--border)] bg-[var(--sidebar)] hover:bg-[var(--hover)] text-[var(--foreground)] rounded-md font-medium transition-colors cursor-pointer" title="Import Jupyter (.ipynb) Notebook">
              <FileUp className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Import .ipynb</span>
              <input
                type="file"
                accept=".ipynb"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      if (evt.target?.result) {
                        onImportIpynb(evt.target.result as string);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          )}

          {/* Export .ipynb Button */}
          {onExportIpynb && (
            <button
              onClick={onExportIpynb}
              className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--border)] bg-[var(--sidebar)] hover:bg-[var(--hover)] text-[var(--foreground)] rounded-md font-medium transition-colors cursor-pointer"
              title="Export to Jupyter (.ipynb) Format"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Export .ipynb</span>
            </button>
          )}

          {/* Status Badge */}
          <div className="text-xs flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--sidebar)] text-[var(--muted-foreground)]">
            {isSaving ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                <span className="text-amber-500 font-medium">Saving...</span>
              </>
            ) : isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                <span className="text-amber-500 font-medium">Unsaved</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Saved</span>
              </>
            )}
          </div>

          {/* Explicit Save Button */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 rounded-md font-medium transition-opacity cursor-pointer disabled:opacity-50"
            title="Save Page (⌘S / Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-white/20 rounded">
              ⌘S
            </kbd>
          </button>
        </div>
      </div>

      {/* Page Title Header */}
      <h1
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onTitleChange && onTitleChange(e.currentTarget.textContent || pageTitle)}
        className="text-3xl font-bold tracking-tight text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--border)] rounded px-1 -ml-1 transition-shadow"
      >
        {pageTitle}
      </h1>

      {/* Metadata Subtext */}
      <div className="text-xs text-[var(--muted-foreground)] pt-1 flex items-center gap-2">
        <span>{lastEdited}</span>
      </div>
    </div>
  );
}
