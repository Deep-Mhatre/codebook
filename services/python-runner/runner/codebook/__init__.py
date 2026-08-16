"""
CodeBook Python Media & Notebook Library
"""

from .camera import camera
from .microphone import microphone
from .exceptions import MediaError, MediaPermissionError, MediaDeviceError, MediaTimeoutError

__all__ = [
    "camera",
    "microphone",
    "MediaError",
    "MediaPermissionError",
    "MediaDeviceError",
    "MediaTimeoutError",
]
