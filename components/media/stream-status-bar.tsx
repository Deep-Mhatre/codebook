'use client';

import React from 'react';
import { Video, Mic, Square } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export function StreamStatusBar() {
  const { isCameraStreaming, isAudioStreaming, stopAllStreams } = useUIStore();

  if (!isCameraStreaming && !isAudioStreaming) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/40 rounded-full text-red-200 text-xs shadow-lg animate-pulse">
      {isCameraStreaming && <Video className="w-3.5 h-3.5 text-red-400" />}
      {isAudioStreaming && <Mic className="w-3.5 h-3.5 text-red-400" />}
      
      <span className="font-medium text-[11px]">
        LIVE {isCameraStreaming && isAudioStreaming ? 'Webcam & Mic' : isCameraStreaming ? 'Webcam 30 FPS' : 'Microphone'} Stream Active
      </span>

      <button
        onClick={stopAllStreams}
        className="ml-1.5 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        title="Emergency stop active media stream"
      >
        <Square className="w-2.5 h-2.5 fill-current" />
        <span>Stop</span>
      </button>
    </div>
  );
}
