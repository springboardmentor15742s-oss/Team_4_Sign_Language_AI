# Milestone 2 Task 2 — AI Gesture Recognition (Chinmayee Badiger)

**What this document covers**

- Your assigned work for Milestone 2 Task 2
- Files added on branch `chinmayee-week-2`
- How `POST /api/ai/evaluate` works end-to-end
- How to train / run / test
- How this connects to teammates (Ankur, Prasanna, Pragathi)

**Owner:** Chinmayee Badiger (Full-Stack Developer)  
**Branch:** `chinmayee-week-2`  
**Milestone:** 2 — Gesture Recognition & Assessment  
**Assigned task:** Task 2 — AI Gesture Recognition Endpoint  

Related Week 1 docs:
- [`Dataset_Integration_Guide.md`](./Dataset_Integration_Guide.md)
- [`Explanation.md`](./Explanation.md) (dataset processing roadmap)

---

## 1. Your assignment (Task 2)

From the Milestone 2 plan, you own:

1. **FastAPI endpoint** `POST /ai/evaluate` (mounted as `/api/ai/evaluate`)
2. **Landmark feature extractor** — turns MediaPipe’s 21 hand keypoints into a model feature vector
3. **Dataset loader integration** — reads Sign Language MNIST + ASL Alphabet from `datasets/raw/`
4. **Landmark classification model** — Random Forest (default) or KNN
5. **JSON response** with predicted sign, accuracy %, correctness, and coaching corrections

**Not your Milestone 2 scope (teammates):**

| Person | Their piece that plugs into yours |
|--------|-----------------------------------|
| Ankur | Live camera + MediaPipe in the browser; calls your endpoint with landmarks |
| Prasanna | API / scoring schemas & WebSocket specs (align request fields with him) |
| Pragathi | DB tables for practice history / mastery (Task 4 persists *after* evaluate) |
| Rishi | Exception / quiz workflows (Task 3) |
| Aditya | UI wireframes for feedback cards |

---

## 2. Files added on `chinmayee-week-2`

```text
backend/app/routers/ai_evaluate.py      # POST /api/ai/evaluate (+ detailed + health)
backend/app/schemas/ai_evaluate.py      # Request / response Pydantic models
backend/app/ml/
  features.py                           # Landmark → 73-D feature vector
  dataset_loader.py                     # MNIST CSV + ASL folder loaders
  corrections.py                        # Coaching tip generator
  classifier.py                         # Load / predict RandomForest|KNN
  train_model.py                        # Train CLI + synthetic bootstrap data
  artifacts/
    gesture_classifier.joblib           # Saved model (auto-created if missing)
docs/Milestone2_Task2_Explanation.md    # This file
```

> Note: The assignment text said `backend/routers/ai_evaluate.py`. This repo already uses the package layout `backend/app/…`, so the router lives at `backend/app/routers/ai_evaluate.py` and is registered in `backend/app/main.py`.

---

## 3. How the endpoint works

```text
Webcam (Ankur / Task 1)
   MediaPipe Hands → 21 landmarks {x,y,z}
        │
        ▼
POST /api/ai/evaluate
        │
        ├─ features.extract_landmark_features()
        │     wrist-center, palm-normalize, tip distances
        ├─ GestureClassifier.predict_from_landmarks()
        │     StandardScaler → RandomForest / KNN
        └─ corrections.generate_corrections()
              finger extension tips for the banner
        │
        ▼
{
  "predicted_sign": "A",
  "accuracy_percentage": 92.5,
  "is_correct": true,
  "corrections": ["Hand angle optimal", "Good thumb position"]
}
```

### Request body examples

**21 landmark objects (typical from MediaPipe JS):**

```json
{
  "landmarks": [
    {"x": 0.51, "y": 0.72, "z": 0.0},
    {"x": 0.48, "y": 0.65, "z": -0.01}
  ],
  "expected_sign": "A",
  "session_id": "practice-001",
  "source": "webcam"
}
```

(`landmarks` must contain **21** points in production.)

**Flat vector:**

```json
{
  "landmarks_flat": [0.5, 0.7, 0.0, 0.48, 0.65, -0.01],
  "expected_sign": "B"
}
```

(`landmarks_flat` length must be **63** = 21 × 3.)

### Response fields

| Field | Meaning |
|-------|---------|
| `predicted_sign` | Top predicted letter / class |
| `accuracy_percentage` | Confidence (0–100). If `expected_sign` is set, reflects match quality for scoring |
| `is_correct` | Whether prediction matches `expected_sign` (practice/quiz mode) |
| `corrections` | Short tips for Ankur’s green/red overlay + banner |

### Extra routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/ai/evaluate` | Main contract for Task 2 |
| `POST` | `/api/ai/evaluate/detailed` | Same + model_type / confidence for debugging |
| `GET` | `/api/ai/health` | Model loaded? MNIST/ASL folders present? |

---

## 4. Landmark feature extractor

File: `backend/app/ml/features.py`

1. Accept 21×3 MediaPipe landmarks  
2. Translate so **wrist = origin**  
3. Scale by **palm size** (wrist → middle MCP)  
4. Flatten to 63 values  
5. Append **10 pairwise fingertip distances** → **73-D** vector  

This makes features roughly invariant to hand position and distance from camera.

---

## 5. Dataset loader integration

File: `backend/app/ml/dataset_loader.py`

| Loader | Reads | Output |
|--------|-------|--------|
| `load_sign_language_mnist()` | `datasets/raw/sign_language_mnist/*.csv` | 784-D pixel vectors + letters A–Y (no J/Z) |
| `load_asl_alphabet_image_paths()` | `datasets/raw/asl_alphabet/...` | `(label, path)` for MediaPipe extraction |
| `load_asl_alphabet_as_pixels()` | same images via Pillow | resized grayscale vectors (fallback) |
| `dataset_status()` | folder presence | used by `/api/ai/health` |

**Important design note:** Sign Language MNIST is **pixels**, not landmarks. The live camera path is **landmark-based**. Training therefore:

1. Always seeds with **synthetic landmark prototypes** (so the API works without downloads)  
2. Optionally extracts **real landmarks from ASL images** if `mediapipe` is installed and ASL is on disk (`--from-datasets`)  
3. Caches MNIST pixel features separately for future CNN / teammate use — they are **not** mixed into the 73-D landmark Random Forest (different dimensionality)

---

## 6. Model training

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Bootstrap model (synthetic landmarks) — also auto-runs on API startup if missing
python -m app.ml.train_model

# Or merge synthetic + on-disk datasets (ASL landmarks if mediapipe available)
python -m app.ml.train_model --from-datasets --model-type random_forest

# Alternative model
python -m app.ml.train_model --model-type knn
```

Artifact path: `backend/app/ml/artifacts/gesture_classifier.joblib`

---

## 7. How to run and smoke-test

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Health:

```bash
curl http://localhost:8000/api/ai/health
```

Evaluate (minimal flat vector of 63 zeros will return *some* prediction — use real MediaPipe landmarks for real accuracy):

```bash
# Generate a quick synthetic "A" sample via Python, or call from Swagger UI:
open http://localhost:8000/docs
```

Use Swagger → **AI Gesture Recognition** → `POST /api/ai/evaluate`.

---

## 8. Contract for teammates

### Ankur (Task 1) should send

- MediaPipe Hands landmarks each frame (or throttled, e.g. 5–10 FPS)
- Optional `expected_sign` during practice / quiz
- Optional `session_id` so Pragathi/Ankur can later log Task 4 rows

### Use your response for UI

- `accuracy_percentage >= 80` → green skeleton  
- `< 80` → orange/red skeleton  
- `corrections[]` → banner text (“Extend your index finger further”)

### Prasanna

Keep OpenAPI field names aligned: `predicted_sign`, `accuracy_percentage`, `is_correct`, `corrections`.  
Detailed route is available if scoring schemas need `confidence_top` / `model_type`.

### Pragathi / Task 4

This endpoint **does not write to the DB** (out of Task 2 scope). After evaluate, the practice flow should insert into `Practice_History` / update `Skill_Mastery` using the JSON result.

---

## 9. Definition of done (your Task 2)

- [x] `POST /api/ai/evaluate` implemented under `backend/app/routers/ai_evaluate.py`
- [x] Landmark feature extractor implemented
- [x] Dataset loaders for MNIST + ASL paths integrated
- [x] Random Forest / KNN training + inference path
- [x] Response matches required JSON shape
- [x] Explanation doc on the branch
- [ ] (Optional follow-up) Retrain with `--from-datasets` after downloading ASL/MNIST locally
- [ ] (Optional) Install `mediapipe` for real ASL landmark mining

---

## 10. What you should say in standup / PR

> Implemented Milestone 2 Task 2 on `chinmayee-week-2`: FastAPI `POST /api/ai/evaluate` with MediaPipe landmark feature extraction, MNIST/ASL dataset loaders, and a Random Forest classifier. Returns `predicted_sign`, `accuracy_percentage`, `is_correct`, and `corrections` for the live camera UI. Includes training CLI and this explanation doc.

---

*Branch: `chinmayee-week-2` · Module owner: Chinmayee Badiger*
