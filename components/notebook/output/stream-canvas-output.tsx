'use client';

import React, { useEffect, useRef } from 'react';
import { Video, Square } from 'lucide-react';

interface StreamCanvasOutputProps {
  currentFrame?: string;
  fps?: number;
  onStopStream?: () => void;
}

export function StreamCanvasOutput({ currentFrame, fps = 30, onStopStream }: StreamCanvasOutputProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current && currentFrame) {
      imgRef.current.src = currentFrame;
    }
  }, [currentFrame]);

  return (
    <div className="my-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <Video className="w-3.5 h-3.5 animate-pulse" />
          <span>LIVE Camera Stream ({fps} FPS)</span>
        </div>

        {onStopStream && (
          <button
            onClick={onStopStream}
            className="flex items-center gap-1 px-2 py-0.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Stream</span>
          </button>
        )}
      </div>

      <div className="relative rounded overflow-hidden bg-black flex items-center justify-center min-h-[240px]">
        {currentFrame ? (
          <img
            ref={imgRef}
            src={currentFrame}
            alt="Live Stream Frame"
            className="max-h-[420px] w-auto object-contain rounded"
          />
        ) : (
          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Initializing 30 FPS video stream...</span>
          </div>
        )}
      </div>
    </div>
  );
}
