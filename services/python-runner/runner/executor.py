import subprocess
import sys
import tempfile
import os
import time
from typing import Optional
try:
    from .parser import parse_execution_output
except ImportError:
    from parser import parse_execution_output

# Auto-injection code wrapper for headless Matplotlib, Pandas, Polars, and UTF-8 stdout execution
CODE_WRAPPER = """
import sys
import os

# Reconfigure stdout/stderr for UTF-8 on Windows
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Set headless non-GUI backend for Matplotlib before any imports
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    _original_show = plt.show
    def _codebook_show(*args, **kwargs):
        plt.savefig("plot.png", bbox_inches='tight', dpi=150)
        plt.close('all')
    plt.show = _codebook_show
except Exception:
    pass

# Add runner directory to sys.path to enable importing internal codebook package
_runner_dir = os.path.dirname(os.path.abspath(__file__))
if _runner_dir not in sys.path:
    sys.path.insert(0, _runner_dir)

# Add current working directory to sys.path to enable importing local module files (e.g. import helper)
if os.getcwd() not in sys.path:
    sys.path.insert(0, os.getcwd())

# Execute user script
{USER_CODE}

# Auto-save plot if plt figure exists without explicit plt.show()
try:
    import matplotlib.pyplot as plt
    if plt.get_fignums():
        plt.savefig("plot.png", bbox_inches='tight', dpi=150)
        plt.close('all')
except Exception:
    pass
"""

def execute_python_code(code: str, timeout: int = 10, session_id: Optional[str] = None):
    start_time = time.time()
    
    # Persistent session working directory vs temporary directory
    if session_id:
        work_dir = os.path.join(tempfile.gettempdir(), "codebook_sessions", session_id)
        os.makedirs(work_dir, exist_ok=True)
    else:
        work_dir = tempfile.mkdtemp(prefix="codebook_exec_")

    script_path = os.path.join(work_dir, "_runner_script.py")
    wrapped_code = CODE_WRAPPER.format(USER_CODE=code)
    
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(wrapped_code)

    try:
        # Spawn isolated python subprocess in work_dir with UTF-8 environment
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["CODEBOOK_SESSION_ID"] = session_id or "default"
        env["CODEBOOK_RUNNER_PORT"] = os.environ.get("PORT", "8000")
        
        result = subprocess.run(
            [sys.executable, script_path],
            cwd=work_dir,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            env=env
        )

        execution_time = round(time.time() - start_time, 3)
        outputs = parse_execution_output(result.stdout, result.stderr, work_dir)

        # Scan workspace files for session explorer (excluding internal runner script)
        workspace_files = []
        try:
            for item in os.listdir(work_dir):
                if item != "_runner_script.py" and not item.startswith("."):
                    file_path = os.path.join(work_dir, item)
                    if os.path.isfile(file_path):
                        workspace_files.append({
                            "name": item,
                            "size": os.path.getsize(file_path),
                        })
        except Exception:
            pass

        return {
            "status": "success" if result.returncode == 0 else "error",
            "executionTime": execution_time,
            "outputs": outputs,
            "workspaceFiles": workspace_files,
        }

    except subprocess.TimeoutExpired:
        return {
            "status": "error",
            "executionTime": timeout,
            "outputs": [
                {
                    "type": "error",
                    "content": f"Execution Timed Out: Python code exceeded the limit of {timeout} seconds.",
                }
            ],
            "workspaceFiles": [],
        }
    except Exception as e:
        return {
            "status": "error",
            "executionTime": round(time.time() - start_time, 3),
            "outputs": [
                {
                    "type": "error",
                    "content": f"Execution Error: {str(e)}",
                }
            ],
            "workspaceFiles": [],
        }
