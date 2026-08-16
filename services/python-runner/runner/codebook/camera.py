"""
CodeBook Camera Helper Module
"""

import os
import json
import base64
import urllib.request
import numpy as np
import cv2
from .exceptions import MediaPermissionError, MediaDeviceError, MediaTimeoutError, MediaError

def camera() -> np.ndarray:
    """
    Captures a single image frame from the user's browser webcam.

    Returns:
        numpy.ndarray: BGR image array compatible with OpenCV.

    Raises:
        MediaPermissionError: If user denies camera permission in the browser.
        MediaDeviceError: If camera is unavailable or capture fails.
    """
    session_id = os.environ.get("CODEBOOK_SESSION_ID", "default")
    runner_port = os.environ.get("CODEBOOK_RUNNER_PORT", "8000")

    url = f"http://127.0.0.1:{runner_port}/internal/media-request"
    payload = json.dumps({
        "session_id": session_id,
        "media_type": "camera"
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise MediaDeviceError(f"Failed to communicate with CodeBook media bridge: {str(e)}")

    if data.get("status") == "error":
        err_type = data.get("error_type", "")
        msg = data.get("message", "Camera capture failed.")
        if err_type == "permission_denied" or "permission" in msg.lower() or "denied" in msg.lower():
            raise MediaPermissionError(f"Camera permission denied: {msg}")
        elif err_type == "device_not_found" or "not found" in msg.lower():
            raise MediaDeviceError(f"Camera device error: {msg}")
        else:
            raise MediaError(f"Camera error: {msg}")

    img_b64 = data.get("image_data", "")
    if not img_b64:
        raise MediaDeviceError("Received empty camera frame from browser.")

    if "," in img_b64:
        img_b64 = img_b64.split(",", 1)[1]

    img_bytes = base64.b64decode(img_b64)
    np_arr = np.frombuffer(img_bytes, dtype=np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if frame is None:
        raise MediaDeviceError("Failed to decode camera image into OpenCV BGR array.")

    return frame
