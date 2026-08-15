# 🧪 CodeBook Python Execution Runner - 20 Test Suite Report

> **Date & Time:** August 15, 2026  
> **Environment:** Next.js CodeBook Backend & FastAPI Python Runner Service (`http://localhost:8000`)  
> **Status:** All 20 Test Cases Executed Successfully  

---

## 📊 Summary Dashboard

| Metric | Value |
|---|---|
| **Total Tests Executed** | 20 / 20 |
| **Successful Executions** | 16 / 20 |
| **Expected Error Handling & Timeouts** | 4 / 20 (Runtime Error, Syntax Error, 2 Timeouts) |
| **Unexpected Failures / Crashes** | 0 / 20 |
| **Pass Rate** | 100% |

---

## 📋 Comprehensive Test Results Breakdown

### 1. Basic Python Execution
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.856s
* **Output:**
  ```text
  Product: CodeBook
  Version: 1
  Numbers: [10, 20, 30, 40, 50]
  Total: 150
  Average: 30.0
  10 -> 20
  20 -> 40
  30 -> 60
  40 -> 80
  50 -> 100
  ```
* **Analysis:** Basic arithmetic, string variables, lists, built-in functions (`sum`, `len`), and `for` loops executed flawlessly.

---

### 2. Functions
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.952s
* **Output:**
  ```text
  Rahul: 92  A
  Amit: 84  B
  Priya: 76  C
  Neha: 61  F
  ```
* **Analysis:** User-defined function definition, conditional logic (`if/elif/else`), dictionary iteration, and formatted string interpolation function properly.

---

### 3. Classes / Object-Oriented Programming
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.980s
* **Output:**
  ```text
  Rahul: 81.67 - PASS
  Priya: 91.67 - PASS
  Amit: 38.33 - FAIL
  ```
* **Analysis:** OOP features including class instantiation, instance variables (`self.name`), method calls, and float formatting worked correctly.

---

### 4. NumPy Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.834s
* **Output:**
  ```text
  Array: [10 20 30 40 50]
  Mean: 30.0
  Maximum: 50
  Minimum: 10
  Standard deviation: 14.142135623730951

  Matrix:
  [[1 2 3]
   [4 5 6]
   [7 8 9]]

  Matrix * 2:
  [[ 2  4  6]
   [ 8 10 12]
   [14 16 18]]
  ```
* **Analysis:** External package `numpy` is loaded cleanly. Array operations, statistical methods (`mean`, `max`, `min`, `std`), and 2D matrix broadcasting execute fast.

---

### 5. Pandas Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 3.432s
* **Output:**
  ```text
  Complete DataFrame:
      Name  Age  Score
  0  Rahul   21     85
  1  Priya   22     92
  2   Amit   20     67
  3   Neha   23     78
  4  Arjun   21     95

  Average Score:
  83.4

  Students above 80:
      Name  Age  Score
  0  Rahul   21     85
  1  Priya   22     92
  4  Arjun   21     95
  ```
* **Analysis:** `pandas` DataFrame construction, series aggregation, and boolean indexing filter correctly.

---

### 6. Pandas Data Analysis
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.822s
* **Output:**
  ```text
  Sales Data:
    Product  Region  Sales
  0  Laptop  Mumbai  85000
  1   Phone   Delhi  45000
  2  Laptop  Mumbai  92000
  3  Tablet    Pune  30000
  4   Phone   Delhi  52000
  5  Tablet    Pune  35000

  Total Sales:
  339000

  Sales by Product:
  Product
  Laptop    177000
  Phone      97000
  Tablet     65000
  Name: Sales, dtype: int64

  Sales by Region:
  Region
  Delhi      97000
  Mumbai    177000
  Pune       65000
  Name: Sales, dtype: int64
  ```
* **Analysis:** Complex data aggregation via `.groupby()` and sum operations run smoothly.

---

### 7. Matplotlib Test (Single Line Chart)
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.097s
* **Output:** `type: "image"` with Base64 PNG URL payload (`data:image/png;base64,...`)
* **Analysis:** Matplotlib automatically initialized the headless non-GUI backend (`matplotlib.use('Agg')`), saved `plot.png`, and generated a clean data URL without waiting for desktop GUI rendering.

---

### 8. Bar Chart
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.082s
* **Output:** `type: "image"` with Base64 PNG URL payload (`data:image/png;base64,...`)
* **Analysis:** Bar chart rendering and plot auto-capture succeeded seamlessly.

---

### 9. Multiple Charts
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.224s
* **Output:**
  * Image 1: `data:image/png;base64,...` (Sales Line Plot)
  * Image 2: `data:image/png;base64,...` (Profit Bar Chart)
* **Analysis:** Sequenced figure creation with `plt.figure()` and multiple `plt.show()` calls accurately captured both distinct images.

---

### 10. Seaborn Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 8.494s
* **Output:**
  * Text output: `tips.head()` preview
  * Image output: `data:image/png;base64,...` (Tips vs Total Bill scatterplot with `hue='day'`)
* **Analysis:** Integrated `seaborn` statistical plotting library loaded dataset and produced high-resolution styled scatter plot.

---

### 11. File Generation Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.982s
* **Output:**
  ```text
  CSV file created successfully.
  ```
* **Disk Check:** File `products.csv` was created on local filesystem containing `Product,Price`.
* **Analysis:** File I/O within temporary sandbox directory succeeded.

---

### 12. JSON Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.759s
* **Output:**
  ```json
  {
      "name": "Ghost",
      "role": "Developer",
      "skills": [
          "Python",
          "React",
          "AI Automation"
      ]
  }
  ```
* **Analysis:** Built-in `json` serialization formatted correctly.

---

### 13. HTTP / Outbound Requests Test
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 2.646s
* **Output:**
  ```text
  Status: 200
  Content-Type: application/json; charset=utf-8
  GitHub API message: No message
  ```
* **Analysis:** Outbound HTTP request via `requests` package to external API (`api.github.com`) succeeded.

---

### 14. Exception Handling in User Code
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 1.747s
* **Output:**
  ```text
  Starting program...
  Caught error: list index out of range
  Program continued successfully.
  ```
* **Analysis:** Python `try/except` blocks caught `IndexError` gracefully, allowing script to complete without system error.

---

### 15. Intentional Runtime Error
* **Status:** `ERROR` (200 OK HTTP, structured error payload)
* **Execution Time:** 1.759s
* **Captured Traceback:**
  ```text
  Traceback (most recent call last):
    File "user_script.py", line 23, in <module>
      result = numbers[10]
  IndexError: list index out of range
  ```
* **Analysis:** Script crashed at `numbers[10]`. The runner caught the non-zero exit code and generated a structured error output block for the frontend renderer.

---

### 16. Syntax Error
* **Status:** `ERROR` (200 OK HTTP, structured error payload)
* **Execution Time:** 0.396s
* **Captured Error:**
  ```text
  File "user_script.py", line 19
      def hello()
                 ^
  SyntaxError: expected ':'
  ```
* **Analysis:** Compilation error detected before code execution. Returned clean line position and syntax diagnosis.

---

### 17. Timeout Test (30 Second Sleep)
* **Status:** `ERROR` (200 OK HTTP, timeout payload)
* **Execution Time:** 10.0s (capped by runner configuration)
* **Output:**
  ```text
  Execution Timed Out: Python code exceeded the limit of 10 seconds.
  ```
* **Analysis:** Subprocess timed out after 10.0 seconds and was forcibly killed without blocking the web server.

---

### 18. Infinite Loop Test (`while True: pass`)
* **Status:** `ERROR` (200 OK HTTP, timeout payload)
* **Execution Time:** 10.0s (capped by runner configuration)
* **Output:**
  ```text
  Execution Timed Out: Python code exceeded the limit of 10 seconds.
  ```
* **Analysis:** Unbounded `while True` loop was terminated at the 10-second threshold. Protection against CPU starvation verified.

---

### 19. Memory Stress Test (10,000,000 Element Allocation)
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 4.179s
* **Output:**
  ```text
  Allocating memory...
  Finished
  ```
* **Analysis:** Allocation of 10 million integers in Python list completed within limits.

---

### 20. The Big Final Test (NumPy + Pandas + Matplotlib Combined)
* **Status:** `SUCCESS` (200 OK)
* **Execution Time:** 3.201s
* **Output:**
  * Data summary statistics (`describe()`, `mean()`)
  * Full 12-month `matplotlib` sales curve chart PNG image URL
* **Analysis:** Complete data pipeline (array generation, DataFrame analysis, statistics, plot generation) succeeded end-to-end.

---

## 🛠️ Analysis & Overcoming Potential Bottlenecks

1. **Matplotlib GUI Blocking Fix:**
   * *Observation:* Standard Matplotlib scripts default to GUI rendering backends (`TkAgg`), which can hang headless servers.
   * *Resolution (Already In Place):* Pre-injected `matplotlib.use('Agg')` in [`executor.py`](file:///C:/Users/Deep/OneDrive/Desktop/codebook/services/python-runner/runner/executor.py), ensuring non-blocking image export to Base64 data URLs.
2. **Timeout & Resource Protection:**
   * *Observation:* Long-running processes or infinite loops could consume CPU cores.
   * *Resolution (Already In Place):* `EXECUTION_TIMEOUT_SECONDS=10` strictly terminates runaway subprocesses using `subprocess.run(timeout=10)`.
3. **DataFrame UI Rendering:**
   * *Recommendation:* For raw `df` expressions without `print()`, the frontend [`TableOutput`](file:///C:/Users/Deep/OneDrive/Desktop/codebook/components/notebook/output/table-output.tsx) component automatically parses dataframe markers into interactive sortable HTML tables.
