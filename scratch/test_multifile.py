import requests

session_id = "test_session_123"

# Block 1: Create a custom helper module helper.py
code_block_1 = """with open('helper.py', 'w') as f:
    f.write('''
def greet(name):
    return f"Hello {name} from custom helper.py module!"
''')
print("helper.py module created successfully!")
"""

res1 = requests.post("http://localhost:8000/execute", json={"code": code_block_1, "session_id": session_id})
print("Block 1 Result:", res1.json())

# Block 2: Import helper module and test OpenCV & Polars
code_block_2 = """import helper
import polars as pl
import cv2

message = helper.greet("CodeBook User")
print(message)

# Polars DataFrame test
df = pl.DataFrame({"Framework": ["Polars", "Pandas"], "Speed": ["Blazing", "Fast"]})
print("Polars DataFrame:")
print(df)

# OpenCV test
img = cv2.imread("plot.png")
print("OpenCV loaded successfully! Version:", cv2.__version__)
"""

res2 = requests.post("http://localhost:8000/execute", json={"code": code_block_2, "session_id": session_id})
print("Block 2 Result:", res2.json())
