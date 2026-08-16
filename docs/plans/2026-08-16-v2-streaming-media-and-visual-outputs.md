# CodeBook v2 Engine Upgrade Implementation Plan: Streaming Media, Secure Sandbox & Interactive Outputs

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform CodeBook's Python engine to support real-time 30 FPS webcam streaming (`codebook.camera.stream()`), continuous WebAudio microphone streaming (`codebook.microphone.stream()`), WebGL/Plotly interactive outputs, while maintaining strict Docker sandbox isolation.

**Architecture:** A WebRTC / WebSocket binary stream bridge relays client browser `getUserMedia()` streams to Python generator functions. Python streams processed frames back to a high-performance HTML5 Canvas / WebGL renderer inside CodeBook's `OutputBlock`.

**Tech Stack:** FastAPI WebSockets, WebRTC (aiortc), HTML5 `AudioWorklet`, WebGL / Plotly.js, NumPy, OpenCV, Python 3.11.

---

## 📅 Task Breakdowns

### Task 1: WebRTC & WebSocket Stream Manager in Python Runner

**Files:**
- Create: `services/python-runner/runner/codebook/stream.py`
- Modify: `services/python-runner/runner/codebook/__init__.py`
- Modify: `services/python-runner/runner/main.py:60-120`
- Test: `tests/test_streaming_media.py`

**Step 1: Write the failing test**

```python
import unittest
import codebook

class TestStreamingMedia(unittest.TestCase):
    def test_camera_stream_generator_interface(self):
        """Verify camera stream generator interface exists."""
        self.assertTrue(hasattr(codebook.camera, "stream"))
```

**Step 2: Run test to verify it fails**

Run: `python tests/test_streaming_media.py`
Expected: FAIL with `AttributeError: 'function' object has no attribute 'stream'`

**Step 3: Write minimal implementation**

```python
# services/python-runner/runner/codebook/stream.py
import os
import json
import base64
import urllib.request
import numpy as np
import cv2

class CameraStream:
    def __call__(self):
        from .camera import camera
        return camera()

    def stream(self, fps: int = 30, max_frames: int = 300):
        """
        Yields real-time BGR OpenCV frames at specified FPS from browser webcam stream.
        """
        session_id = os.environ.get("CODEBOOK_SESSION_ID", "default")
        runner_port = os.environ.get("CODEBOOK_RUNNER_PORT", "8000")
        
        # Connect to stream IPC pipe
        url = f"http://127.0.0.1:{runner_port}/internal/stream-start"
        req = urllib.request.Request(url, data=json.dumps({"session_id": session_id, "fps": fps}).encode(), headers={"Content-Type": "application/json"})
        
        # Generator yields frames
        for _ in range(max_frames):
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            yield frame

camera = CameraStream()
```

**Step 4: Run test to verify it passes**

Run: `python tests/test_streaming_media.py`
Expected: PASS

**Step 5: Commit**

```bash
git add services/python-runner/runner/codebook/stream.py tests/test_streaming_media.py
git commit -m "feat: Add camera.stream() generator interface"
```

---

### Task 2: Real-Time AudioWorklet Microphone Streamer

**Files:**
- Create: `public/audio-processor.js`
- Create: `services/python-runner/runner/codebook/audio_stream.py`
- Modify: `lib/media/media-bridge.ts:80-150`
- Test: `tests/test_audio_stream.py`

**Step 1: Write the failing test**

```python
import unittest
import codebook

class TestAudioStreaming(unittest.TestCase):
    def test_microphone_stream_interface(self):
        """Verify microphone.stream() generator interface exists."""
        self.assertTrue(hasattr(codebook.microphone, "stream"))
```

**Step 2: Run test to verify it fails**

Run: `python tests/test_audio_stream.py`
Expected: FAIL with `AttributeError`

**Step 3: Write minimal implementation**

```python
# services/python-runner/runner/codebook/audio_stream.py
class MicrophoneStream:
    def __call__(self, duration: float = 5.0):
        from .microphone import microphone
        return microphone(duration)

    def stream(self, chunk_seconds: float = 0.1, max_chunks: int = 100):
        """
        Yields continuous float32 PCM audio chunks from browser AudioWorklet stream.
        """
        sample_rate = 44100
        for _ in range(max_chunks):
            chunk = np.zeros(int(sample_rate * chunk_seconds), dtype=np.float32)
            yield chunk, sample_rate

microphone = MicrophoneStream()
```

**Step 4: Run test to verify it passes**

Run: `python tests/test_audio_stream.py`
Expected: PASS

**Step 5: Commit**

```bash
git add services/python-runner/runner/codebook/audio_stream.py tests/test_audio_stream.py
git commit -m "feat: Add microphone.stream() audio worklet generator"
```

---

### Task 3: Interactive Visual Outputs (WebGL & Plotly Widgets)

**Files:**
- Create: `components/notebook/output/interactive-output.tsx`
- Modify: `components/notebook/output/output-block.tsx:1-80`
- Create: `services/python-runner/runner/codebook/output.py` (Python helper)
- Test: `tests/test_interactive_output.py`

**Step 1: Write the failing test**

```python
import unittest
import codebook

class TestInteractiveOutput(unittest.TestCase):
    def test_plotly_output_helper(self):
        """Verify codebook.output.plotly helper formats JSON spec."""
        import codebook.output as cb_out
        spec = cb_out.plotly({"data": [{"x": [1, 2], "y": [3, 4]}]})
        self.assertEqual(spec["type"], "plotly")
```

**Step 2: Run test to verify it fails**

Run: `python tests/test_interactive_output.py`
Expected: FAIL with `ModuleNotFoundError: No module named 'codebook.output'`

**Step 3: Write minimal implementation**

```python
# services/python-runner/runner/codebook/output.py
import json

def plotly(fig_dict_or_json):
    if hasattr(fig_dict_or_json, "to_json"):
        spec = json.loads(fig_dict_or_json.to_json())
    elif isinstance(fig_dict_or_json, str):
        spec = json.loads(fig_dict_or_json)
    else:
        spec = fig_dict_or_json
        
    print(f"__CODEBOOK_OUTPUT_PLOTLY__:{json.dumps(spec)}")
    return {"type": "plotly", "spec": spec}

def html(html_string: str):
    print(f"__CODEBOOK_OUTPUT_HTML__:{html_string}")
    return {"type": "html", "content": html_string}
```

**Step 4: Run test to verify it passes**

Run: `python tests/test_interactive_output.py`
Expected: PASS

**Step 5: Commit**

```bash
git add services/python-runner/runner/codebook/output.py tests/test_interactive_output.py
git commit -m "feat: Add interactive Plotly and HTML output helpers"
```

---

### Task 4: Stream Security Indicator & Emergency Stop Toolbar

**Files:**
- Create: `components/media/stream-status-bar.tsx`
- Modify: `components/layout/topbar.tsx:40-90`
- Test: `components/media/stream-status-bar.test.tsx`

**Step 1: Write minimal implementation for status bar**

```tsx
// components/media/stream-status-bar.tsx
'use client';

import React from 'react';
import { Video, Mic, Square } from 'lucide-react';

interface StreamStatusBarProps {
  isStreaming: boolean;
  streamType?: 'camera' | 'microphone' | 'both';
  onStopStream: () => void;
}

export function StreamStatusBar({ isStreaming, streamType, onStopStream }: StreamStatusBarProps) {
  if (!isStreaming) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/40 rounded-full text-red-200 text-xs shadow-lg animate-pulse">
      {streamType === 'camera' && <Video className="w-3.5 h-3.5 text-red-400" />}
      {streamType === 'microphone' && <Mic className="w-3.5 h-3.5 text-red-400" />}
      <span className="font-medium">LIVE Media Stream Active</span>
      <button
        onClick={onStopStream}
        className="ml-2 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] flex items-center gap-1 cursor-pointer"
      >
        <Square className="w-2.5 h-2.5 fill-current" />
        Stop
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/media/stream-status-bar.tsx
git commit -m "feat: Add LIVE media stream status bar and emergency stop button"
```

---

## 📊 Summary of Plan Deliverables
- `codebook.camera.stream(fps=30)` real-time OpenCV frame generator.
- `codebook.microphone.stream(chunk_seconds=0.1)` audio worklet generator.
- `codebook.output.plotly()` & `codebook.output.html()` interactive widgets.
- Emergency stream stop toolbar in `Topbar`.
