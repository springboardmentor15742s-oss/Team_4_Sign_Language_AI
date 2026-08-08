"""
Train landmark (or image-fallback) gesture classifiers.

Usage (from backend/):
  python -m app.ml.train_model
  python -m app.ml.train_model --model-type knn
  python -m app.ml.train_model --from-datasets   # requires downloaded MNIST/ASL
"""

from __future__ import annotations

import argparse
import logging
from pathlib import Path

import numpy as np
from sklearn.preprocessing import LabelEncoder

from app.ml.classifier import DEFAULT_MODEL_PATH, build_pipeline
from app.ml.features import FEATURE_DIM, NUM_LANDMARKS, extract_landmark_features

logger = logging.getLogger(__name__)

# Coarse MediaPipe-like prototypes for A–Z (21 x 3). Enough for API bootstrapping
# and unit demos; replace by training on real ASL landmarks when data is present.
_LETTER_FINGER_PATTERN: dict[str, tuple[float, float, float, float, float]] = {
    # thumb, index, middle, ring, pinky extension (0 curled → 1 extended)
    "A": (0.55, 0.2, 0.2, 0.2, 0.2),
    "B": (0.3, 1.0, 1.0, 1.0, 1.0),
    "C": (0.7, 0.7, 0.7, 0.65, 0.6),
    "D": (0.4, 1.0, 0.25, 0.25, 0.25),
    "E": (0.35, 0.25, 0.25, 0.25, 0.25),
    "F": (0.55, 0.3, 0.95, 0.95, 0.95),
    "G": (0.85, 0.9, 0.2, 0.2, 0.2),
    "H": (0.4, 0.95, 0.95, 0.25, 0.25),
    "I": (0.35, 0.25, 0.25, 0.25, 0.95),
    "J": (0.35, 0.25, 0.25, 0.25, 0.95),
    "K": (0.7, 0.95, 0.85, 0.25, 0.25),
    "L": (0.9, 1.0, 0.2, 0.2, 0.2),
    "M": (0.3, 0.35, 0.35, 0.35, 0.2),
    "N": (0.35, 0.35, 0.35, 0.2, 0.2),
    "O": (0.55, 0.55, 0.55, 0.55, 0.55),
    "P": (0.5, 0.85, 0.7, 0.25, 0.25),
    "Q": (0.7, 0.7, 0.25, 0.25, 0.25),
    "R": (0.4, 0.9, 0.9, 0.25, 0.25),
    "S": (0.45, 0.2, 0.2, 0.2, 0.2),
    "T": (0.5, 0.35, 0.25, 0.25, 0.25),
    "U": (0.35, 0.95, 0.95, 0.25, 0.25),
    "V": (0.35, 1.0, 1.0, 0.25, 0.25),
    "W": (0.35, 1.0, 1.0, 1.0, 0.25),
    "X": (0.4, 0.55, 0.25, 0.25, 0.25),
    "Y": (0.9, 0.25, 0.25, 0.25, 0.95),
    "Z": (0.4, 0.9, 0.25, 0.25, 0.25),
}


def _finger_chain(base: np.ndarray, direction: np.ndarray, extension: float) -> list[np.ndarray]:
    """Build 4 joints from MCP-ish base along direction scaled by extension."""
    d = direction / (np.linalg.norm(direction) + 1e-6)
    lengths = np.array([0.15, 0.28, 0.40, 0.55]) * (0.35 + 0.65 * extension)
    return [base + d * L for L in lengths]


def synthesize_hand_landmarks(letter: str, rng: np.random.Generator) -> np.ndarray:
    """Create a noisy (21, 3) landmark set resembling letter `letter`."""
    pattern = _LETTER_FINGER_PATTERN[letter.upper()]
    pts = np.zeros((NUM_LANDMARKS, 3), dtype=np.float32)

    # Wrist + rough palm anchors
    pts[0] = [0.5, 0.75, 0.0]
    # Thumb CMC→tip indices 1–4
    thumb_base = pts[0] + np.array([-0.08, -0.05, 0.02])
    thumb_dir = np.array([-0.35, -0.55, 0.05]) + rng.normal(0, 0.02, 3)
    for i, p in enumerate(_finger_chain(thumb_base, thumb_dir, pattern[0])):
        pts[1 + i] = p

    finger_defs = [
        (5, np.array([-0.12, -0.75, 0.0]), pattern[1]),  # index
        (9, np.array([0.0, -0.78, 0.0]), pattern[2]),  # middle
        (13, np.array([0.12, -0.75, 0.0]), pattern[3]),  # ring
        (17, np.array([0.22, -0.68, 0.0]), pattern[4]),  # pinky
    ]
    for start, direction, ext in finger_defs:
        base = pts[0] + np.array([direction[0] * 0.25, -0.12, 0.0])
        direction = direction + rng.normal(0, 0.03, 3)
        for i, p in enumerate(_finger_chain(base, direction, ext)):
            pts[start + i] = p

    # Jitter + mild affine noise
    pts += rng.normal(0, 0.012, pts.shape).astype(np.float32)
    scale = float(rng.uniform(0.9, 1.1))
    pts = (pts - pts[0]) * scale + pts[0]
    return pts.astype(np.float32)


def build_synthetic_landmark_dataset(
    samples_per_class: int = 40,
    letters: list[str] | None = None,
    seed: int = 42,
) -> tuple[np.ndarray, np.ndarray]:
    letters = letters or list(_LETTER_FINGER_PATTERN.keys())
    rng = np.random.default_rng(seed)
    X_list: list[np.ndarray] = []
    y_list: list[str] = []
    for letter in letters:
        for _ in range(samples_per_class):
            lm = synthesize_hand_landmarks(letter, rng)
            X_list.append(extract_landmark_features(lm))
            y_list.append(letter.upper())
    X = np.stack(X_list)
    y = np.asarray(y_list)
    assert X.shape[1] == FEATURE_DIM
    return X, y


def fit_landmark_classifier(
    X: np.ndarray,
    y: np.ndarray,
    *,
    model_type: str = "random_forest",
):
    encoder = LabelEncoder()
    y_enc = encoder.fit_transform(y)
    pipeline = build_pipeline(model_type=model_type)
    pipeline.fit(X, y_enc)
    resolved = "knn" if model_type == "knn" else "random_forest"
    return pipeline, encoder, resolved


def train_from_datasets(
    *,
    model_type: str = "random_forest",
    max_mnist: int = 2000,
    max_asl_per_class: int = 40,
    output: Path = DEFAULT_MODEL_PATH,
) -> Path:
    """
    Prefer landmark features when possible; fall back to synthetic + optional
    ASL pixel branch is NOT mixed into the landmark model (dimension mismatch).

    Strategy:
      1. Always include synthetic landmark prototypes (stable prior).
      2. If ASL images exist and mediapipe is installed, extract real landmarks.
      3. MNIST presence is reported; pixel vectors are saved separately for future CNN work.
    """
    import joblib

    from app.ml.dataset_loader import dataset_status, load_sign_language_mnist

    X_syn, y_syn = build_synthetic_landmark_dataset(samples_per_class=30)
    X_parts = [X_syn]
    y_parts = [y_syn]

    status = dataset_status()
    logger.info("Dataset status: %s", status)

    # Optional: MediaPipe landmark extraction from ASL images
    try:
        from app.ml.dataset_loader import load_asl_alphabet_image_paths

        pairs = load_asl_alphabet_image_paths(max_per_class=max_asl_per_class)
        extracted = _extract_landmarks_from_images(pairs)
        if extracted is not None:
            X_asl, y_asl = extracted
            X_parts.append(X_asl)
            y_parts.append(y_asl)
            logger.info("Added %d ASL landmark samples", len(y_asl))
    except FileNotFoundError:
        logger.warning("ASL Alphabet not on disk — training with synthetic landmarks only")
    except Exception as exc:  # noqa: BLE001
        logger.warning("ASL landmark extraction skipped: %s", exc)

    if status["sign_language_mnist"]["available"]:
        try:
            mnist = load_sign_language_mnist(max_samples=max_mnist)
            # Persist MNIST pixel features for teammates (not mixed into landmark RF)
            mnist_out = output.parent / "mnist_pixel_features.joblib"
            joblib.dump({"X": mnist.features, "y": mnist.labels, "name": mnist.name}, mnist_out)
            logger.info("Cached MNIST pixel features → %s (%d samples)", mnist_out, len(mnist.labels))
        except Exception as exc:  # noqa: BLE001
            logger.warning("MNIST load failed: %s", exc)

    X = np.concatenate(X_parts, axis=0)
    y = np.concatenate(y_parts, axis=0)
    pipeline, encoder, resolved = fit_landmark_classifier(X, y, model_type=model_type)

    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "pipeline": pipeline,
            "label_encoder": encoder,
            "model_type": resolved,
            "feature_dim": FEATURE_DIM,
            "n_samples": int(len(y)),
            "classes": list(encoder.classes_),
        },
        output,
    )
    logger.info("Wrote landmark classifier → %s (%s, %d samples)", output, resolved, len(y))
    return output


def _extract_landmarks_from_images(pairs: list[tuple[str, Path]]) -> tuple[np.ndarray, np.ndarray] | None:
    """Optional MediaPipe Hands extraction; returns None if mediapipe unavailable."""
    try:
        import mediapipe as mp
        from PIL import Image
    except ImportError:
        logger.warning("mediapipe/Pillow not installed — skip real ASL landmark extraction")
        return None

    mp_hands = mp.solutions.hands
    X_list: list[np.ndarray] = []
    y_list: list[str] = []

    with mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5) as hands:
        for label, path in pairs:
            with Image.open(path) as im:
                rgb = np.asarray(im.convert("RGB"))
            result = hands.process(rgb)
            if not result.multi_hand_landmarks:
                continue
            hand = result.multi_hand_landmarks[0]
            lm = np.array([[p.x, p.y, p.z] for p in hand.landmark], dtype=np.float32)
            X_list.append(extract_landmark_features(lm))
            y_list.append(label.upper())

    if not X_list:
        return None
    return np.stack(X_list), np.asarray(y_list)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(description="Train Milestone 2 gesture classifier")
    parser.add_argument("--model-type", choices=["random_forest", "knn"], default="random_forest")
    parser.add_argument("--from-datasets", action="store_true", help="Merge synthetic + on-disk datasets")
    parser.add_argument("--output", type=Path, default=DEFAULT_MODEL_PATH)
    parser.add_argument("--samples-per-class", type=int, default=40)
    args = parser.parse_args()

    if args.from_datasets:
        train_from_datasets(model_type=args.model_type, output=args.output)
    else:
        import joblib

        X, y = build_synthetic_landmark_dataset(samples_per_class=args.samples_per_class)
        pipeline, encoder, resolved = fit_landmark_classifier(X, y, model_type=args.model_type)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {
                "pipeline": pipeline,
                "label_encoder": encoder,
                "model_type": resolved,
                "feature_dim": FEATURE_DIM,
                "n_samples": int(len(y)),
                "classes": list(encoder.classes_),
            },
            args.output,
        )
        logger.info("Saved bootstrap model → %s", args.output)


if __name__ == "__main__":
    main()
