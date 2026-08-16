"""
CodeBook Interactive Output Module
Provides python helpers for rendering interactive Plotly charts, custom HTML/JS, and 3D WebGL meshes.
"""

import json
from typing import Union, Dict, Any

class OutputManager:
    """
    Interactive output renderer manager for CodeBook notebooks.
    """

    def plotly(self, fig_or_spec: Union[Dict[str, Any], Any]) -> Dict[str, Any]:
        """
        Renders an interactive Plotly chart in CodeBook.

        Args:
            fig_or_spec: Plotly Figure instance, dictionary, or JSON string.

        Returns:
            dict: Structured output dictionary.
        """
        if hasattr(fig_or_spec, "to_json"):
            spec = json.loads(fig_or_spec.to_json())
        elif isinstance(fig_or_spec, str):
            spec = json.loads(fig_or_spec)
        elif isinstance(fig_or_spec, dict):
            spec = fig_or_spec
        else:
            raise TypeError("Expected Plotly Figure object, dict, or JSON string.")

        print(f"__CODEBOOK_OUTPUT_PLOTLY__:{json.dumps(spec)}")
        return {"type": "plotly", "spec": spec}

    def html(self, html_string: str) -> Dict[str, Any]:
        """
        Renders a custom HTML/CSS/JS interactive block in CodeBook.

        Args:
            html_string (str): HTML markup string.

        Returns:
            dict: Structured output dictionary.
        """
        if not isinstance(html_string, str):
            raise TypeError("Expected HTML markup as string.")

        print(f"__CODEBOOK_OUTPUT_HTML__:{html_string}")
        return {"type": "html", "content": html_string}

    def webgl(self, mesh_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Renders a 3D WebGL model or point cloud in CodeBook.

        Args:
            mesh_data (dict): Mesh vertices, faces, or point cloud vectors.

        Returns:
            dict: Structured output dictionary.
        """
        if not isinstance(mesh_data, dict):
            raise TypeError("Expected dictionary containing vertices or faces.")

        print(f"__CODEBOOK_OUTPUT_WEBGL__:{json.dumps(mesh_data)}")
        return {"type": "webgl", "data": mesh_data}

output = OutputManager()
