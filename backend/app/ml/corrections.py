"""Rule-based correction tips from MediaPipe landmark geometry."""

from __future__ import annotations

from typing import Sequence

import numpy as np

from app.ml.features import finger_extension_ratios, landmarks_from_payload

# Approximate expected extension profiles for common alphabet signs (heuristic).
# Values are tip-to-MCP / palm ratios — tuned for coaching tips, not ground truth.
SIGN_EXTENSION_HINTS: dict[str, dict[str, float]] = {
    "A": {"thumb": 0.55, "index": 0.25, "middle": 0.25, "ring": 0.25, "pinky": 0.25},
    "B": {"thumb": 0.35, "index": 0.95, "middle": 0.95, "ring": 0.95, "pinky": 0.95},
    "C": {"thumb": 0.70, "index": 0.70, "middle": 0.70, "ring": 0.65, "pinky": 0.60},
    "D": {"thumb": 0.45, "index": 0.95, "middle": 0.30, "ring": 0.30, "pinky": 0.30},
    "E": {"thumb": 0.35, "index": 0.30, "middle": 0.30, "ring": 0.30, "pinky": 0.30},
    "F": {"thumb": 0.55, "index": 0.35, "middle": 0.90, "ring": 0.90, "pinky": 0.90},
    "L": {"thumb": 0.85, "index": 0.95, "middle": 0.30, "ring": 0.30, "pinky": 0.30},
    "V": {"thumb": 0.40, "index": 0.95, "middle": 0.95, "ring": 0.30, "pinky": 0.30},
    "W": {"thumb": 0.40, "index": 0.95, "middle": 0.95, "ring": 0.95, "pinky": 0.30},
    "Y": {"thumb": 0.85, "index": 0.30, "middle": 0.30, "ring": 0.30, "pinky": 0.90},
}

FINGER_TIP_LABELS = {
    "thumb": "thumb",
    "index": "index finger",
    "middle": "middle finger",
    "ring": "ring finger",
    "pinky": "pinky",
}


def generate_corrections(
    landmarks: Sequence | np.ndarray,
    *,
    predicted_sign: str,
    expected_sign: str | None,
    accuracy_percentage: float,
    is_correct: bool,
) -> list[str]:
    """
    Build human-readable coaching tips for Ankur's live camera banner (Task 1).
    """
    tips: list[str] = []
    ratios = finger_extension_ratios(landmarks)
    target = (expected_sign or predicted_sign or "").upper()
    profile = SIGN_EXTENSION_HINTS.get(target)

    if accuracy_percentage >= 90 and is_correct:
        tips.append("Hand angle optimal")
        tips.append("Good overall hand shape")
        return tips[:4]

    if profile:
        for finger, expected in profile.items():
            actual = ratios.get(finger, 0.0)
            delta = actual - expected
            label = FINGER_TIP_LABELS[finger]
            if delta < -0.22:
                tips.append(f"Extend your {label} further")
            elif delta > 0.28:
                tips.append(f"Curl your {label} slightly more")

    # Generic geometry checks
    pts = landmarks_from_payload(landmarks)
    wrist = pts[0]
    middle_mcp = pts[9]
    palm = float(np.linalg.norm(middle_mcp - wrist)) + 1e-6
    if palm < 0.05:
        tips.append("Move your hand closer to the camera")
    tip_spread = float(np.linalg.norm(pts[8] - pts[20])) / palm
    if tip_spread < 0.15 and target in {"B", "V", "W"}:
        tips.append("Spread your fingers farther apart")

    if expected_sign and not is_correct:
        tips.insert(0, f"Target sign is '{expected_sign.upper()}' — adjust hand shape")

    if not tips:
        if accuracy_percentage >= 80:
            tips.append("Hand angle optimal")
            tips.append("Good thumb position")
        else:
            tips.append("Re-center your hand in the frame")
            tips.append("Hold the gesture steady for a clearer reading")

    # Deduplicate while preserving order
    seen: set[str] = set()
    unique: list[str] = []
    for t in tips:
        if t not in seen:
            seen.add(t)
            unique.append(t)
    return unique[:5]
