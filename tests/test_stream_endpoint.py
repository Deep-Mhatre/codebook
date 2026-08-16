"""
Unit test for Chunk 1.2: FastAPI Stream Relay Endpoints & Queue
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

from main import app

class TestStreamEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_includes_streams(self):
        """Verify health check returns active stream counts."""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("active_streams", data)

    def test_stream_start_endpoint(self):
        """Verify POST /internal/stream-start initializes stream queue."""
        res = self.client.post("/internal/stream-start", json={
            "session_id": "test-session-123",
            "media_type": "camera_stream",
            "fps": 30
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "success")

    def test_stream_frame_empty_endpoint(self):
        """Verify GET /internal/stream-frame handles empty queue gracefully."""
        res = self.client.get("/internal/stream-frame?session_id=test-session-123&frame_idx=0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status", data)

if __name__ == "__main__":
    unittest.main()
