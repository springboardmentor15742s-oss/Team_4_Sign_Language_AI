import os, sys, json, pickle, time
import numpy as np
from pathlib import Path

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    from sklearn.metrics import accuracy_score, classification_report
    from sklearn.pipeline import Pipeline
    SKLEARN_OK = True
except ImportError:
    print("scikit-learn not installed. Run: pip install scikit-learn")
    SKLEARN_OK = False

MODEL_DIR  = Path(__file__).parent / "model"
MODEL_PATH = MODEL_DIR / "sign_classifier.pkl"

SIGNS = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M",
    "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "HELLO","THANK_YOU","PLEASE","YES","NO","NAMASTE","PEACE",
    "GOOD","BAD","HELP","LOVE","SORRY","FRIEND","FAMILY",
]

def generate_synthetic_landmarks(sign, n_samples=120):
    np.random.seed(hash(sign) % 2**31)
    base  = np.random.rand(63) * 0.5 + 0.25
    noise = np.random.randn(n_samples, 63) * 0.035
    return np.clip(base + noise, 0, 1)

def train():
    if not SKLEARN_OK:
        sys.exit(1)

    print("SignLearn AI -- Classifier Training")
    print("=" * 48)

    X, y = [], []
    for sign in SIGNS:
        samples = generate_synthetic_landmarks(sign, 120)
        X.append(samples)
        y.extend([sign] * len(samples))
    X = np.vstack(X)
    y = np.array(y)
    print(f"Dataset: {len(X)} samples | {len(set(y))} classes")

    le    = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(
            n_estimators=200, max_depth=20,
            min_samples_split=3, class_weight="balanced",
            random_state=42, n_jobs=-1,
        ))
    ])

    print("Training RandomForest (200 trees)...")
    t0 = time.time()
    pipeline.fit(X_train, y_train)
    print(f"Training done in {time.time()-t0:.1f}s")

    y_pred = pipeline.predict(X_test)
    acc    = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {acc*100:.1f}%")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    bundle = {
        "pipeline":      pipeline,
        "label_encoder": le,
        "signs":         list(le.classes_),
        "features":      63,
        "accuracy":      float(acc),
        "trained_at":    time.strftime("%Y-%m-%d %H:%M:%S"),
        "version":       "1.0.0",
    }
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(bundle, f)

    size_kb = MODEL_PATH.stat().st_size // 1024
    print(f"Model saved -> {MODEL_PATH}  ({size_kb} KB)")
    print("Done! Backend will auto-load this model on next startup.")

if __name__ == "__main__":
    train()
