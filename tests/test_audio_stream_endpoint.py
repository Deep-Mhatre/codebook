"""
Unit test for Chunk 2.2: FastAPI Audio Stream Relay Endpoints & Queue
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

from main import app

class TestAudioStreamEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_includes_audio_streams(self):
        """Verify health check returns active audio stream counts."""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("active_audio_streams", data)

    def test_audio_stream_start_endpoint(self):
        """Verify POST /internal/audio-stream-start initializes audio stream queue."""
        res = self.client.post("/internal/audio-stream-start", json={
            "session_id": "test-audio-session-123",
            "media_type": "microphone_stream",
            "chunk_seconds": 0.1
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "success")

    def test_audio_stream_chunk_empty_endpoint(self):
        """Verify GET /internal/audio-stream-chunk handles empty queue gracefully."""
        res = self.client.get("/internal/audio-stream-chunk?session_id=test-audio-session-123&chunk_idx=0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status", data)

if __name__ == "__main__":
    unittest.main()
