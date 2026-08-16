'use client';

import React from 'react';
import { Camera, Mic, Loader2 } from 'lucide-react';

export type MediaRequestType = 'camera' | 'microphone' | null;

interface MediaPermissionBannerProps {
  type: MediaRequestType;
  duration?: number;
}

export function MediaPermissionBanner({ type, duration = 5 }: MediaPermissionBannerProps) {
  if (!type) return null;

  return (
    <div className="my-2 p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs shadow-md transition-all duration-200 flex items-center gap-3">
      <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
        {type === 'camera' ? (
          <Camera className="w-4 h-4 animate-pulse" />
        ) : (
          <Mic className="w-4 h-4 animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-amber-100 flex items-center gap-1.5 text-sm">
          <span>{type === 'camera' ? 'Camera access requested' : 'Microphone access requested'}</span>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        </div>
        <p className="text-[11px] text-amber-300/80 mt-0.5">
          {type === 'camera'
            ? 'This program wants to use your camera to capture a frame.'
            : `This program wants to use your microphone to record ${duration}s of audio.`}
        </p>
      </div>
    </div>
  );
}
