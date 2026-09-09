from fastapi import APIRouter

router = APIRouter(prefix="/datasets", tags=["Sign Language Datasets Integration"])

DATASET_METADATA = {
    "sign_language_mnist": {
        "name": "Sign Language MNIST",
        "type": "static_image_csv",
        "classes": 24,
        "sample_count": 34627,
        "resolution": "28x28",
        "status": "integrated",
        "use_case": "Rapid prototyping & baseline CNN model training"
    },
    "asl_alphabet": {
        "name": "ASL Alphabet Dataset",
        "type": "static_image_rgb",
        "classes": 29,
        "sample_count": 87000,
        "resolution": "200x200",
        "status": "integrated",
        "use_case": "High-accuracy static hand gesture classification"
    },
    "wlasl_100": {
        "name": "WLASL (Word-Level ASL)",
        "type": "dynamic_video",
        "classes": 100,
        "sample_count": 2000,
        "status": "integrated",
        "use_case": "Dynamic sign gesture recognition with LSTM"
    }
}

@router.get("/")
def get_integrated_datasets():
    return {
        "count": len(DATASET_METADATA),
        "datasets": DATASET_METADATA
    }

@router.get("/{dataset_key}")
def get_dataset_detail(dataset_key: str):
    if dataset_key not in DATASET_METADATA:
        return {"error": f"Dataset {dataset_key} not found"}
    return DATASET_METADATA[dataset_key]
