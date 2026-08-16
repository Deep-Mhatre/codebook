"""
Unit test for Chunk 3.2: Parser Engine Interactive Output Tags
"""

import sys
import os
import unittest
import tempfile

runner_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "python-runner", "runner"))
if runner_dir not in sys.path:
    sys.path.insert(0, runner_dir)

from parser import parse_execution_output

class TestInteractiveOutputParser(unittest.TestCase):

    def test_parse_plotly_output(self):
        """Verify __CODEBOOK_OUTPUT_PLOTLY__ stdout parses into Plotly output type."""
        stdout = '__CODEBOOK_OUTPUT_PLOTLY__:{"data": [{"x": [1, 2], "y": [3, 4]}]}'
        with tempfile.TemporaryDirectory() as tmp:
            res = parse_execution_output(stdout, "", tmp)
            self.assertEqual(len(res), 1)
            self.assertEqual(res[0]["type"], "plotly")
            self.assertEqual(res[0]["spec"]["data"][0]["x"], [1, 2])

    def test_parse_html_output(self):
        """Verify __CODEBOOK_OUTPUT_HTML__ stdout parses into HTML output type."""
        stdout = '__CODEBOOK_OUTPUT_HTML__:<div id="widget">Test Widget</div>'
        with tempfile.TemporaryDirectory() as tmp:
            res = parse_execution_output(stdout, "", tmp)
            self.assertEqual(len(res), 1)
            self.assertEqual(res[0]["type"], "html")
            self.assertEqual(res[0]["content"], '<div id="widget">Test Widget</div>')

    def test_parse_webgl_output(self):
        """Verify __CODEBOOK_OUTPUT_WEBGL__ stdout parses into WebGL output type."""
        stdout = '__CODEBOOK_OUTPUT_WEBGL__:{"vertices": [[0, 0, 0]]}'
        with tempfile.TemporaryDirectory() as tmp:
            res = parse_execution_output(stdout, "", tmp)
            self.assertEqual(len(res), 1)
            self.assertEqual(res[0]["type"], "webgl")
            self.assertEqual(res[0]["data"]["vertices"], [[0, 0, 0]])

if __name__ == "__main__":
    unittest.main()
