'use client';

import React, { useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

interface AudioWaveformOutputProps {
  isStreaming?: boolean;
  onStopStream?: () => void;
}

export function AudioWaveformOutput({ isStreaming = true, onStopStream }: AudioWaveformOutputProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background spectrum grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      const sliceWidth = canvas.width / 50;
      let x = 0;

      for (let i = 0; i < 50; i++) {
        const v = Math.sin(phase + i * 0.2) * 20 * (isStreaming ? 1 : 0.1);
        const y = canvas.height / 2 + v;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      phase += 0.15;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isStreaming]);

  return (
    <div className="my-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-2 text-cyan-400 font-medium">
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span>LIVE Microphone Stream Active</span>
        </div>

        {onStopStream && (
          <button
            onClick={onStopStream}
            className="flex items-center gap-1 px-2 py-0.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Audio Stream</span>
          </button>
        )}
      </div>

      <div className="relative rounded overflow-hidden bg-slate-950 flex items-center justify-center min-h-[120px]">
        <canvas
          ref={canvasRef}
          width={500}
          height={100}
          className="w-full h-[100px] object-cover rounded"
        />
      </div>
    </div>
  );
}
