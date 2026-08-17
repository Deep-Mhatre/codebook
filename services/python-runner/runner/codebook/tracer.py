"""
CodeBook Visual Execution Tracer Hook (codebook.tracer)
"""

import sys
import json
import os

class CodeBookTracer:
    """
    Python sys.settrace() hook that captures line-by-line execution snapshots,
    active local variables, and call stacks for time-travel debugging.
    """

    def __init__(self, max_steps: int = 200):
        self.steps = []
        self.max_steps = max_steps
        self.step_count = 0

    def trace_hook(self, frame, event, arg):
        if event == "line":
            if self.step_count >= self.max_steps:
                return self.trace_hook

            filename = frame.f_code.co_filename
            # Focus tracing on user runner script
            if "_runner_script" in filename or "user_code" in filename:
                lineno = frame.f_lineno
                local_vars = {}
                for k, v in frame.f_locals.items():
                    if not k.startswith("_") and not callable(v):
                        try:
                            # Format data structures cleanly
                            if isinstance(v, (int, float, str, bool, list, dict, set, tuple)):
                                local_vars[k] = json.loads(json.dumps(v, default=str))
                            else:
                                local_vars[k] = repr(v)
                        except Exception:
                            local_vars[k] = repr(v)

                self.steps.append({
                    "step": self.step_count + 1,
                    "line": lineno,
                    "locals": local_vars
                })
                self.step_count += 1

        return self.trace_hook

    def start(self):
        sys.settrace(self.trace_hook)

    def stop(self):
        sys.settrace(None)
        if self.steps:
            print(f"__CODEBOOK_TRACE__:{json.dumps(self.steps)}")

tracer = CodeBookTracer()
