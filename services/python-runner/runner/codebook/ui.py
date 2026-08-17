"""
CodeBook Python UI Widgets Module (codebook.ui)
"""

import os
import json

class UIWidgetEngine:
    def __init__(self):
        pass

    def slider(self, min_val: float = 0.0, max_val: float = 100.0, default: float = 50.0, step: float = 1.0, label: str = "Slider") -> float:
        widget_id = f"slider_{label.lower().replace(' ', '_')}"
        env_val = os.environ.get(f"CODEBOOK_UI_{widget_id}")
        val = float(env_val) if env_val is not None else float(default)
        
        payload = {
            "id": widget_id,
            "type": "slider",
            "min": min_val,
            "max": max_val,
            "step": step,
            "value": val,
            "label": label
        }
        print(f"__CODEBOOK_WIDGET__:{json.dumps(payload)}")
        return val

    def dropdown(self, options: list, default: str = None, label: str = "Select Option") -> str:
        widget_id = f"dropdown_{label.lower().replace(' ', '_')}"
        if not options:
            return ""
        default_val = default if default is not None else str(options[0])
        env_val = os.environ.get(f"CODEBOOK_UI_{widget_id}")
        val = str(env_val) if env_val is not None else default_val

        payload = {
            "id": widget_id,
            "type": "dropdown",
            "options": [str(opt) for opt in options],
            "value": val,
            "label": label
        }
        print(f"__CODEBOOK_WIDGET__:{json.dumps(payload)}")
        return val

    def text_input(self, default: str = "", label: str = "Text Input") -> str:
        widget_id = f"text_{label.lower().replace(' ', '_')}"
        env_val = os.environ.get(f"CODEBOOK_UI_{widget_id}")
        val = str(env_val) if env_val is not None else str(default)

        payload = {
            "id": widget_id,
            "type": "text_input",
            "value": val,
            "label": label
        }
        print(f"__CODEBOOK_WIDGET__:{json.dumps(payload)}")
        return val

    def button(self, label: str = "Click Me") -> bool:
        widget_id = f"btn_{label.lower().replace(' ', '_')}"
        env_val = os.environ.get(f"CODEBOOK_UI_{widget_id}")
        clicked = env_val == "true" or env_val == "1"

        payload = {
            "id": widget_id,
            "type": "button",
            "value": clicked,
            "label": label
        }
        print(f"__CODEBOOK_WIDGET__:{json.dumps(payload)}")
        return clicked

ui = UIWidgetEngine()
