"""MediaPipe Hands landmark feature extraction (21 keypoints → model vector)."""

from __future__ import annotations

from typing import Any, Sequence

import numpy as np

# MediaPipe Hands landmark indices
WRIST = 0
THUMB_CMC, THUMB_MCP, THUMB_IP, THUMB_TIP = 1, 2, 3, 4
INDEX_MCP, INDEX_PIP, INDEX_DIP, INDEX_TIP = 5, 6, 7, 8
MIDDLE_MCP, MIDDLE_PIP, MIDDLE_DIP, MIDDLE_TIP = 9, 10, 11, 12
RING_MCP, RING_PIP, RING_DIP, RING_TIP = 13, 14, 15, 16
PINKY_MCP, PINKY_PIP, PINKY_DIP, PINKY_TIP = 17, 18, 19, 20

NUM_LANDMARKS = 21
COORDS_PER_LANDMARK = 3  # x, y, z
RAW_DIM = NUM_LANDMARKS * COORDS_PER_LANDMARK  # 63


def _as_landmark_array(landmarks: Sequence[Any]) -> np.ndarray:
    """
    Accept either:
      - list of 21 dicts {"x","y","z"}
      - list/array of shape (21, 3)
      - flat list/array of length 63
    """
    if len(landmarks) == 0:
        raise ValueError("landmarks must not be empty")

    first = landmarks[0]
    if isinstance(first, dict):
        if len(landmarks) != NUM_LANDMARKS:
            raise ValueError(f"Expected {NUM_LANDMARKS} landmark objects, got {len(landmarks)}")
        arr = np.array(
            [[float(p["x"]), float(p["y"]), float(p.get("z", 0.0))] for p in landmarks],
            dtype=np.float32,
        )
    else:
        arr = np.asarray(landmarks, dtype=np.float32)
        if arr.ndim == 1:
            if arr.size != RAW_DIM:
                raise ValueError(f"Flat landmark vector must have length {RAW_DIM}, got {arr.size}")
            arr = arr.reshape(NUM_LANDMARKS, COORDS_PER_LANDMARK)
        elif arr.shape != (NUM_LANDMARKS, COORDS_PER_LANDMARK):
            raise ValueError(f"Landmark array must be ({NUM_LANDMARKS}, 3), got {arr.shape}")
    return arr


def landmarks_from_payload(landmarks: Sequence[Any]) -> np.ndarray:
    """Public helper: normalize request payload → (21, 3) array."""
    return _as_landmark_array(landmarks)


def extract_landmark_features(landmarks: Sequence[Any] | np.ndarray) -> np.ndarray:
    """
    Convert 21 MediaPipe landmarks into a translation/scale-invariant feature vector.

    Steps:
      1. Translate so wrist is at origin
      2. Scale by palm size (wrist → middle MCP distance)
      3. Append pairwise fingertip distances (extra discriminative signal)

    Returns:
        1-D float32 feature vector (length 63 + 10 = 73).
    """
    pts = _as_landmark_array(landmarks)

    origin = pts[WRIST].copy()
    centered = pts - origin

    palm_size = float(np.linalg.norm(centered[MIDDLE_MCP]))
    if palm_size < 1e-6:
        # Degenerate frame (hand not clearly visible) — fall back to mean pairwise scale
        palm_size = float(np.mean(np.linalg.norm(centered, axis=1))) + 1e-6

    normalized = centered / palm_size
    base = normalized.reshape(-1)  # 63

    tips = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP]
    tip_dists: list[float] = []
    for i in range(len(tips)):
        for j in range(i + 1, len(tips)):
            tip_dists.append(float(np.linalg.norm(normalized[tips[i]] - normalized[tips[j]])))

    return np.concatenate([base, np.asarray(tip_dists, dtype=np.float32)]).astype(np.float32)


def finger_extension_ratios(landmarks: Sequence[Any] | np.ndarray) -> dict[str, float]:
    """
    Rough per-finger extension scores in [0, 1+] for correction tips.
    Uses tip-to-MCP distance relative to palm size.
    """
    pts = _as_landmark_array(landmarks)
    origin = pts[WRIST]
    palm = float(np.linalg.norm(pts[MIDDLE_MCP] - origin)) + 1e-6

    def ratio(tip: int, mcp: int) -> float:
        return float(np.linalg.norm(pts[tip] - pts[mcp]) / palm)

    return {
        "thumb": ratio(THUMB_TIP, THUMB_MCP),
        "index": ratio(INDEX_TIP, INDEX_MCP),
        "middle": ratio(MIDDLE_TIP, MIDDLE_MCP),
        "ring": ratio(RING_TIP, RING_MCP),
        "pinky": ratio(PINKY_TIP, PINKY_MCP),
    }


FEATURE_DIM = 73  # 63 normalized coords + 10 tip pairwise distances
