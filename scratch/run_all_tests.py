import requests
import json
import time

TEST_CASES = [
    {
        "id": 1,
        "name": "Basic Python execution",
        "code": """name = "CodeBook"
version = 1

numbers = [10, 20, 30, 40, 50]

total = sum(numbers)
average = total / len(numbers)

print("Product:", name)
print("Version:", version)
print("Numbers:", numbers)
print("Total:", total)
print("Average:", average)

for number in numbers:
    print(number, "->", number * 2)"""
    },
    {
        "id": 2,
        "name": "Functions",
        "code": """def calculate_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

students = {
    "Rahul": 92,
    "Amit": 84,
    "Priya": 76,
    "Neha": 61
}

for name, score in students.items():
    grade = calculate_grade(score)
    print(f"{name}: {score}  {grade}")"""
    },
    {
        "id": 3,
        "name": "Classes / OOP",
        "code": """class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def average(self):
        return sum(self.marks) / len(self.marks)

    def result(self):
        avg = self.average()
        if avg >= 40:
            return "PASS"
        return "FAIL"

students = [
    Student("Rahul", [80, 75, 90]),
    Student("Priya", [95, 88, 92]),
    Student("Amit", [35, 42, 38])
]

for student in students:
    print(
        f"{student.name}: "
        f"{student.average():.2f} - "
        f"{student.result()}"
    )"""
    },
    {
        "id": 4,
        "name": "NumPy Test",
        "code": """import numpy as np

numbers = np.array([10, 20, 30, 40, 50])

print("Array:", numbers)
print("Mean:", numbers.mean())
print("Maximum:", numbers.max())
print("Minimum:", numbers.min())
print("Standard deviation:", numbers.std())

matrix = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])

print("\\nMatrix:")
print(matrix)

print("\\nMatrix  2:")
print(matrix * 2)"""
    },
    {
        "id": 5,
        "name": "Pandas Test",
        "code": """import pandas as pd

data = {
    "Name": ["Rahul", "Priya", "Amit", "Neha", "Arjun"],
    "Age": [21, 22, 20, 23, 21],
    "Score": [85, 92, 67, 78, 95]
}

df = pd.DataFrame(data)

print("Complete DataFrame:")
print(df)

print("\\nAverage Score:")
print(df["Score"].mean())

print("\\nStudents above 80:")
print(df[df["Score"] > 80])"""
    },
    {
        "id": 6,
        "name": "Pandas Data Analysis",
        "code": """import pandas as pd

sales = pd.DataFrame({
    "Product": [
        "Laptop",
        "Phone",
        "Laptop",
        "Tablet",
        "Phone",
        "Tablet"
    ],
    "Region": [
        "Mumbai",
        "Delhi",
        "Mumbai",
        "Pune",
        "Delhi",
        "Pune"
    ],
    "Sales": [
        85000,
        45000,
        92000,
        30000,
        52000,
        35000
    ]
})

print("Sales Data:")
print(sales)

print("\\nTotal Sales:")
print(sales["Sales"].sum())

print("\\nSales by Product:")
print(
    sales.groupby("Product")["Sales"]
    .sum()
)

print("\\nSales by Region:")
print(
    sales.groupby("Region")["Sales"]
    .sum()
)"""
    },
    {
        "id": 7,
        "name": "Matplotlib Test",
        "code": """import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 150, 180, 170, 220, 250]

plt.figure(figsize=(10, 5))

plt.plot(
    months,
    sales,
    marker="o"
)

plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.grid(True)

plt.show()"""
    },
    {
        "id": 8,
        "name": "Bar Chart",
        "code": """import matplotlib.pyplot as plt

products = ["Laptop", "Phone", "Tablet", "Monitor"]
sales = [120, 250, 150, 90]

plt.figure(figsize=(9, 5))

plt.bar(products, sales)

plt.title("Product Sales")
plt.xlabel("Product")
plt.ylabel("Units Sold")

plt.show()"""
    },
    {
        "id": 9,
        "name": "Multiple Charts",
        "code": """import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]

sales = [100, 150, 180, 220]
profit = [20, 35, 45, 60]

plt.figure(figsize=(8, 4))
plt.plot(months, sales, marker="o")
plt.title("Sales")
plt.show()

plt.figure(figsize=(8, 4))
plt.bar(months, profit)
plt.title("Profit")
plt.show()"""
    },
    {
        "id": 10,
        "name": "Seaborn Test",
        "code": """import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")

print(tips.head())

sns.scatterplot(
    data=tips,
    x="total_bill",
    y="tip",
    hue="day"
)

plt.title("Tips vs Total Bill")
plt.show()"""
    },
    {
        "id": 11,
        "name": "File Generation Test",
        "code": """import pandas as pd

df = pd.DataFrame({
    "Product": ["Laptop", "Phone", "Tablet"],
    "Price": [80000, 45000, 30000]
})

df.to_csv("products.csv", index=False)

print("CSV file created successfully.")"""
    },
    {
        "id": 12,
        "name": "JSON Test",
        "code": """import json

user = {
    "name": "Ghost",
    "role": "Developer",
    "skills": [
        "Python",
        "React",
        "AI Automation"
    ]
}

json_data = json.dumps(user, indent=4)

print(json_data)"""
    },
    {
        "id": 13,
        "name": "HTTP / Requests Test",
        "code": """import requests

response = requests.get("https://api.github.com")

print("Status:", response.status_code)
print("Content-Type:", response.headers.get("content-type"))

data = response.json()

print("GitHub API message:", data.get("message", "No message"))"""
    },
    {
        "id": 14,
        "name": "Exception Handling",
        "code": """print("Starting program...")

numbers = [10, 20, 30]

try:
    result = numbers[10]
    print(result)

except IndexError as error:
    print("Caught error:", error)

print("Program continued successfully.")"""
    },
    {
        "id": 15,
        "name": "Intentional Runtime Error",
        "code": """numbers = [1, 2, 3]

print("Before error")

result = numbers[10]

print("This should never execute")"""
    },
    {
        "id": 16,
        "name": "Syntax Error",
        "code": """def hello()
    print("Hello")"""
    },
    {
        "id": 17,
        "name": "Timeout Test",
        "code": """import time

print("Starting...")

time.sleep(30)

print("Finished")"""
    },
    {
        "id": 18,
        "name": "Infinite Loop Test",
        "code": """print("Starting infinite loop...")

while True:
    pass"""
    },
    {
        "id": 19,
        "name": "Memory Stress Test",
        "code": """print("Allocating memory...")

data = []

for i in range(10_000_000):
    data.append(i)

print("Finished")"""
    },
    {
        "id": 20,
        "name": "The Big Final Test",
        "code": """import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Create dataset
np.random.seed(42)

months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
]

sales = np.random.randint(100, 300, 12)

df = pd.DataFrame({
    "Month": months,
    "Sales": sales
})

# Analysis
print("Sales Data:")
print(df)

print("\\nStatistics:")
print(df["Sales"].describe())

print("\\nAverage Sales:")
print(df["Sales"].mean())

# Visualization
plt.figure(figsize=(10, 5))

plt.plot(
    df["Month"],
    df["Sales"],
    marker="o"
)

plt.title("Monthly Sales Performance")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.grid(True)

plt.show()"""
    }
]

def run_tests():
    results = []
    print("Starting 20-test suite against CodeBook Python Execution Runner...\n")

    for test in TEST_CASES:
        t_id = test["id"]
        t_name = test["name"]
        code = test["code"]
        print(f"Executing Test {t_id}: {t_name}...")

        payload = {"code": code, "timeout": 10}
        start_t = time.time()
        try:
            res = requests.post("http://localhost:8000/execute", json=payload, timeout=15)
            duration = round(time.time() - start_t, 3)
            if res.status_code == 200:
                data = res.json()
                results.append({
                    "id": t_id,
                    "name": t_name,
                    "status_code": 200,
                    "status": data.get("status"),
                    "execution_time": data.get("executionTime"),
                    "outputs": data.get("outputs", []),
                    "duration": duration,
                })
                print(f"  -> Returned status={data.get('status')} in {duration}s")
            else:
                results.append({
                    "id": t_id,
                    "name": t_name,
                    "status_code": res.status_code,
                    "error": res.text,
                    "duration": duration,
                })
                print(f"  -> Returned HTTP {res.status_code}")
        except Exception as e:
            duration = round(time.time() - start_t, 3)
            results.append({
                "id": t_id,
                "name": t_name,
                "status_code": 500,
                "error": str(e),
                "duration": duration,
            })
            print(f"  -> Failed with exception: {str(e)}")

    with open("scratch/test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("\n✅ All 20 tests executed! Results saved to scratch/test_results.json")

if __name__ == "__main__":
    run_tests()
