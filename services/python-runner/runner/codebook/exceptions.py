"""
CodeBook Media Exceptions Module
"""

class MediaError(Exception):
    """Base exception for CodeBook media bridge errors."""
    pass

class MediaPermissionError(MediaError):
    """Raised when browser media permission is denied by the user."""
    pass

class MediaDeviceError(MediaError):
    """Raised when camera or microphone device is unavailable or fails."""
    pass

class MediaTimeoutError(MediaError):
    """Raised when media request times out in the browser."""
    pass
