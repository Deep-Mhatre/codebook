from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from .executor import execute_python_code

app = FastAPI(title="CodeBook Python Execution Runner", version="1.1.0")

class ExecutePayload(BaseModel):
    code: str
    language: Optional[str] = "python"
    timeout: Optional[int] = 10
    session_id: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "python-runner"}

@app.post("/execute")
def run_code(payload: ExecutePayload):
    if not payload.code or not payload.code.strip():
        raise HTTPException(status_code=400, detail="Code snippet cannot be empty.")

    result = execute_python_code(
        code=payload.code,
        timeout=payload.timeout or 10,
        session_id=payload.session_id
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.python-runner.runner.main:app", host="0.0.0.0", port=8000, reload=True)
