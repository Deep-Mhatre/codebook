import re
import json
import base64
import os

def parse_execution_output(stdout_str: str, stderr_str: str, temp_dir: str):
    """
    Parses execution output and converts stdout, stderr, Pandas DataFrames,
    generated plot images, Plotly specs, HTML widgets, and WebGL meshes
    into structured JSON protocol objects.
    """
    outputs = []

    # 1. Check for standard error / tracebacks (ignoring C++ TFLite informational logs)
    if stderr_str and stderr_str.strip():
        filtered_stderr_lines = [
            line for line in stderr_str.splitlines()
            if not (line.startswith("INFO:") or line.startswith("WARNING:") or line.startswith("W0000"))
        ]
        filtered_stderr = "\n".join(filtered_stderr_lines).strip()
        if filtered_stderr:
            outputs.append({
                "type": "error",
                "content": filtered_stderr
            })
            return outputs

    # 2. Check for generated plot images in temp directory
    plot_path = os.path.join(temp_dir, "plot.png")
    if os.path.exists(plot_path):
        try:
            with open(plot_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
                outputs.append({
                    "type": "image",
                    "imageUrl": f"data:image/png;base64,{encoded_string}"
                })
        except Exception as e:
            outputs.append({
                "type": "error",
                "content": f"Failed to encode plot image: {str(e)}"
            })

    # 3. Check for JSON serialized Pandas DataFrame output tag
    df_match = re.search(r"__CODEBOOK_DATAFRAME_START__(.*?)__CODEBOOK_DATAFRAME_END__", stdout_str, re.DOTALL)
    if df_match:
        try:
            raw_json = df_match.group(1).strip()
            table_data = json.loads(raw_json)
            outputs.append({
                "type": "table",
                "tableData": table_data
            })
            stdout_str = re.sub(r"__CODEBOOK_DATAFRAME_START__(.*?)__CODEBOOK_DATAFRAME_END__", "", stdout_str, flags=re.DOTALL).strip()
        except Exception:
            pass

    # 4. Check for Plotly chart output tag
    for line in stdout_str.splitlines():
        if line.startswith("__CODEBOOK_OUTPUT_PLOTLY__:"):
            try:
                spec_str = line.split("__CODEBOOK_OUTPUT_PLOTLY__:", 1)[1]
                spec = json.loads(spec_str)
                outputs.append({
                    "type": "plotly",
                    "spec": spec
                })
                stdout_str = stdout_str.replace(line, "").strip()
            except Exception:
                pass
        elif line.startswith("__CODEBOOK_OUTPUT_HTML__:"):
            try:
                html_content = line.split("__CODEBOOK_OUTPUT_HTML__:", 1)[1]
                outputs.append({
                    "type": "html",
                    "content": html_content
                })
                stdout_str = stdout_str.replace(line, "").strip()
            except Exception:
                pass
        elif line.startswith("__CODEBOOK_OUTPUT_WEBGL__:"):
            try:
                data_str = line.split("__CODEBOOK_OUTPUT_WEBGL__:", 1)[1]
                mesh_data = json.loads(data_str)
                outputs.append({
                    "type": "webgl",
                    "data": mesh_data
                })
                stdout_str = stdout_str.replace(line, "").strip()
            except Exception:
                pass
        elif line.startswith("__CODEBOOK_WIDGET__:"):
            try:
                widget_str = line.split("__CODEBOOK_WIDGET__:", 1)[1]
                widget_data = json.loads(widget_str)
                outputs.append({
                    "type": "widget",
                    "widgetData": widget_data
                })
                stdout_str = stdout_str.replace(line, "").strip()
            except Exception:
                pass
        elif line.startswith("__CODEBOOK_VISION_OVERLAY__:"):
            stdout_str = stdout_str.replace(line, "").strip()
        elif line.startswith("__CODEBOOK_TRACE__:"):
            try:
                trace_str = line.split("__CODEBOOK_TRACE__:", 1)[1]
                trace_steps = json.loads(trace_str)
                outputs.append({
                    "type": "trace",
                    "traceData": trace_steps
                })
                stdout_str = stdout_str.replace(line, "").strip()
            except Exception:
                pass

    # 5. Standard text stdout
    if stdout_str and stdout_str.strip():
        outputs.append({
            "type": "text",
            "content": stdout_str.strip()
        })

    return outputs
