"""
Unit test for Chunk 1.1: Camera Stream API & Generator Interface
"""

import sys
import os
import unittest

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

import codebook

class TestCameraStreamAPI(unittest.TestCase):

    def test_camera_stream_attribute(self):
        """Verify codebook.camera has a callable stream method."""
        self.assertTrue(hasattr(codebook.camera, "stream"))
        self.assertTrue(callable(codebook.camera.stream))

    def test_camera_stream_generator_yielding(self):
        """Verify camera.stream(fps=30, max_frames=5) yields 5 NumPy frame arrays."""
        frames = list(codebook.camera.stream(fps=30, max_frames=5))
        self.assertEqual(len(frames), 5)
        for frame in frames:
            self.assertEqual(frame.shape, (480, 640, 3))

if __name__ == "__main__":
    unittest.main()
