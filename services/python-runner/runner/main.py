from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import logging
from .executor import execute_python_code

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("python-runner")

app = FastAPI(title="CodeBook Python Execution Runner & Media Bridge", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket sessions & pending media request futures
active_sessions: Dict[str, WebSocket] = {}
pending_media_requests: Dict[str, asyncio.Future] = {}

class ExecutePayload(BaseModel):
    code: str
    language: Optional[str] = "python"
    timeout: Optional[int] = 10
    session_id: Optional[str] = None

class MediaRequestPayload(BaseModel):
    session_id: str
    media_type: str
    duration: Optional[float] = 5.0

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "python-runner",
        "active_ws_sessions": len(active_sessions)
    }

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

@app.websocket("/ws/execute/{session_id}")
async def websocket_execute_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_sessions[session_id] = websocket
    logger.info(f"WebSocket session connected: {session_id}")

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type in ("camera_response", "microphone_response"):
                # Fulfill pending media request future for Python execution
                if session_id in pending_media_requests:
                    fut = pending_media_requests[session_id]
                    if not fut.done():
                        fut.set_result(data)
            elif msg_type == "execute":
                code = data.get("code", "")
                timeout = data.get("timeout", 15)
                loop = asyncio.get_running_loop()
                result = await loop.run_in_executor(
                    None,
                    execute_python_code,
                    code,
                    timeout,
                    session_id
                )
                await websocket.send_json({"type": "execution_result", "data": result})

    except WebSocketDisconnect:
        logger.info(f"WebSocket session disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket session error for {session_id}: {str(e)}")
    finally:
        active_sessions.pop(session_id, None)
        fut = pending_media_requests.pop(session_id, None)
        if fut and not fut.done():
            fut.set_result({
                "status": "error",
                "error_type": "session_disconnected",
                "message": "Browser session disconnected."
            })

@app.post("/internal/media-request")
async def handle_internal_media_request(payload: MediaRequestPayload):
    session_id = payload.session_id
    media_type = payload.media_type

    if session_id not in active_sessions:
        return {
            "status": "error",
            "error_type": "session_disconnected",
            "message": "No active browser session connected for media capture."
        }

    ws = active_sessions[session_id]
    loop = asyncio.get_running_loop()
    future = loop.create_future()
    pending_media_requests[session_id] = future

    try:
        if media_type == "camera":
            await ws.send_json({"type": "camera_request", "session_id": session_id})
            timeout = 30.0
        elif media_type == "microphone":
            duration = float(payload.duration or 5.0)
            await ws.send_json({
                "type": "microphone_request",
                "session_id": session_id,
                "duration": duration
            })
            timeout = duration + 30.0
        else:
            return {"status": "error", "message": f"Unsupported media type: {media_type}"}

        result = await asyncio.wait_for(future, timeout=timeout)
        return result

    except asyncio.TimeoutError:
        return {
            "status": "error",
            "error_type": "timeout",
            "message": "Media request timed out in browser."
        }
    except Exception as e:
        return {
            "status": "error",
            "error_type": "internal_error",
            "message": f"Media bridge request error: {str(e)}"
        }
    finally:
        pending_media_requests.pop(session_id, None)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.python-runner.runner.main:app", host="0.0.0.0", port=8000, reload=True)
