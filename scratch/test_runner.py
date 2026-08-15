import requests

payload = {
    "code": "import pandas as pd\ndf = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Score': [95, 88]})\nprint('DataFrame Test:')\nprint(df)"
}

res = requests.post("http://localhost:8000/execute", json=payload)
print("Response Status:", res.status_code)
print("Execution Result:", res.json())
