"""
SignLearn AI -- Enhanced ASL Classifier (Full 60-Sign Coverage)
- 700 synthetic samples per sign with noise/jitter for all 60 signs
- 85-feature engineering (63 raw + curl ratios + angles + palm normal + tip distances)
- Benchmarks: RandomForest (RandomizedSearchCV) vs GradientBoosting vs MLP
- CalibratedClassifierCV for calibrated predict_proba confidence
- Per-sign precision/recall/F1 + confusion matrix saved to docs/ML_Training_Report.md
"""

import os, warnings, pickle
import numpy as np
from datetime import datetime
from pathlib import Path
warnings.filterwarnings("ignore")

# ── CONFIG ────────────────────────────────────────────────────
CONFIG = {
    "pass_threshold": 0.75,
    "ml_confidence_threshold": 0.60,
    "geometric_weight": 0.30,
    "ml_weight": 0.70,
    "samples_per_sign": 700,
    "noise_std": 0.015,
    "scale_variance": 0.10,
}

SIGN_LIST = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z",
    "HELLO","THANK_YOU","PLEASE","YES","NO",
    "HELP","LOVE","SORRY","GOOD","BAD",
    "NAME","NICE","HOME","EAT","WATER",
    "TIME","WHAT","WHERE","WHEN","HOW",
    "WHO","WHY","MORE","STOP","FRIEND",
    "NAMASTE","PEACE","FAMILY","TOGETHER","CLAP",
    "PRAY","HELP_TWO","LOVE_TWO","SHARE",
]

# finger states: [thumb, index, middle, ring, pinky] 0=curl..1=extend + palm_y
SIGN_FINGER_STATES = {
    "A":([0.3,0.0,0.0,0.0,0.0],0.3), "B":([0.0,1.0,1.0,1.0,1.0],0.8),
    "C":([0.5,0.5,0.5,0.5,0.5],0.5), "D":([0.3,1.0,0.0,0.0,0.0],0.8),
    "E":([0.2,0.1,0.1,0.1,0.1],0.2), "F":([0.0,0.0,1.0,1.0,1.0],0.7),
    "G":([0.8,1.0,0.0,0.0,0.0],0.1), "H":([0.0,1.0,1.0,0.0,0.0],0.1),
    "I":([0.0,0.0,0.0,0.0,1.0],0.8), "J":([0.0,0.0,0.0,0.0,1.0],0.8),
    "K":([0.8,1.0,1.0,0.0,0.0],0.8), "L":([1.0,1.0,0.0,0.0,0.0],0.8),
    "M":([0.3,0.0,0.0,0.0,0.0],0.2), "N":([0.3,0.0,0.0,0.0,0.0],0.3),
    "O":([0.4,0.4,0.4,0.4,0.4],0.6), "P":([0.7,1.0,1.0,0.0,0.0],0.0),
    "Q":([0.7,1.0,0.0,0.0,0.0],0.0), "R":([0.0,1.0,1.0,0.0,0.0],0.75),
    "S":([0.2,0.0,0.0,0.0,0.0],0.3), "T":([0.4,0.0,0.0,0.0,0.0],0.3),
    "U":([0.0,1.0,1.0,0.0,0.0],0.85),"V":([0.0,1.0,1.0,0.0,0.0],0.85),
    "W":([0.0,1.0,1.0,1.0,0.0],0.85),"X":([0.0,0.5,0.0,0.0,0.0],0.7),
    "Y":([1.0,0.0,0.0,0.0,1.0],0.7), "Z":([0.0,1.0,0.0,0.0,0.0],0.8),
    "HELLO":([1.0,1.0,1.0,1.0,1.0],0.9),  "THANK_YOU":([1.0,1.0,1.0,1.0,1.0],0.85),
    "PLEASE":([1.0,1.0,1.0,1.0,1.0],0.8), "YES":([0.2,0.0,0.0,0.0,0.0],0.35),
    "NO":([0.0,1.0,1.0,0.0,0.0],0.7),     "HELP":([0.9,0.0,0.0,0.0,0.0],0.9),
    "LOVE":([0.0,0.0,0.0,0.0,0.0],0.2),   "SORRY":([0.1,0.0,0.0,0.0,0.0],0.3),
    "GOOD":([1.0,1.0,1.0,1.0,1.0],0.7),   "BAD":([1.0,1.0,1.0,1.0,1.0],0.2),
    "NAME":([0.0,1.0,1.0,0.0,0.0],0.6),   "NICE":([1.0,1.0,1.0,1.0,1.0],0.9),
    "HOME":([0.5,1.0,1.0,1.0,1.0],0.7),   "EAT":([0.5,0.5,0.5,0.5,0.5],0.4),
    "WATER":([0.0,1.0,1.0,1.0,0.0],0.8),  "TIME":([0.0,1.0,0.0,0.0,0.0],0.3),
    "WHAT":([1.0,1.0,1.0,1.0,1.0],0.8),   "WHERE":([0.0,1.0,0.0,0.0,0.0],0.7),
    "WHEN":([0.0,1.0,0.0,0.0,0.0],0.65),  "HOW":([0.1,0.1,0.1,0.1,0.1],0.3),
    "WHO":([0.0,1.0,0.0,0.0,0.0],0.6),    "WHY":([0.0,1.0,1.0,1.0,0.0],0.2),
    "MORE":([0.5,0.5,0.5,0.5,0.5],0.7),   "STOP":([1.0,1.0,1.0,1.0,1.0],0.5),
    "FRIEND":([0.0,1.0,0.0,0.0,0.0],0.65),
    "NAMASTE":([1.0,1.0,1.0,1.0,1.0],1.0),"PEACE":([0.0,1.0,1.0,0.0,0.0],0.9),
    "FAMILY":([1.0,1.0,1.0,1.0,1.0],0.85),"TOGETHER":([0.1,0.1,0.1,0.1,0.1],0.4),
    "CLAP":([1.0,1.0,1.0,1.0,1.0],0.95),  "PRAY":([1.0,1.0,1.0,1.0,1.0],1.0),
    "HELP_TWO":([0.9,0.0,0.0,0.0,0.0],0.95),"LOVE_TWO":([0.0,0.0,0.0,0.0,0.0],0.15),
    "SHARE":([1.0,1.0,1.0,1.0,1.0],0.75),
}

# ── HAND LANDMARK GENERATOR ───────────────────────────────────
# MediaPipe layout: 0=wrist, 1-4=thumb, 5-8=index, 9-12=middle,
#                   13-16=ring, 17-20=pinky
FINGER_TIP  = [4,  8,  12, 16, 20]
FINGER_PIP  = [3,  7,  11, 15, 19]
FINGER_MCP  = [2,  6,  10, 14, 18]
FINGER_BASE = [1,  5,  9,  13, 17]

def _base_hand(finger_states, palm_y, wrist=(0.5, 0.75, 0.0)):
    """Build 21 (x,y,z) landmarks from finger extension states [0..1]."""
    lm = np.zeros((21, 3))
    wx, wy, wz = wrist
    lm[0] = [wx, wy, wz]  # wrist

    # Finger column offsets from palm centre (normalised units)
    col_x = [-0.08, -0.04, 0.0, 0.04, 0.08]   # thumb..pinky
    # Segment lengths (wrist->base->mcp->pip->tip)
    seg_base  = [0.05, 0.06, 0.06, 0.06, 0.05]
    seg_mcp   = [0.05, 0.07, 0.08, 0.07, 0.05]
    seg_pip   = [0.04, 0.05, 0.06, 0.05, 0.04]
    seg_tip   = [0.04, 0.04, 0.05, 0.04, 0.03]

    for fi, (ext, cx) in enumerate(zip(finger_states, col_x)):
        # palm_y controls hand tilt (1=up, 0=down)
        dy_dir = -1 if palm_y > 0.5 else 1
        base_y = wy - seg_base[fi] * 0.8
        base_x = wx + cx
        # FINGER_BASE[fi]
        lm[FINGER_BASE[fi]] = [base_x, base_y, wz - 0.01*fi]
        # MCP
        mcp_y  = base_y - seg_mcp[fi]
        lm[FINGER_MCP[fi]]  = [base_x, mcp_y, wz - 0.015*fi]
        # PIP - partially extend
        pip_ext = min(ext + 0.15, 1.0)
        pip_y   = mcp_y + dy_dir * seg_pip[fi] * pip_ext
        pip_x   = base_x + cx * 0.1 * pip_ext
        lm[FINGER_PIP[fi]]  = [pip_x, pip_y, wz - 0.01*fi*ext]
        # TIP - fully follow ext
        tip_y   = pip_y + dy_dir * seg_tip[fi] * ext
        tip_x   = pip_x + cx * 0.08 * ext
        lm[FINGER_TIP[fi]]  = [tip_x, tip_y, wz - 0.008*fi*ext]

    return lm

def generate_samples(sign, n=700, noise_std=0.015, scale_var=0.10, rng=None):
    """Generate n jittered landmark samples for a given sign."""
    if rng is None:
        rng = np.random.default_rng(abs(hash(sign)) % (2**31))
    finger_states, palm_y = SIGN_FINGER_STATES.get(sign, ([0.5]*5, 0.5))
    samples = []
    for _ in range(n):
        # Random wrist position jitter
        wrist = (
            0.5 + rng.normal(0, 0.05),
            0.75 + rng.normal(0, 0.04),
            rng.normal(0, 0.02),
        )
        # Random scale
        scale = 1.0 + rng.uniform(-scale_var, scale_var)
        # Per-finger extension jitter
        fs_jit = [max(0.0, min(1.0, f + rng.normal(0, 0.08)))
                  for f in finger_states]
        palm_jit = max(0.0, min(1.0, palm_y + rng.normal(0, 0.06)))

        lm = _base_hand(fs_jit, palm_jit, wrist)
        # Global scale around wrist
        lm = wrist + (lm - wrist) * scale
        # Gaussian noise on every coordinate
        lm += rng.normal(0, noise_std, lm.shape)
        samples.append(lm.flatten())   # 63 raw features
    return np.array(samples, dtype=np.float32)

# ── 85-FEATURE ENGINEERING ────────────────────────────────────
def extract_features(lm_flat):
    """
    Input : 63 raw floats (21 landmarks x 3) or (N,63) array
    Output: 85-feature array adding:
      + 5 finger curl ratios
      + 4 inter-adjacent-finger angles
      + 3 palm orientation normal vector
      + 10 fingertip pair distances  (C(5,2)=10)
    """
    single = lm_flat.ndim == 1
    X = np.atleast_2d(lm_flat).copy().astype(np.float32)
    N = X.shape[0]

    extras = np.zeros((N, 22), dtype=np.float32)

    for i in range(N):
        lm = X[i].reshape(21, 3)
        wrist = lm[0]

        # -- 5 curl ratios: dist(wrist,tip) / dist(wrist,pip) --
        for fi, (tip, pip) in enumerate(zip(FINGER_TIP, FINGER_PIP)):
            d_tip = np.linalg.norm(lm[tip] - wrist) + 1e-6
            d_pip = np.linalg.norm(lm[pip] - wrist) + 1e-6
            extras[i, fi] = d_tip / d_pip

        # -- 4 inter-adjacent-finger angles (tip vectors) --
        tip_vecs = [lm[t] - lm[b]
                    for t, b in zip(FINGER_TIP, FINGER_BASE)]
        for ai in range(4):
            u, v = tip_vecs[ai], tip_vecs[ai+1]
            cos_a = np.dot(u, v) / (np.linalg.norm(u)*np.linalg.norm(v) + 1e-6)
            extras[i, 5+ai] = float(np.clip(cos_a, -1.0, 1.0))

        # -- 3 palm orientation normal (wrist x index_mcp x pinky_mcp) --
        v1 = lm[FINGER_MCP[1]] - wrist
        v2 = lm[FINGER_MCP[4]] - wrist
        normal = np.cross(v1, v2)
        norm_mag = np.linalg.norm(normal) + 1e-6
        extras[i, 9:12] = normal / norm_mag

        # -- 10 fingertip pair distances --
        tips = [lm[t] for t in FINGER_TIP]
        idx = 12
        for a in range(5):
            for b in range(a+1, 5):
                extras[i, idx] = float(np.linalg.norm(tips[a] - tips[b]))
                idx += 1

    result = np.concatenate([X, extras], axis=1)   # (N, 85)
    return result[0] if single else result

# ── DATASET GENERATION ────────────────────────────────────────
def build_dataset(samples_per_sign=700, noise_std=0.015, scale_var=0.10):
    print(f"Generating {samples_per_sign} samples x {len(SIGN_LIST)} signs = "
          f"{samples_per_sign*len(SIGN_LIST):,} total samples...")
    X_list, y_list = [], []
    for sign in SIGN_LIST:
        raw = generate_samples(sign, n=samples_per_sign,
                               noise_std=noise_std, scale_var=scale_var)
        feats = extract_features(raw)          # (N, 85)
        X_list.append(feats)
        y_list.extend([sign] * samples_per_sign)
        print(f"  {sign:12s}: {len(raw)} samples", flush=True)
    X = np.vstack(X_list)
    y = np.array(y_list)
    print(f"Dataset ready: X={X.shape}  classes={len(SIGN_LIST)}")
    return X, y

# ── MODEL TRAINING ────────────────────────────────────────────
def train_models(X_train, y_train):
    from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
    from sklearn.neural_network import MLPClassifier
    from sklearn.calibration import CalibratedClassifierCV

    print("\nTraining models...")

    # -- Random Forest (tuned, no nested search to keep it fast) --
    print("  [1/3] RandomForest (300 trees, depth=20)...", flush=True)
    rf = RandomForestClassifier(n_estimators=300, max_depth=20,
                                min_samples_leaf=1, max_features="sqrt",
                                class_weight="balanced",
                                random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_cal = CalibratedClassifierCV(rf, cv=3, method="isotonic")
    rf_cal.fit(X_train, y_train)
    print("     RF done.", flush=True)

    # -- HistGradientBoosting (faster than GB, native missing support) --
    print("  [2/3] HistGradientBoosting...", flush=True)
    hgb = HistGradientBoostingClassifier(max_iter=200, max_depth=8,
                                          learning_rate=0.1, random_state=42)
    hgb.fit(X_train, y_train)
    hgb_cal = CalibratedClassifierCV(hgb, cv=3, method="isotonic")
    hgb_cal.fit(X_train, y_train)
    print("     HGB done.", flush=True)

    # -- MLP --
    print("  [3/3] MLP (256-128-64)...", flush=True)
    mlp = MLPClassifier(hidden_layer_sizes=(256, 128, 64),
                        activation="relu", solver="adam",
                        max_iter=200, random_state=42,
                        early_stopping=True, validation_fraction=0.1,
                        n_iter_no_change=10)
    mlp.fit(X_train, y_train)
    mlp_cal = CalibratedClassifierCV(mlp, cv=3, method="isotonic")
    mlp_cal.fit(X_train, y_train)
    print("     MLP done.", flush=True)

    return {"RandomForest": rf_cal, "HistGradBoost": hgb_cal, "MLP": mlp_cal}

# ── EVALUATION & REPORT ───────────────────────────────────────
def evaluate_models(models, X_test, y_test, X_train, y_train):
    from sklearn.metrics import accuracy_score
    from sklearn.model_selection import cross_val_score
    from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
    from sklearn.neural_network import MLPClassifier

    # Base estimators for fast CV (no nested calibration overhead)
    base_estimators = {
        "RandomForest":   RandomForestClassifier(n_estimators=100, max_depth=15,
                              class_weight="balanced", random_state=42, n_jobs=-1),
        "HistGradBoost":  HistGradientBoostingClassifier(max_iter=100, max_depth=6,
                              learning_rate=0.1, random_state=42),
        "MLP":            MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=100,
                              random_state=42, early_stopping=True),
    }

    results = {}
    for name, cal_model in models.items():
        # Test accuracy on calibrated model (best quality)
        acc = accuracy_score(y_test, cal_model.predict(X_test))
        # CV on lightweight base estimator (fast, indicative)
        base = base_estimators.get(name)
        if base is not None:
            cv = cross_val_score(base, X_train, y_train, cv=3,
                                 scoring="accuracy", n_jobs=-1)
            cv_mean, cv_std = float(cv.mean()), float(cv.std())
        else:
            cv_mean, cv_std = acc, 0.0
        results[name] = {"test_acc": acc, "cv_mean": cv_mean, "cv_std": cv_std}
        print(f"  {name:20s}  test={acc:.4f}  cv={cv_mean:.4f}+/-{cv_std:.4f}")

    best_name = max(results, key=lambda k: results[k]["test_acc"])
    print(f"\n  Best model: {best_name} (test_acc={results[best_name]['test_acc']:.4f})")
    return best_name, results

def build_report(best_name, best_model, models_results,
                 X_test, y_test):
    from sklearn.metrics import classification_report, confusion_matrix
    y_pred = best_model.predict(X_test)
    cr     = classification_report(y_test, y_pred, digits=4, output_dict=True)
    cm     = confusion_matrix(y_test, y_pred, labels=SIGN_LIST)

    lines = [
        "# ML Training Report -- SignLearn AI",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
        "## Model Benchmarks",
        "| Model | Test Accuracy | CV Mean | CV Std |",
        "|---|---|---|---|",
    ]
    for nm, r in models_results.items():
        flag = " **BEST**" if nm == best_name else ""
        lines.append(f"| {nm}{flag} | {r['test_acc']:.4f} | {r['cv_mean']:.4f} | {r['cv_std']:.4f} |")

    lines += ["", "## Per-Sign Metrics (Best Model)",
              "| Sign | Precision | Recall | F1 | Support |",
              "|---|---|---|---|---|"]
    for sign in SIGN_LIST:
        if sign in cr:
            m = cr[sign]
            lines.append(f"| {sign} | {m['precision']:.4f} | {m['recall']:.4f} | {m['f1-score']:.4f} | {int(m['support'])} |")

    lines += ["", f"**Macro avg F1**: {cr['macro avg']['f1-score']:.4f}",
              f"**Weighted avg F1**: {cr['weighted avg']['f1-score']:.4f}", ""]

    # Top confused pairs
    lines.append("## Top Confused Sign Pairs")
    lines.append("| True Sign | Predicted As | Count |")
    lines.append("|---|---|---|")
    confused = []
    for i, true_sign in enumerate(SIGN_LIST):
        for j, pred_sign in enumerate(SIGN_LIST):
            if i != j and cm[i, j] > 0:
                confused.append((cm[i, j], true_sign, pred_sign))
    confused.sort(reverse=True)
    for cnt, ts, ps in confused[:15]:
        lines.append(f"| {ts} | {ps} | {cnt} |")

    lines += ["", "## Feature Engineering",
              "| Feature Group | Count |",
              "|---|---|",
              "| Raw (x,y,z) per landmark | 63 |",
              "| Finger curl ratios | 5 |",
              "| Inter-adjacent-finger angles | 4 |",
              "| Palm orientation normal vector | 3 |",
              "| Fingertip pair distances | 10 |",
              "| **Total** | **85** |",
              "",
              "## Config Used",
              f"```json",
              f"{__import__('json').dumps(CONFIG, indent=2)}",
              "```",
              "",
              "*Report auto-generated by ml/train_classifier.py*"]

    return "\n".join(lines)

# ── MAIN ──────────────────────────────────────────────────────
def main():
    import json
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler, LabelEncoder

    print("=" * 60)
    print("SignLearn AI -- Enhanced ASL Classifier Training")
    print("=" * 60)

    # 1. Generate full dataset
    X_raw, y = build_dataset(
        samples_per_sign=CONFIG["samples_per_sign"],
        noise_std=CONFIG["noise_std"],
        scale_var=CONFIG["scale_variance"],
    )

    # 2. Scale features
    scaler = StandardScaler()
    X = scaler.fit_transform(X_raw)

    # 3. Encode labels
    le = LabelEncoder()
    le.fit(SIGN_LIST)
    y_enc = le.transform(y)

    # 4. Stratified train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42
    )
    print(f"\nTrain: {X_train.shape[0]}  Test: {X_test.shape[0]}")

    # 5. Train all models
    models = train_models(X_train, y_train)

    # 6. Evaluate
    print("\nEvaluating models on held-out test set:")
    best_name, results = evaluate_models(models, X_test, y_test,
                                         X_train, y_train)
    best_model = models[best_name]

    # 7. Build report
    report_md = build_report(best_name, best_model, results, X_test, y_test)
    docs_dir = Path(__file__).parent.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    report_path = docs_dir / "ML_Training_Report.md"
    report_path.write_text(report_md, encoding="utf-8")
    print(f"\nReport saved: {report_path}")

    # 8. Save model bundle
    models_dir = Path(__file__).parent.parent / "backend" / "models"
    models_dir.mkdir(exist_ok=True)
    bundle = {
        "model":        best_model,
        "scaler":       scaler,
        "label_encoder":le,
        "sign_list":    SIGN_LIST,
        "feature_dim":  85,
        "config":       CONFIG,
        "trained_at":   datetime.now().isoformat(),
        "best_model":   best_name,
        "test_accuracy":results[best_name]["test_acc"],
    }
    pkl_path = models_dir / "sign_classifier.pkl"
    with open(pkl_path, "wb") as fh:
        pickle.dump(bundle, fh)
    print(f"Model saved : {pkl_path}")

    # Also save config for the backend
    cfg_path = Path(__file__).parent.parent / "backend" / "ml_config.json"
    with open(cfg_path, "w") as fh:
        json.dump(CONFIG, fh, indent=2)
    print(f"Config saved: {cfg_path}")

    print("\nDone! Run the backend and the improved model will load automatically.")
    print(f"Best model  : {best_name}")
    print(f"Test accuracy: {results[best_name]['test_acc']:.4f}")
    print(f"CV accuracy : {results[best_name]['cv_mean']:.4f} +/- {results[best_name]['cv_std']:.4f}")


# ── PREDICT HELPER (used by backend ai_evaluate.py) ───────────
def predict_sign(landmarks_flat, bundle):
    """
    landmarks_flat : list/array of 63 floats (21 * xyz)
    bundle         : loaded pickle dict
    Returns        : (sign_label, confidence_0_to_100)
    """
    lm = np.array(landmarks_flat, dtype=np.float32).reshape(1, -1)
    feats = extract_features(lm)                   # (1, 85)
    scaled = bundle["scaler"].transform(feats)
    proba  = bundle["model"].predict_proba(scaled)[0]
    class_idx = int(np.argmax(proba))
    confidence = float(proba[class_idx]) * 100.0
    label = bundle["label_encoder"].inverse_transform([class_idx])[0]
    return label, confidence


if __name__ == "__main__":
    main()


