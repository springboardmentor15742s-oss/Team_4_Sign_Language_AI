# Milestone 2 Task 2 Explanation — Chinmayee Badiger

## Assigned Work

Chinmayee's assigned Milestone 2 task is **Task 2: AI Gesture Recognition Endpoint**.

The goal is to build the backend API that receives MediaPipe hand landmarks from the live webcam component and returns:

- `predicted_sign`
- `accuracy_percentage`
- `is_correct`
- `corrections`

This supports Ankur's live camera UI, Prasanna's API contract, and later database logging by Pragathi.

## What Was Implemented

- Created FastAPI router: `backend/app/routers/ai_evaluate.py`
- Added main endpoint: `POST /api/ai/evaluate`
- Added debug endpoint: `POST /api/ai/evaluate/detailed`
- Added health endpoint: `GET /api/ai/health`
- Registered the AI router in `backend/app/main.py`
- Added Pydantic request/response schemas in `backend/app/schemas/ai_evaluate.py`
- Added landmark feature extraction in `backend/app/ml/features.py`
- Added correction-tip generation in `backend/app/ml/corrections.py`
- Added Random Forest/KNN classifier wrapper in `backend/app/ml/classifier.py`
- Added training/bootstrap helpers in `backend/app/ml/train_model.py`
- Added dataset loader integration in `backend/app/ml/dataset_loader.py`
- Added a saved bootstrap model artifact at `backend/app/ml/artifacts/gesture_classifier.joblib`

## How The Endpoint Works

The frontend sends 21 MediaPipe hand landmarks to the backend.

The backend then:

1. Validates the input landmarks.
2. Converts 21 hand keypoints into a 73-value feature vector.
3. Runs the gesture classifier.
4. Compares the prediction with `expected_sign`, if provided.
5. Generates correction tips based on landmark geometry.
6. Returns the final JSON response.

Example response:

```json
{
  "predicted_sign": "A",
  "accuracy_percentage": 92.5,
  "is_correct": true,
  "corrections": ["Hand angle optimal", "Good thumb position"]
}
```

## Dataset Integration

The loader supports:

- **Sign Language MNIST** from `datasets/raw/sign_language_mnist`
- **ASL Alphabet** from `datasets/raw/asl_alphabet`

Important note: Sign Language MNIST contains pixel data, while the live camera endpoint uses landmarks. Because these are different feature types, MNIST is loaded and cached for future image-model work, while the current endpoint uses landmark features.

The model can run even before large datasets are downloaded because it includes a synthetic landmark bootstrap model. Later, the team can retrain with real ASL images using MediaPipe landmark extraction.

## Branch

All generated Task 2 work is on:

```text
chinmayee-week-2
```

## How To Run

From the backend folder:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open Swagger:

```text
http://localhost:8000/docs
```

Test:

```text
POST /api/ai/evaluate
```

## What To Say To Mentor

I implemented the AI gesture recognition backend for Milestone 2. The endpoint accepts MediaPipe hand landmarks from the live camera, extracts normalized landmark features, runs a lightweight classifier, and returns the predicted sign, accuracy percentage, correctness status, and correction tips. I also added dataset loader support for Sign Language MNIST and ASL Alphabet, along with training utilities and documentation.
