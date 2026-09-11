"""
SignLearn AI -- Synthetic Stress Test (Simulated Camera & Angular Variance)
==========================================================================
NOTE: This is a SYNTHETIC perturbation stress test, NOT real human data.
It evaluates how the trained model handles simulated camera roll, tilt,
sensor noise, and scale variations on synthetic samples.

Do NOT confuse with real human webcam validation.
"""

import sys
import pickle
from pathlib import Path
import numpy as np

REPO_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(REPO_ROOT))

from ml.feature_extractor import extract_features, generate_trajectory_sample
from ml.sign_prototypes import SIGN_PROTOTYPES

STRESS_PROFILES = {
    "Mild Simulated Tilt (±3° roll, standard noise)": {
        "tilt_deg": 3.0,
        "noise_std": 0.015,
        "scale_var": 0.08,
    },
    "Moderate Camera Angle (±7° roll, elevated noise)": {
        "tilt_deg": 7.0,
        "noise_std": 0.022,
        "scale_var": 0.12,
    },
    "High Perturbation Stress (±12° roll, severe sensor noise)": {
        "tilt_deg": 12.0,
        "noise_std": 0.030,
        "scale_var": 0.15,
    },
}

def run_stress_test():
    print("=" * 70)
    print("SignLearn AI -- Synthetic Camera Perturbation Stress Test")
    print("NOTE: All samples are synthetically generated for robustness testing.")
    print("=" * 70)

    pkl_file = REPO_ROOT / "backend" / "models" / "sign_classifier.pkl"
    if not pkl_file.exists():
        print(f"Error: Model bundle not found at {pkl_file}")
        return

    with open(pkl_file, "rb") as f:
        bundle = pickle.load(f)

    model = bundle["model"]
    scaler = bundle["scaler"]
    le = bundle["label_encoder"]

    sign_names = list(SIGN_PROTOTYPES.keys())
    rng = np.random.default_rng(999)
    samples_per_sign = 8  # 30 * 60 = 1,800 synthetic stress samples per profile

    results = {}
    for prof_name, params in STRESS_PROFILES.items():
        print(f"\nEvaluating Profile: {prof_name}...")
        total = 0
        correct = 0

        for sign in sign_names:
            proto = SIGN_PROTOTYPES[sign]
            n_frames = 8 if proto.get("is_dynamic") else 1

            for _ in range(samples_per_sign):
                traj = generate_trajectory_sample(sign, n_frames=n_frames, rng=rng,
                                                  noise_std=params["noise_std"],
                                                  scale_var=params["scale_var"])

                # Apply simulated roll tilt
                theta = float(np.radians(rng.uniform(-params["tilt_deg"], params["tilt_deg"])))
                cos_t, sin_t = np.cos(theta), np.sin(theta)
                R_tilt = np.array([[cos_t, -sin_t, 0], [sin_t, cos_t, 0], [0, 0, 1]], dtype=np.float32)

                for f_idx in range(n_frames):
                    traj[f_idx] = np.dot(traj[f_idx], R_tilt.T)

                feats = extract_features(traj).reshape(1, -1)
                feats_scaled = scaler.transform(feats)
                pred_idx = int(np.argmax(model.predict_proba(feats_scaled)[0]))
                pred_sign = le.inverse_transform([pred_idx])[0]

                if pred_sign == sign:
                    correct += 1
                total += 1

        acc = correct / total
        results[prof_name] = {"accuracy": acc, "correct": correct, "total": total}
        print(f"  Accuracy: {acc * 100:.2f}% ({correct}/{total} correct)")

    return results

if __name__ == "__main__":
    run_stress_test()

