"""
Dataset loaders for Sign Language MNIST and ASL Alphabet.

Paths follow docs/Dataset_Integration_Guide.md:
  datasets/raw/sign_language_mnist/
  datasets/raw/asl_alphabet/
"""

from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import numpy as np

# Sign Language MNIST labels 0–24 skip J (9) and Z (25) in letter mapping
MNIST_LABEL_TO_LETTER = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
    8: "I",
    10: "K",
    11: "L",
    12: "M",
    13: "N",
    14: "O",
    15: "P",
    16: "Q",
    17: "R",
    18: "S",
    19: "T",
    20: "U",
    21: "V",
    22: "W",
    23: "X",
    24: "Y",
}

ASL_SPECIAL_CLASSES = {"space": "SPACE", "del": "DEL", "delete": "DEL", "nothing": "NOTHING"}


@dataclass
class LoadedDataset:
    name: str
    features: np.ndarray  # (N, D) — image-derived or landmark-derived
    labels: np.ndarray  # (N,) string labels e.g. "A"
    source_paths: list[str] | None = None


def repo_root_from_backend() -> Path:
    """backend/app/ml/dataset_loader.py → repo root."""
    return Path(__file__).resolve().parents[3]


def default_raw_root() -> Path:
    configured = os.getenv("DATASETS_ROOT")
    if configured:
        path = Path(configured).expanduser()
        if not path.is_absolute():
            path = repo_root_from_backend() / path
        return path.resolve()
    return repo_root_from_backend() / "datasets" / "raw"


def load_sign_language_mnist(
    data_dir: Path | None = None,
    *,
    max_samples: int | None = None,
    normalize: bool = True,
) -> LoadedDataset:
    """
    Load Sign Language MNIST CSVs into flat 784-d image feature vectors + letter labels.

    Note: MNIST is grayscale pixels, not MediaPipe landmarks. These vectors are used
    for an optional image-branch baseline. Landmark models train primarily on ASL
    (or synthetic landmarks). See train_model.py.
    """
    root = data_dir or (default_raw_root() / "sign_language_mnist")
    train_csv = root / "sign_mnist_train.csv"
    test_csv = root / "sign_mnist_test.csv"

    files = [p for p in (train_csv, test_csv) if p.exists()]
    if not files:
        raise FileNotFoundError(
            f"Sign Language MNIST CSVs not found under {root}. "
            "Download per docs/Dataset_Integration_Guide.md §4."
        )

    rows: list[list[float]] = []
    labels: list[str] = []

    for path in files:
        with path.open(newline="") as fh:
            reader = csv.DictReader(fh)
            for i, row in enumerate(reader):
                if max_samples is not None and len(labels) >= max_samples:
                    break
                label_idx = int(row["label"])
                letter = MNIST_LABEL_TO_LETTER.get(label_idx)
                if letter is None:
                    continue
                pixels = [float(row[f"pixel{j}"]) for j in range(1, 785)]
                rows.append(pixels)
                labels.append(letter)
        if max_samples is not None and len(labels) >= max_samples:
            break

    X = np.asarray(rows, dtype=np.float32)
    if normalize and X.size:
        X = X / 255.0
    y = np.asarray(labels)
    return LoadedDataset(name="sign_language_mnist", features=X, labels=y)


def _iter_asl_image_paths(train_root: Path) -> Iterable[tuple[str, Path]]:
    if not train_root.is_dir():
        return
    for class_dir in sorted(train_root.iterdir()):
        if not class_dir.is_dir():
            continue
        raw_name = class_dir.name
        letter = ASL_SPECIAL_CLASSES.get(raw_name.lower(), raw_name.upper())
        for img_path in class_dir.glob("*"):
            if img_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}:
                yield letter, img_path


def load_asl_alphabet_image_paths(
    data_dir: Path | None = None,
    *,
    max_per_class: int | None = 50,
) -> list[tuple[str, Path]]:
    """
    Collect (label, image_path) pairs from ASL Alphabet folder layout.
    Does not load pixels — callers (train_model) may run MediaPipe on these paths.
    """
    root = data_dir or (default_raw_root() / "asl_alphabet")
    train_root = root / "asl_alphabet_train"
    if not train_root.exists():
        # Some Kaggle extracts put class folders directly under asl_alphabet/
        train_root = root

    pairs: list[tuple[str, Path]] = []
    counts: dict[str, int] = {}
    for letter, path in _iter_asl_image_paths(train_root):
        n = counts.get(letter, 0)
        if max_per_class is not None and n >= max_per_class:
            continue
        pairs.append((letter, path))
        counts[letter] = n + 1

    if not pairs:
        raise FileNotFoundError(
            f"ASL Alphabet images not found under {root}. "
            "Download per docs/Dataset_Integration_Guide.md §5."
        )
    return pairs


def load_asl_alphabet_as_pixels(
    data_dir: Path | None = None,
    *,
    max_per_class: int | None = 30,
    size: tuple[int, int] = (64, 64),
) -> LoadedDataset:
    """
    Load ASL Alphabet images as resized grayscale pixel vectors (fallback when
    MediaPipe landmark extraction is unavailable during training).
    """
    try:
        from PIL import Image
    except ImportError as exc:
        raise ImportError("Pillow is required to load ASL images. pip install pillow") from exc

    pairs = load_asl_alphabet_image_paths(data_dir, max_per_class=max_per_class)
    rows: list[np.ndarray] = []
    labels: list[str] = []
    paths: list[str] = []

    for letter, path in pairs:
        with Image.open(path) as im:
            gray = im.convert("L").resize(size)
            arr = np.asarray(gray, dtype=np.float32).reshape(-1) / 255.0
        rows.append(arr)
        labels.append(letter)
        paths.append(str(path))

    return LoadedDataset(
        name="asl_alphabet",
        features=np.stack(rows),
        labels=np.asarray(labels),
        source_paths=paths,
    )


def dataset_status(raw_root: Path | None = None) -> dict:
    """Quick presence check for Week 1 dataset folders (used by /ai/evaluate/health)."""
    root = raw_root or default_raw_root()
    mnist = root / "sign_language_mnist"
    asl = root / "asl_alphabet"
    mnist_ok = (mnist / "sign_mnist_train.csv").exists() or any(mnist.glob("*.csv"))
    asl_train = asl / "asl_alphabet_train"
    asl_ok = asl_train.is_dir() or any(asl.glob("**/*.[Jj][Pp][Gg]"))
    return {
        "raw_root": str(root),
        "sign_language_mnist": {"path": str(mnist), "available": bool(mnist_ok)},
        "asl_alphabet": {"path": str(asl), "available": bool(asl_ok)},
    }
