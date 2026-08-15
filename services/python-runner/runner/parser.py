import re
import json
import base64
import os

def parse_execution_output(stdout_str: str, stderr_str: str, temp_dir: str):
    """
    Parses execution output and converts stdout, stderr, Pandas DataFrames,
    and generated plot images into structured JSON protocol objects.
    """
    outputs = []

    # 1. Check for standard error / tracebacks
    if stderr_str and stderr_str.strip():
        outputs.append({
            "type": "error",
            "content": stderr_str.strip()
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
            # Remove DataFrame tag from text stdout
            stdout_str = re.sub(r"__CODEBOOK_DATAFRAME_START__(.*?)__CODEBOOK_DATAFRAME_END__", "", stdout_str, flags=re.DOTALL).strip()
        except Exception:
            pass

    # 4. Standard text stdout
    if stdout_str and stdout_str.strip():
        outputs.append({
            "type": "text",
            "content": stdout_str.strip()
        })

    return outputs
