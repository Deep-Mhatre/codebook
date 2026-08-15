'use client';

import React, { useState } from 'react';
import { Download, Maximize2, X } from 'lucide-react';

interface ImageOutputProps {
  src: string;
  alt?: string;
}

export function ImageOutput({ src, alt = 'Generated Matplotlib Chart' }: ImageOutputProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Chart Image Container */}
      <div className="relative group rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 overflow-hidden">
        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[var(--card)]/90 backdrop-blur-xs border border-[var(--border)] rounded-md p-1 transition-opacity z-10 shadow-sm">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded cursor-pointer"
            title="Expand Chart"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <a
            href={src}
            download="chart.png"
            className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded cursor-pointer"
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Chart Render */}
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto mx-auto rounded object-contain transition-transform duration-200 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-2xl">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--sidebar)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={src} alt={alt} className="w-full h-auto rounded max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
