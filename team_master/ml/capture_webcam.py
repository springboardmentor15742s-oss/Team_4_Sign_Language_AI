"""
ml/capture_webcam.py - Real Live Webcam Landmark Capture Utility
Records genuine webcam MediaPipe hand landmarks from human subjects.
Saves raw landmark JSON to ml/real_captures/<sign>_<subject>_<trial>.json
"""

import sys
import os
import time
import json
from pathlib import Path
from datetime import datetime

# Resolve directories
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
REAL_CAPTURES_DIR = PROJECT_ROOT / "ml" / "real_captures"
TM_REAL_CAPTURES_DIR = PROJECT_ROOT / "team_master" / "ml" / "real_captures"

REAL_CAPTURES_DIR.mkdir(parents=True, exist_ok=True)
TM_REAL_CAPTURES_DIR.mkdir(parents=True, exist_ok=True)

SUBJECTS = ["Ankur", "Pragathi", "Chinmayee"]


def get_subject_selection():
    print("\n--- SELECT SUBJECT ---")
    for i, name in enumerate(SUBJECTS, 1):
        print(f"[{i}] {name}")
    print("[4] Other (Custom name)")

    choice = input("Enter choice (1-4, default 1): ").strip()
    if choice == "1" or not choice:
        return "Ankur"
    elif choice == "2":
        return "Pragathi"
    elif choice == "3":
        return "Chinmayee"
    elif choice == "4":
        custom = input("Enter custom name: ").strip()
        return "".join(c for c in custom if c.isalnum() or c in ("_", "-")) or "Subject"
    return "Ankur"


def main():
    try:
        import cv2
        import mediapipe as mp
    except ImportError:
        print("\n[ERROR] OpenCV or MediaPipe is not installed.")
        print("Install them via: pip install opencv-python mediapipe")
        sys.exit(1)

    print("=" * 60)
    print(" SIGNLEARN AI - REAL WEBCAM CAPTURE UTILITY")
    print("=" * 60)
    print("Captures genuine MediaPipe landmarks from human subjects.")
    print("Output directory: ml/real_captures/\n")

    subject = get_subject_selection()
    sign = input("\nEnter sign to perform (e.g. A, B, HELLO, THANK_YOU): ").strip().upper()
    if not sign:
        print("Sign cannot be empty. Exiting.")
        sys.exit(1)

    # Determine trial index
    existing = list(REAL_CAPTURES_DIR.glob(f"{sign}_{subject}_*.json"))
    trial = len(existing) + 1

    print(f"\nTarget Sign: {sign}")
    print(f"Subject:     {subject}")
    print(f"Trial #:     {trial}")
    print("\nOpening camera (Press 'q' in window to quit)...")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        sys.exit(1)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    mp_hands = mp.solutions.hands
    mp_draw = mp.solutions.drawing_utils
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5
    )

    # Countdown phase
    countdown_secs = 3
    start_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        elapsed = time.time() - start_time
        remaining = countdown_secs - int(elapsed)

        # Drawing UI overlay
        disp = frame.copy()
        cv2.putText(disp, f"Subject: {subject} | Sign: {sign}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        if remaining > 0:
            cv2.putText(disp, f"GET READY: {remaining}", (width // 2 - 120, height // 2),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 165, 255), 4)
        else:
            break

        cv2.imshow("SignLearn AI - Capture", disp)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            sys.exit(0)

    # Recording phase: capture 40 frames of landmarks
    print("\nRecording landmarks now... Perform the sign!")
    captured_frames = []
    target_frames = 45

    while len(captured_frames) < target_frames:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        disp = frame.copy()
        cv2.putText(disp, f"RECORDING {len(captured_frames)+1}/{target_frames}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        if results.multi_hand_landmarks:
            for hand_lms in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(disp, hand_lms, mp_hands.HAND_CONNECTIONS)
            
            # Save normalized landmarks for primary hand
            first_hand = results.multi_hand_landmarks[0]
            lms_list = [[lm.x, lm.y, lm.z] for lm in first_hand.landmark]
            captured_frames.append(lms_list)

        cv2.imshow("SignLearn AI - Capture", disp)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if not captured_frames:
        print("[WARNING] No hand landmarks were detected during capture. Nothing saved.")
        sys.exit(1)

    filename = f"{sign}_{subject}_{trial}.json"
    target_path = REAL_CAPTURES_DIR / filename

    capture_record = {
        "sign": sign,
        "subject": subject,
        "trial": trial,
        "timestamp": datetime.now().isoformat(),
        "source": "webcam_live_mediapipe",
        "frame_count": len(captured_frames),
        "resolution": f"{width}x{height}",
        "landmarks": captured_frames if len(captured_frames) > 1 else captured_frames[0]
    }

    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(capture_record, f, indent=2)

    # Mirror to team_master
    tm_path = TM_REAL_CAPTURES_DIR / filename
    try:
        with open(tm_path, "w", encoding="utf-8") as f:
            json.dump(capture_record, f, indent=2)
    except Exception:
        pass

    total_real = len(list(REAL_CAPTURES_DIR.glob("*.json")))
    print("\n" + "=" * 60)
    print(f"SUCCESSFULLY SAVED GENUINE CAPTURE: {filename}")
    print(f"Path: {target_path}")
    print(f"Frames recorded: {len(captured_frames)}")
    print(f"Total real captures in dataset: {total_real}")
    print("=" * 60)
    print("Run `python ml/validate_real_data.py` to evaluate your model on real captures!")


if __name__ == "__main__":
    main()
