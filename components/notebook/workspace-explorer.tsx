'use client';

import React, { useRef } from 'react';
import { useUIStore, WorkspaceFile } from '@/lib/store/ui-store';
import { X, Folder, FileText, FileCode, FileSpreadsheet, Image as ImageIcon, Upload, Trash2, Download } from 'lucide-react';

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return <FileCode className="w-4 h-4 text-emerald-500" />;
    case 'csv':
    case 'xlsx':
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    case 'json':
      return <FileText className="w-4 h-4 text-amber-500" />;
    default:
      return <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />;
  }
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function WorkspaceExplorer() {
  const { isWorkspaceExplorerOpen, setWorkspaceExplorerOpen, workspaceFiles, setWorkspaceFiles } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isWorkspaceExplorerOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    const newFiles: WorkspaceFile[] = Array.from(uploaded).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setWorkspaceFiles([...workspaceFiles, ...newFiles]);
  };

  const handleDeleteFile = (fileName: string) => {
    setWorkspaceFiles(workspaceFiles.filter((f) => f.name !== fileName));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-all">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Session Workspace</h2>
        </div>
        <button
          onClick={() => setWorkspaceExplorerOpen(false)}
          className="p-1 rounded hover:bg-[var(--hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Quick Actions */}
      <div className="p-3 border-b border-[var(--border)] bg-[var(--sidebar)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)] font-medium">
          {workspaceFiles.length} {workspaceFiles.length === 1 ? 'file' : 'files'}
        </span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 rounded font-medium transition-opacity cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* File Explorer List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {workspaceFiles.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Folder className="w-8 h-8 text-[var(--muted-foreground)] opacity-40 mx-auto" />
            <p className="text-xs text-[var(--muted-foreground)]">No session files found.</p>
            <p className="text-[11px] text-[var(--muted-foreground)] opacity-70 px-4">
              Files created by Python scripts (e.g. <code className="font-mono bg-[var(--hover)] px-1 rounded">df.to_csv()</code> or custom modules) will appear here.
            </p>
          </div>
        ) : (
          workspaceFiles.map((file) => (
            <div
              key={file.name}
              className="group flex items-center justify-between p-2 rounded-md hover:bg-[var(--hover)] transition-colors text-xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getFileIcon(file.name)}
                <div className="truncate">
                  <p className="font-medium text-[var(--foreground)] truncate">{file.name}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">{formatBytes(file.size)}</p>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button
                  onClick={() => alert(`Downloading ${file.name}`)}
                  className="p-1 rounded hover:bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteFile(file.name)}
                  className="p-1 rounded hover:bg-red-500/10 text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
