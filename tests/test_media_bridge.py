"""
Unit & Integration Test Suite for CodeBook Media Bridge
"""

import sys
import os
import unittest
import numpy as np
import cv2

# Add python runner directory to path
runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

import codebook
from codebook.exceptions import MediaError, MediaPermissionError, MediaDeviceError, MediaTimeoutError

class TestCodeBookMediaBridge(unittest.TestCase):

    def test_exception_hierarchy(self):
        """Verify exception inheritance tree."""
        self.assertTrue(issubclass(MediaPermissionError, MediaError))
        self.assertTrue(issubclass(MediaDeviceError, MediaError))
        self.assertTrue(issubclass(MediaTimeoutError, MediaError))

    def test_microphone_invalid_duration(self):
        """Verify microphone raises ValueError for zero or negative duration."""
        with self.assertRaises(ValueError):
            codebook.microphone(duration=0)
        with self.assertRaises(ValueError):
            codebook.microphone(duration=-5)

    def test_camera_disconnected_session_handling(self):
        """Verify camera() raises MediaDeviceError when no runner bridge is reachable."""
        os.environ["CODEBOOK_RUNNER_PORT"] = "9999"  # Unreachable port
        with self.assertRaises(MediaDeviceError) as ctx:
            codebook.camera()
        self.assertIn("Failed to communicate with CodeBook media bridge", str(ctx.exception))

    def test_microphone_disconnected_session_handling(self):
        """Verify microphone() raises MediaDeviceError when no runner bridge is reachable."""
        os.environ["CODEBOOK_RUNNER_PORT"] = "9999"  # Unreachable port
        with self.assertRaises(MediaDeviceError) as ctx:
            codebook.microphone(duration=1)
        self.assertIn("Failed to communicate with CodeBook media bridge", str(ctx.exception))

    def test_mock_camera_decoding(self):
        """Verify decoding of a raw PNG image into an OpenCV BGR NumPy array."""
        # Create synthetic 100x100 BGR test image
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        img[:, :] = (255, 0, 0)  # Pure Blue in BGR
        
        # Encode to PNG bytes
        success, encoded = cv2.imencode(".png", img)
        self.assertTrue(success)
        
        # Decode back using numpy & cv2 (matching codebook.camera() decoder)
        np_arr = np.frombuffer(encoded.tobytes(), dtype=np.uint8)
        decoded_frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        self.assertEqual(decoded_frame.shape, (100, 100, 3))
        self.assertEqual(decoded_frame[0, 0, 0], 255) # Blue channel

if __name__ == "__main__":
    unittest.main()
