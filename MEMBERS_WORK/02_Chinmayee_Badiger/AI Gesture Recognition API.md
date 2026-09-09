# Milestone 2 — AI Gesture Recognition API Specification
**Author**: Prasanna P (API Specification Specialist) | **Team 4 — Infosys Springboard Internship 2026**

---

## 📡 1. Overview of AI Gesture Evaluation Microservice APIs

The AI Gesture Recognition microservice provides real-time REST API endpoints for evaluating 21-landmark MediaPipe hand tracking inputs, scoring gesture accuracy, logging attempt history, and returning automated coaching feedback.

---

## 🔌 2. API Endpoint Reference

### Endpoint 1: Evaluate Sign Gesture
- **URL**: `POST /api/ai/evaluate`
- **Content-Type**: `application/json`
- **Description**: Accepts MediaPipe 21 3D hand landmark coordinates $(x, y, z)$, runs the geometric gesture classifier against the target sign, and returns accuracy %, PASS/FAIL correctness, and posture coaching tips.

#### Request Body Schema (`EvaluateRequest`):
```json
{
  "target_sign": "A",
  "landmarks_flat": [
    0.512, 0.684, 0.001,
    0.485, 0.620, -0.015,
    0.450, 0.540, -0.030,
    0.420, 0.480, -0.045,
    0.400, 0.430, -0.060,
    0.540, 0.510, -0.010,
    0.550, 0.450, -0.025,
    0.555, 0.410, -0.035,
    0.560, 0.380, -0.040,
    0.580, 0.515, -0.008,
    0.590, 0.445, -0.022,
    0.595, 0.405, -0.032,
    0.600, 0.375, -0.038,
    0.610, 0.525, -0.005,
    0.620, 0.460, -0.018,
    0.625, 0.420, -0.028,
    0.630, 0.390, -0.034,
    0.640, 0.545, -0.002,
    0.650, 0.490, -0.012,
    0.655, 0.450, -0.020,
    0.660, 0.420, -0.026
  ],
  "session_id": "sess_1092834"
}
```

#### Response Body Schema (`EvaluateResponse`):
```json
{
  "predicted_sign": "A",
  "accuracy_percentage": 94.2,
  "is_correct": true,
  "corrections": [
    "Hand gesture matches target sign 'A' accurately (94.2% confidence).",
    "Wrist angle and 21 landmark finger joint coordinates optimal.",
    "Real-time MediaPipe 3D spatial alignment validated."
  ]
}
```

---

### Endpoint 2: Detailed Debug Gesture Evaluation
- **URL**: `POST /api/ai/evaluate/detailed`
- **Content-Type**: `application/json`
- **Description**: Returns extended evaluation metadata including top confidence probability, model architecture type, and raw landmark metrics for developer debugging.

---

### Endpoint 3: Supported Signs Directory
- **URL**: `GET /api/ai/supported-signs`
- **Response**:
```json
{
  "alphabet": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  "dynamic_words": ["HELLO", "THANK YOU", "YES", "NO", "PLEASE", "SORRY"]
}
```

---

### Endpoint 4: AI Module Health Status
- **URL**: `GET /api/ai/health`
- **Response**:
```json
{
  "status": "ok",
  "module": "ai-evaluate",
  "model_loaded": true,
  "model_type": "MediaPipe 21-Landmark Geometric Classifier",
  "datasets": ["Sign Language MNIST", "ASL Alphabet", "WLASL"]
}
```
