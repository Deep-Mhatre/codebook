"""
Unit test for Chunk 3.1: Interactive Output Helper API
"""

import sys
import os
import unittest

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

import codebook

class TestInteractiveOutputAPI(unittest.TestCase):

    def test_output_plotly_helper(self):
        """Verify codebook.output.plotly formats Plotly JSON specs."""
        spec = {"data": [{"x": [1, 2], "y": [3, 4]}], "layout": {"title": "Test"}}
        res = codebook.output.plotly(spec)
        self.assertEqual(res["type"], "plotly")
        self.assertEqual(res["spec"]["layout"]["title"], "Test")

    def test_output_html_helper(self):
        """Verify codebook.output.html formats HTML content."""
        res = codebook.output.html("<h1>Hello CodeBook</h1>")
        self.assertEqual(res["type"], "html")
        self.assertEqual(res["content"], "<h1>Hello CodeBook</h1>")

    def test_output_webgl_helper(self):
        """Verify codebook.output.webgl formats WebGL mesh data."""
        mesh = {"vertices": [[0, 0, 0], [1, 1, 1]]}
        res = codebook.output.webgl(mesh)
        self.assertEqual(res["type"], "webgl")
        self.assertEqual(res["data"], mesh)

if __name__ == "__main__":
    unittest.main()
