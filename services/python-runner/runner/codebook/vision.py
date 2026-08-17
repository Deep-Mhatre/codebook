"""
CodeBook Vision & Stream Canvas Overlay Module (codebook.vision)
Provides high-level zero-config computer vision utilities (hand detection, finger counting, bounding box overlays).
"""

import json
import os
import urllib.request
from typing import List, NamedTuple, Optional

_landmarker_instance = None
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
MODEL_DIR = os.path.join(os.path.expanduser("~"), ".codebook", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "hand_landmarker.task")

class BBox(NamedTuple):
    x: float
    y: float
    width: float
    height: float

class HandResult:
    def __init__(self, bbox: BBox, finger_count: int, landmarks: list):
        self.bbox = bbox
        self.finger_count = finger_count
        self.landmarks = landmarks

def _get_landmarker(max_hands: int = 2):
    global _landmarker_instance
    if _landmarker_instance is not None:
        return _landmarker_instance

    try:
        import cv2
        import mediapipe as mp
        from mediapipe.tasks.python import vision as mp_vision, BaseOptions

        if not os.path.exists(MODEL_PATH):
            os.makedirs(MODEL_DIR, exist_ok=True)
            urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)

        options = mp_vision.HandLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            num_hands=max_hands,
            min_hand_detection_confidence=0.7,
            running_mode=mp_vision.RunningMode.IMAGE
        )
        _landmarker_instance = mp_vision.HandLandmarker.create_from_options(options)
        return _landmarker_instance
    except Exception as e:
        print(f"CodeBook Vision Initialization Error: {e}")
        return None

class VisionOverlay:
    """
    Vision Overlay Builder attached to camera stream frames.
    Enables drawing bounding box vectors, labels, landmark points, and text on top of live video.
    """

    def __init__(self, frame=None):
        self.frame = frame
        self.overlays = []

    def detect_hands(self, max_hands: int = 2) -> List[HandResult]:
        """
        Automatically detects hands, landmarks, and counts open fingers in the current frame.
        Zero setup required.
        """
        if self.frame is None:
            return []

        landmarker = _get_landmarker(max_hands=max_hands)
        if landmarker is None:
            return []

        try:
            import cv2
            import mediapipe as mp

            h, w = self.frame.shape[:2]
            rgb = cv2.cvtColor(self.frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            results = landmarker.detect(mp_image)

            detected_hands = []
            tip_ids = [4, 8, 12, 16, 20]

            if results.hand_landmarks:
                for lms in results.hand_landmarks:
                    fingers = [1 if lms[tip].y < lms[tip - 2].y else 0 for tip in tip_ids[1:]]
                    count = sum(fingers)

                    xs = [int(l.x * w) for l in lms]
                    ys = [int(l.y * h) for l in lms]
                    min_x, max_x = min(xs), max(xs)
                    min_y, max_y = min(ys), max(ys)

                    bbox = BBox(
                        x=float(min_x - 10),
                        y=float(min_y - 10),
                        width=float((max_x - min_x) + 20),
                        height=float((max_y - min_y) + 20)
                    )
                    landmarks = [[l.x, l.y, l.z] for l in lms]
                    detected_hands.append(HandResult(bbox, count, landmarks))

            return detected_hands
        except Exception as e:
            print(f"Hand Detection Error: {e}")
            return []

    def draw_box(self, x: float, y: float, width: float, height: float, label: str = "", color: str = "#00ff00"):
        """Adds a bounding box rect overlay."""
        self.overlays.append({
            "type": "rect",
            "x": float(x),
            "y": float(y),
            "w": float(width),
            "h": float(height),
            "label": label,
            "color": color
        })
        self._flush()
        return self

    def draw_landmarks(self, points: list, color: str = "#ff0000"):
        """Adds landmark points overlay (e.g. [[x1, y1], [x2, y2]])."""
        self.overlays.append({
            "type": "points",
            "points": [[float(p[0]), float(p[1])] for p in points],
            "color": color
        })
        self._flush()
        return self

    def draw_text(self, text: str, x: float, y: float, color: str = "#ffffff"):
        """Adds text label overlay at (x, y)."""
        self.overlays.append({
            "type": "text",
            "text": str(text),
            "x": float(x),
            "y": float(y),
            "color": color
        })
        self._flush()
        return self

    def _flush(self):
        if self.overlays:
            print(f"__CODEBOOK_VISION_OVERLAY__:{json.dumps(self.overlays)}")

def vision(frame=None) -> VisionOverlay:
    return VisionOverlay(frame)
