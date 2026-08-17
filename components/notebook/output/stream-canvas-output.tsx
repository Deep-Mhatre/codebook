'use client';

import React, { useEffect, useRef } from 'react';
import { Video, Square } from 'lucide-react';

export interface VisionOverlayItem {
  type: 'rect' | 'points' | 'text';
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  label?: string;
  color?: string;
  points?: number[][];
  text?: string;
}

interface StreamCanvasOutputProps {
  currentFrame?: string;
  fps?: number;
  overlays?: VisionOverlayItem[];
  onStopStream?: () => void;
}

export function StreamCanvasOutput({ currentFrame, fps = 30, overlays = [], onStopStream }: StreamCanvasOutputProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (imgRef.current && currentFrame) {
      imgRef.current.src = currentFrame;
    }
  }, [currentFrame]);

  // Draw GPU Canvas overlays on top of video stream frame
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.clientWidth || 640;
    canvas.height = img.clientHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (overlays && overlays.length > 0) {
      overlays.forEach((item) => {
        ctx.strokeStyle = item.color || '#00ff00';
        ctx.fillStyle = item.color || '#00ff00';
        ctx.lineWidth = 2;

        if (item.type === 'rect' && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          ctx.strokeRect(item.x, item.y, item.w, item.h);
          if (item.label) {
            ctx.font = '12px sans-serif';
            ctx.fillStyle = item.color || '#00ff00';
            ctx.fillRect(item.x, Math.max(0, item.y - 18), ctx.measureText(item.label).width + 8, 18);
            ctx.fillStyle = '#000000';
            ctx.fillText(item.label, item.x + 4, Math.max(12, item.y - 4));
          }
        } else if (item.type === 'points' && item.points) {
          item.points.forEach(([px, py]) => {
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, 2 * Math.PI);
            ctx.fill();
          });
        } else if (item.type === 'text' && item.text && item.x !== undefined && item.y !== undefined) {
          ctx.font = '14px sans-serif';
          ctx.fillText(item.text, item.x, item.y);
        }
      });
    }
  }, [currentFrame, overlays]);

  return (
    <div className="my-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] space-y-2 select-none">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <Video className="w-3.5 h-3.5 animate-pulse" />
          <span>LIVE Vision Camera Stream ({fps} FPS)</span>
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
          <>
            <img
              ref={imgRef}
              src={currentFrame}
              alt="Live Stream Frame"
              className="max-h-[420px] w-auto object-contain rounded"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </>
        ) : (
          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Initializing 30 FPS computer vision stream...</span>
          </div>
        )}
      </div>
    </div>
  );
}
