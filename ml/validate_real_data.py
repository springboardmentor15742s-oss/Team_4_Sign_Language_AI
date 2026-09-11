"""
SignLearn AI -- Real-World Webcam Data Validator
================================================
Evaluates the production ASL model against GENUINE webcam landmark
recordings saved in ml/real_captures/.

DOES NOT GENERATE ANY SYNTHETIC DATA.
Loads exclusively real .json captures recorded by human signers.
"""

import sys
import json
import pickle
from pathlib import Path
import numpy as np

REPO_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(REPO_ROOT))

from ml.feature_extractor import extract_features

REAL_CAPTURES_DIR = REPO_ROOT / "ml" / "real_captures"

def run_real_world_validation():
    print("=" * 70)
    print("SignLearn AI -- Real-World Webcam Data Validation")
    print("=" * 70)
    print(f"Scanning directory: {REAL_CAPTURES_DIR}")

    json_files = list(REAL_CAPTURES_DIR.glob("*.json"))
    
    if len(json_files) == 0:
        print("\n>> REAL CAPTURES FOUND: 0")
        print("\n[STATUS] REAL-WORLD WEBCAM VALIDATION IS PENDING (NOT YET MEASURED).")
        print("No genuine human webcam captures have been saved yet.")
        print("\nTo collect genuine webcam data:")
        print("  1. Open http://localhost:5173 in your browser.")
        print("  2. Go to the AI Practice Studio.")
        print("  3. Use the 'Record Benchmark Capture' button to save live MediaPipe webcam landmarks.")
        print("  4. Captures will be stored in ml/real_captures/<sign>_<subject>_<trial>.json.")
        print("=" * 70)
        return None

    print(f"\n>> Loaded {len(json_files)} genuine webcam capture files.")
    
    pkl_file = REPO_ROOT / "backend" / "models" / "sign_classifier.pkl"
    if not pkl_file.exists():
        print(f"Error: Model bundle not found at {pkl_file}")
        return None

    with open(pkl_file, "rb") as f:
        bundle = pickle.load(f)

    model = bundle["model"]
    scaler = bundle["scaler"]
    le = bundle["label_encoder"]

    total = 0
    correct = 0
    subject_stats = {}
    sign_stats = {}
    confusions = []

    for fpath in json_files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to read {fpath.name}: {e}")
            continue

        true_sign = data.get("sign") or data.get("target_sign")
        subject = data.get("subject", "Unknown")
        lm_data = data.get("landmarks")

        if not true_sign or lm_data is None:
            continue

        feats = extract_features(lm_data).reshape(1, -1)
        scaled = scaler.transform(feats)
        proba = model.predict_proba(scaled)[0]
        pred_idx = int(np.argmax(proba))
        pred_sign = le.inverse_transform([pred_idx])[0]
        conf = float(proba[pred_idx]) * 100.0

        is_ok = (pred_sign == true_sign)
        if is_ok:
            correct += 1
        else:
            confusions.append((true_sign, pred_sign, conf, subject, fpath.name))

        total += 1
        
        # Track by subject
        if subject not in subject_stats:
            subject_stats[subject] = {"correct": 0, "total": 0}
        subject_stats[subject]["total"] += 1
        if is_ok:
            subject_stats[subject]["correct"] += 1

        # Track by sign
        if true_sign not in sign_stats:
            sign_stats[true_sign] = {"correct": 0, "total": 0}
        sign_stats[true_sign]["total"] += 1
        if is_ok:
            sign_stats[true_sign]["correct"] += 1

    acc = (correct / total) if total > 0 else 0.0
    print(f"\n[RESULTS] Genuine Real-World Accuracy: {acc * 100:.2f}% ({correct}/{total} correct)")
    
    print("\nPer-Subject Accuracy:")
    for subj, st in subject_stats.items():
        s_acc = (st["correct"] / st["total"]) * 100 if st["total"] > 0 else 0
        print(f"  {subj:30s}: {s_acc:5.1f}% ({st['correct']}/{st['total']})")

    print("\nPer-Sign Accuracy:")
    for s, st in sign_stats.items():
        s_acc = (st["correct"] / st["total"]) * 100 if st["total"] > 0 else 0
        print(f"  {s:15s}: {s_acc:5.1f}% ({st['correct']}/{st['total']})")

    if confusions:
        print("\nReal-World Confusions:")
        for ts, ps, cf, subj, fname in confusions[:10]:
            print(f"  {fname}: True={ts} -> Pred={ps} ({cf:.1f}%) [Subject: {subj}]")

    print("=" * 70)
    return {"accuracy": acc, "total": total, "correct": correct,
            "subject_stats": subject_stats, "sign_stats": sign_stats}

if __name__ == "__main__":
    run_real_world_validation()
