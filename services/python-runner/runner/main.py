from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import asyncio
import logging

try:
    from .executor import execute_python_code
except ImportError:
    from executor import execute_python_code

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("python-runner")

app = FastAPI(title="CodeBook Python Execution Runner & Media Bridge", version="1.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket sessions, pending media request futures, camera stream & audio stream frame queues
active_sessions: Dict[str, WebSocket] = {}
pending_media_requests: Dict[str, asyncio.Future] = {}
stream_frame_queues: Dict[str, asyncio.Queue] = {}
audio_stream_queues: Dict[str, asyncio.Queue] = {}

class ExecutePayload(BaseModel):
    code: str
    language: Optional[str] = "python"
    timeout: Optional[int] = 10
    session_id: Optional[str] = None

class MediaRequestPayload(BaseModel):
    session_id: str
    media_type: str
    duration: Optional[float] = 5.0
    fps: Optional[int] = 30
    chunk_seconds: Optional[float] = 0.1

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "python-runner",
        "active_ws_sessions": len(active_sessions),
        "active_camera_streams": len(stream_frame_queues),
        "active_audio_streams": len(audio_stream_queues)
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

@app.websocket("/ws/execute/{session_id:path}")
async def websocket_execute_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_sessions[session_id] = websocket
    logger.info(f"WebSocket session connected: {session_id}")

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type in ("camera_response", "microphone_response"):
                if session_id in pending_media_requests:
                    fut = pending_media_requests[session_id]
                    if not fut.done():
                        fut.set_result(data)
            elif msg_type == "camera_stream_frame":
                if session_id in stream_frame_queues:
                    queue = stream_frame_queues[session_id]
                    if queue.full():
                        try:
                            queue.get_nowait()
                        except asyncio.QueueEmpty:
                            pass
                    await queue.put(data.get("image_data", ""))
            elif msg_type == "microphone_stream_chunk":
                if session_id in audio_stream_queues:
                    queue = audio_stream_queues[session_id]
                    if queue.full():
                        try:
                            queue.get_nowait()
                        except asyncio.QueueEmpty:
                            pass
                    await queue.put({
                        "audio_data": data.get("audio_data", ""),
                        "sample_rate": data.get("sample_rate", 44100)
                    })
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
        stream_frame_queues.pop(session_id, None)
        audio_stream_queues.pop(session_id, None)
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

@app.post("/internal/stream-start")
async def handle_stream_start(payload: MediaRequestPayload):
    session_id = payload.session_id
    fps = payload.fps or 30

    stream_frame_queues[session_id] = asyncio.Queue(maxsize=10)

    if session_id in active_sessions:
        ws = active_sessions[session_id]
        await ws.send_json({
            "type": "camera_stream_start",
            "session_id": session_id,
            "fps": fps
        })
        return {"status": "success", "message": "Camera stream initialized"}
    else:
        return {"status": "success", "message": "Camera stream initialized (offline mode)"}

@app.get("/internal/stream-frame")
async def handle_stream_frame(session_id: str, frame_idx: int):
    if session_id in stream_frame_queues:
        queue = stream_frame_queues[session_id]
        try:
            image_data = await asyncio.wait_for(queue.get(), timeout=1.0)
            return {"status": "success", "image_data": image_data, "frame_idx": frame_idx}
        except asyncio.TimeoutError:
            pass

    return {"status": "empty", "image_data": None, "frame_idx": frame_idx}

@app.post("/internal/audio-stream-start")
async def handle_audio_stream_start(payload: MediaRequestPayload):
    session_id = payload.session_id
    chunk_seconds = payload.chunk_seconds or 0.1

    audio_stream_queues[session_id] = asyncio.Queue(maxsize=20)

    if session_id in active_sessions:
        ws = active_sessions[session_id]
        await ws.send_json({
            "type": "microphone_stream_start",
            "session_id": session_id,
            "chunk_seconds": chunk_seconds
        })
        return {"status": "success", "message": "Audio stream initialized"}
    else:
        return {"status": "success", "message": "Audio stream initialized (offline mode)"}

@app.get("/internal/audio-stream-chunk")
async def handle_audio_stream_chunk(session_id: str, chunk_idx: int):
    if session_id in audio_stream_queues:
        queue = audio_stream_queues[session_id]
        try:
            chunk_data = await asyncio.wait_for(queue.get(), timeout=1.0)
            return {
                "status": "success",
                "audio_data": chunk_data.get("audio_data"),
                "sample_rate": chunk_data.get("sample_rate", 44100),
                "chunk_idx": chunk_idx
            }
        except asyncio.TimeoutError:
            pass

    return {"status": "empty", "audio_data": None, "sample_rate": 44100, "chunk_idx": chunk_idx}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.python-runner.runner.main:app", host="0.0.0.0", port=8000, reload=True)
