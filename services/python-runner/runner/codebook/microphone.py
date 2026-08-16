"""
CodeBook Microphone Helper Module
"""

import os
import json
import base64
import urllib.request
import io
import wave
import numpy as np
from .exceptions import MediaPermissionError, MediaDeviceError, MediaTimeoutError, MediaError

def microphone(duration: float = 5.0) -> tuple[np.ndarray, int]:
    """
    Records audio from the user's browser microphone for the requested duration.

    Args:
        duration (float): Recording duration in seconds (default 5.0).

    Returns:
        tuple[numpy.ndarray, int]: (audio_samples_1d_float32, sample_rate_hz)

    Raises:
        ValueError: If duration is <= 0.
        MediaPermissionError: If user denies microphone permission in the browser.
        MediaDeviceError: If microphone is unavailable or recording fails.
    """
    if duration <= 0:
        raise ValueError("Audio recording duration must be greater than 0 seconds.")

    session_id = os.environ.get("CODEBOOK_SESSION_ID", "default")
    runner_port = os.environ.get("CODEBOOK_RUNNER_PORT", "8000")

    url = f"http://127.0.0.1:{runner_port}/internal/media-request"
    payload = json.dumps({
        "session_id": session_id,
        "media_type": "microphone",
        "duration": float(duration)
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        timeout_limit = int(duration) + 30
        with urllib.request.urlopen(req, timeout=timeout_limit) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise MediaDeviceError(f"Failed to communicate with CodeBook media bridge: {str(e)}")

    if data.get("status") == "error":
        err_type = data.get("error_type", "")
        msg = data.get("message", "Microphone recording failed.")
        if err_type == "permission_denied" or "permission" in msg.lower() or "denied" in msg.lower():
            raise MediaPermissionError(f"Microphone permission denied: {msg}")
        elif err_type == "device_not_found" or "not found" in msg.lower():
            raise MediaDeviceError(f"Microphone device error: {msg}")
        else:
            raise MediaError(f"Microphone error: {msg}")

    audio_b64 = data.get("audio_data", "")
    sample_rate = data.get("sample_rate", 44100)

    if not audio_b64:
        raise MediaDeviceError("Received empty audio recording from browser.")

    if "," in audio_b64:
        audio_b64 = audio_b64.split(",", 1)[1]

    audio_bytes = base64.b64decode(audio_b64)

    try:
        # Decode WAV buffer if provided
        with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
            sample_rate = wf.getframerate()
            num_frames = wf.getnframes()
            sampwidth = wf.getsampwidth()
            raw_pcm = wf.readframes(num_frames)

            if sampwidth == 2:  # 16-bit int PCM
                audio_int16 = np.frombuffer(raw_pcm, dtype=np.int16)
                audio_float = audio_int16.astype(np.float32) / 32768.0
            elif sampwidth == 4:  # 32-bit float or int PCM
                audio_float = np.frombuffer(raw_pcm, dtype=np.float32)
            else:  # 8-bit PCM fallback
                audio_int8 = np.frombuffer(raw_pcm, dtype=np.uint8)
                audio_float = (audio_int8.astype(np.float32) - 128.0) / 128.0

            return audio_float, sample_rate
    except Exception:
        # Fallback if raw float32 array was transmitted directly
        try:
            audio_float = np.frombuffer(audio_bytes, dtype=np.float32)
            return audio_float, sample_rate
        except Exception as fallback_err:
            raise MediaDeviceError(f"Failed to decode audio recording buffer: {str(fallback_err)}")
