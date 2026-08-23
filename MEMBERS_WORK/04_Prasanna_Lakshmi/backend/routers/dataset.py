from fastapi import APIRouter
from typing import Dict

router = APIRouter(prefix="/datasets", tags=["Sign Language Datasets Integration"])

DATASET_METADATA = {
    "sign_language_mnist": {
        "name": "Sign Language MNIST",
        "type": "static_image_csv",
        "classes": 24,
        "sample_count": 34627,
        "resolution": "28x28",
        "channels": 1,
        "status": "integrated",
        "source_url": "https://www.kaggle.com/datasets/datamunge/sign-language-mnist",
        "use_case": "Rapid prototyping & baseline CNN model training"
    },
    "asl_alphabet": {
        "name": "ASL Alphabet Dataset",
        "type": "static_image_rgb",
        "classes": 29,
        "sample_count": 87000,
        "resolution": "200x200",
        "channels": 3,
        "status": "integrated",
        "source_url": "https://www.kaggle.com/datasets/grassknoted/asl-alphabet",
        "use_case": "High-accuracy static hand gesture classification"
    },
    "wlasl_100": {
        "name": "WLASL (Word-Level ASL - 100 Subset)",
        "type": "dynamic_video",
        "classes": 100,
        "sample_count": 2000,
        "fps": 25,
        "status": "integrated",
        "source_url": "https://github.com/dxli94/WLASL",
        "use_case": "Dynamic sign gesture recognition with LSTM / Transformers"
    },
    "rwth_phoenix": {
        "name": "RWTH-PHOENIX-Weather 2014",
        "type": "continuous_sequence",
        "classes": 1000,
        "sample_count": 7000,
        "resolution": "210x260",
        "status": "integrated",
        "source_url": "https://www-i6.informatik.rwth-aachen.de/~koller/RWTH-PHOENIX/",
        "use_case": "Continuous sign language translation & sequence model"
    }
}

@router.get("/")
def get_integrated_datasets():
    """
    List all integrated sign language datasets and specs.
    """
    return {
        "count": len(DATASET_METADATA),
        "datasets": DATASET_METADATA
    }

@router.get("/{dataset_key}")
def get_dataset_detail(dataset_key: str):
    """
    Get detailed dataset specifications and preprocessing config.
    """
    if dataset_key not in DATASET_METADATA:
        return {"error": f"Dataset {dataset_key} not found"}
    return DATASET_METADATA[dataset_key]
