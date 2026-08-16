"""
Unit test for Chunk 2.1: Microphone Stream API & Generator Interface
"""

import sys
import os
import unittest
import numpy as np

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

import codebook

class TestAudioStreamAPI(unittest.TestCase):

    def test_microphone_stream_attribute(self):
        """Verify codebook.microphone has a callable stream method."""
        self.assertTrue(hasattr(codebook.microphone, "stream"))
        self.assertTrue(callable(codebook.microphone.stream))

    def test_microphone_stream_generator_yielding(self):
        """Verify microphone.stream(chunk_seconds=0.1, max_chunks=5) yields 5 float32 audio chunks."""
        chunks = list(codebook.microphone.stream(chunk_seconds=0.1, max_chunks=5))
        self.assertEqual(len(chunks), 5)
        for audio_chunk, rate in chunks:
            self.assertEqual(rate, 44100)
            self.assertEqual(len(audio_chunk), 4410)
            self.assertEqual(audio_chunk.dtype, np.float32)

    def test_microphone_stream_invalid_chunk_duration(self):
        """Verify microphone.stream raises ValueError for chunk_seconds <= 0."""
        with self.assertRaises(ValueError):
            list(codebook.microphone.stream(chunk_seconds=0))

if __name__ == "__main__":
    unittest.main()
