"""Gesture classifier — Random Forest over MediaPipe landmark features."""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, StandardScaler

from app.ml.features import FEATURE_DIM, extract_landmark_features

logger = logging.getLogger(__name__)

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
DEFAULT_MODEL_PATH = ARTIFACT_DIR / "gesture_classifier.joblib"

ALPHABET = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


def _backend_root() -> Path:
    """backend/app/ml/classifier.py -> backend/"""
    return Path(__file__).resolve().parents[3]


def _configured_model_path() -> Path:
    configured = os.getenv("GESTURE_MODEL_PATH")
    if not configured:
        return DEFAULT_MODEL_PATH
    path = Path(configured).expanduser()
    if not path.is_absolute():
        path = _backend_root() / path
    return path.resolve()


class GestureClassifier:
    """
    Inference wrapper around a sklearn Pipeline:
      StandardScaler → RandomForestClassifier (or KNN)
    """

    def __init__(self, model_path: Path | None = None):
        self.model_path = model_path or _configured_model_path()
        self.pipeline: Pipeline | None = None
        self.label_encoder: LabelEncoder | None = None
        self.model_type: str = "uninitialized"
        self._ensure_model()

    def _ensure_model(self) -> None:
        if self.model_path.exists():
            payload = joblib.load(self.model_path)
            self.pipeline = payload["pipeline"]
            self.label_encoder = payload["label_encoder"]
            self.model_type = payload.get("model_type", "random_forest")
            logger.info("Loaded gesture model from %s (%s)", self.model_path, self.model_type)
            return

        logger.warning("No trained model at %s — bootstrapping synthetic prototype model", self.model_path)
        self._bootstrap_synthetic_model()
        self.save(self.model_path)

    def _bootstrap_synthetic_model(self) -> None:
        """
        Train a small RandomForest on synthetic landmark prototypes so
        POST /ai/evaluate works before real MNIST/ASL training runs.
        """
        from app.ml.train_model import build_synthetic_landmark_dataset, fit_landmark_classifier

        X, y = build_synthetic_landmark_dataset(samples_per_class=40)
        pipeline, encoder, model_type = fit_landmark_classifier(X, y, model_type="random_forest")
        self.pipeline = pipeline
        self.label_encoder = encoder
        self.model_type = model_type

    def save(self, path: Path | None = None) -> Path:
        path = path or self.model_path
        path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {
                "pipeline": self.pipeline,
                "label_encoder": self.label_encoder,
                "model_type": self.model_type,
                "feature_dim": FEATURE_DIM,
            },
            path,
        )
        return path

    def predict_from_landmarks(
        self,
        landmarks: Any,
        *,
        expected_sign: str | None = None,
    ) -> dict[str, Any]:
        if self.pipeline is None or self.label_encoder is None:
            raise RuntimeError("Classifier is not loaded")

        features = extract_landmark_features(landmarks).reshape(1, -1)
        proba = self.pipeline.predict_proba(features)[0]
        pred_idx = int(np.argmax(proba))
        predicted_sign = str(self.label_encoder.inverse_transform([pred_idx])[0])
        confidence = float(proba[pred_idx] * 100.0)

        # If expected_sign provided, also report probability of that class when known
        accuracy_percentage = confidence
        if expected_sign:
            expected = expected_sign.strip().upper()
            classes = list(self.label_encoder.classes_)
            if expected in classes:
                exp_idx = classes.index(expected)
                accuracy_percentage = float(proba[exp_idx] * 100.0)
            is_correct = predicted_sign.upper() == expected and confidence >= 50.0
            # Prefer showing match confidence when evaluating a target sign
            if predicted_sign.upper() == expected:
                accuracy_percentage = confidence
        else:
            is_correct = confidence >= 80.0

        return {
            "predicted_sign": predicted_sign,
            "accuracy_percentage": round(accuracy_percentage, 2),
            "is_correct": bool(is_correct),
            "confidence_top": round(confidence, 2),
            "model_type": self.model_type,
        }


@lru_cache
def get_gesture_classifier() -> GestureClassifier:
    return GestureClassifier()


def build_pipeline(model_type: str = "random_forest") -> Pipeline:
    if model_type == "knn":
        clf: Any = KNeighborsClassifier(n_neighbors=5, weights="distance")
    else:
        clf = RandomForestClassifier(
            n_estimators=120,
            max_depth=18,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        )
        model_type = "random_forest"
    return Pipeline(
        [
            ("scaler", StandardScaler()),
            ("clf", clf),
        ]
    )
