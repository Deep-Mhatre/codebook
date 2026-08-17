'use client';

import React from 'react';
import { Camera, Mic, Loader2, ShieldCheck } from 'lucide-react';

export type MediaRequestType = 'camera' | 'microphone' | null;

interface MediaPermissionBannerProps {
  type: MediaRequestType;
  duration?: number;
  onGrantPermission?: () => void;
}

export function MediaPermissionBanner({ type, duration = 5, onGrantPermission }: MediaPermissionBannerProps) {
  if (!type) return null;

  return (
    <div className="my-3 p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-200 text-xs shadow-lg transition-all duration-200 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 shadow-inner">
          {type === 'camera' ? (
            <Camera className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 animate-pulse" />
          )}
        </div>

        <div>
          <div className="font-semibold text-amber-100 flex items-center gap-2 text-sm">
            <span>{type === 'camera' ? 'Webcam Access Requested' : 'Microphone Access Requested'}</span>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
          </div>
          <p className="text-[11px] text-amber-300/80 mt-0.5">
            {type === 'camera'
              ? 'This Python script requires camera permission to capture live vision frames.'
              : `This Python script requires microphone permission to record ${duration}s of audio.`}
          </p>
        </div>
      </div>

      {onGrantPermission && (
        <button
          onClick={onGrantPermission}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Grant Access</span>
        </button>
      )}
    </div>
  );
}
