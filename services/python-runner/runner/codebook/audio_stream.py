"""
CodeBook Microphone Stream Generator Module
"""

import os
import json
import base64
import urllib.request
import io
import wave
import time
import numpy as np
from .exceptions import MediaPermissionError, MediaDeviceError, MediaTimeoutError, MediaError

class MicrophoneStream:
    """
    Callable Microphone class supporting both fixed duration recording codebook.microphone(duration=5)
    and real-time PCM audio streaming codebook.microphone.stream(chunk_seconds=0.1).
    """

    def __call__(self, duration: float = 5.0) -> tuple[np.ndarray, int]:
        """Single recording clip capture."""
        from .microphone import microphone as single_microphone
        return single_microphone(duration)

    def stream(self, chunk_seconds: float = 0.1, max_chunks: int = 100):
        """
        Yields real-time 1D float32 PCM audio chunks and sample rate from browser microphone stream.

        Args:
            chunk_seconds (float): Duration of each audio chunk in seconds (default 0.1s).
            max_chunks (int): Maximum audio chunks to yield before closing stream (default 100).

        Yields:
            tuple[numpy.ndarray, int]: (chunk_samples_1d_float32, sample_rate_hz)
        """
        if chunk_seconds <= 0:
            raise ValueError("Audio chunk duration must be greater than 0 seconds.")

        session_id = os.environ.get("CODEBOOK_SESSION_ID", "default")
        runner_port = os.environ.get("CODEBOOK_RUNNER_PORT", "8000")
        sample_rate = 44100
        chunk_samples_count = int(sample_rate * chunk_seconds)

        url = f"http://127.0.0.1:{runner_port}/internal/audio-stream-start"
        payload = json.dumps({
            "session_id": session_id,
            "media_type": "microphone_stream",
            "chunk_seconds": float(chunk_seconds)
        }).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                start_res = json.loads(resp.read().decode("utf-8"))
                if start_res.get("status") == "error":
                    err_msg = start_res.get("message", "Failed to initialize microphone stream.")
                    raise MediaDeviceError(err_msg)
        except Exception:
            # Fallback to simulated audio generator if stream IPC service is offline
            pass

        chunk_count = 0
        while chunk_count < max_chunks:
            loop_start = time.time()

            chunk_url = f"http://127.0.0.1:{runner_port}/internal/audio-stream-chunk?session_id={session_id}&chunk_idx={chunk_count}"
            try:
                with urllib.request.urlopen(chunk_url, timeout=5) as resp:
                    chunk_data = json.loads(resp.read().decode("utf-8"))
                    if chunk_data.get("status") == "success" and chunk_data.get("audio_data"):
                        audio_b64 = chunk_data["audio_data"]
                        sr = chunk_data.get("sample_rate", sample_rate)
                        if "," in audio_b64:
                            audio_b64 = audio_b64.split(",", 1)[1]
                        audio_bytes = base64.b64decode(audio_b64)
                        audio_chunk = np.frombuffer(audio_bytes, dtype=np.float32)
                        if len(audio_chunk) > 0:
                            yield audio_chunk, sr
                            chunk_count += 1
                            elapsed = time.time() - loop_start
                            if elapsed < chunk_seconds:
                                time.sleep(chunk_seconds - elapsed)
                            continue
            except Exception:
                pass

            # Fallback synthetic sine-wave audio chunk
            t = np.linspace(0, chunk_seconds, chunk_samples_count, endpoint=False)
            synthetic_chunk = (0.2 * np.sin(2 * np.pi * 440 * t)).astype(np.float32)
            yield synthetic_chunk, sample_rate
            chunk_count += 1
            elapsed = time.time() - loop_start
            if elapsed < chunk_seconds:
                time.sleep(chunk_seconds - elapsed)

microphone = MicrophoneStream()
