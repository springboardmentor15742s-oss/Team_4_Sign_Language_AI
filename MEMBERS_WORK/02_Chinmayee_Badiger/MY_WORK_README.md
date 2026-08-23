# Chinmayee Badiger — Backend & Dataset Lead
## Infosys Springboard 2026 · Team 4 · SignLearn AI

### My Role
Backend & Dataset Lead — Built the REST API backend routers, ML gesture classifier pipeline, and dataset integration layer.

### What I Built

#### Backend API Routers (FastAPI)
| File | Endpoint(s) | Description |
|---|---|---|
| `routers/ai_evaluate.py` | `POST /api/ai/evaluate` | Receives 21 MediaPipe landmarks, classifies gesture, returns accuracy & tips |
| `routers/courses.py` | `GET/POST /api/courses` | Course listing, enrollment management |
| `routers/progress.py` | `GET/POST /api/progress` | Learner progress tracking per sign |
| `routers/history.py` | `GET/POST /api/history` | Practice session logs, filtering |
| `routers/goals.py` | `GET/POST /api/goals` | Learning goals CRUD |
| `routers/leaderboard.py` | `GET /api/leaderboard` | Weekly & all-time rankings |
| `routers/notifications.py` | `GET /api/notifications` | Streak & achievement alerts |
| `routers/instructor.py` | `GET /api/instructor/*` | Student progress for instructors |

#### ML Pipeline
| File | Description |
|---|---|
| `ml/train_classifier.py` | Trains a RandomForest classifier on 21-landmark hand pose data, saves `.pkl` model |
| `ml/dataset_pipeline.py` | Loads WLASL/ASLLVD dataset frames, extracts MediaPipe landmarks, outputs NumPy arrays |
| `ml/requirements_ml.txt` | ML dependencies: scikit-learn, mediapipe, opencv, numpy |

#### Dataset Library Page
| File | Description |
|---|---|
| `frontend/src/pages/DatasetLibraryPage.jsx` | 12 curated sign language datasets with search, filter, star/save, one-click cite copy |

### Datasets Integrated
1. ASLLVD (Boston Univ.) — 9,794 signs, ground truth
2. WLASL (UCF) — 21,083 videos, 2000 words — **Primary training source**
3. RWTH-PHOENIX — Continuous German SL + gloss
4. OpenASL (Meta AI) — 288 hours, sign2text translation
5. ASL-Citizen (Microsoft) — 83,399 videos, diverse signers
6. How2Sign (CMU) — 35,000 sentences, pose + depth
7. MS-ASL (Microsoft) — 25,513 in-the-wild videos
8. AUTSL — Turkish SL, RGB-D + skeleton
9. NCSLGR — Annotated ASL corpus with facial grammar
10. SignBD (BUET) — Bengali SL
11. CSL-Daily (SJTU) — Chinese SL
12. INCLUDE (IIT Bombay) — Indian SL, 263 signs

### How to Run My Part
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
# API Docs → http://localhost:8000/docs

# ML Training
cd ml
pip install -r requirements_ml.txt
python train_classifier.py
```

### Branch
`chinmayee-week2-milestone2`

---
*Infosys Springboard Internship 2026 | Team 4 | SignLearn AI*

---

## 📁 Milestone 3 — My Deliverables (`Milestone3/`)
| File | What I Built |
|---|---|
| `backend/routers/ai_evaluate.py` | `POST /api/ai/evaluate` — receives 21 MediaPipe landmarks, classifies gesture, returns accuracy + correction tips |
| `backend/routers/dataset.py` | `GET /api/datasets` — lists all 12 research datasets with metadata |
| `backend/schemas/ai_evaluate.py` | Pydantic schemas for landmark input/output validation |
| `ml/train_classifier.py` | Trains RandomForest on hand-pose landmark data, saves `.pkl` model |
| `ml/dataset_pipeline.py` | Loads WLASL/ASLLVD frames, extracts MediaPipe landmarks, builds NumPy arrays |
| `ml/requirements_ml.txt` | ML dependencies (scikit-learn, mediapipe, opencv, numpy) |
| `frontend/src/pages/DatasetLibraryPage.jsx` | 12 datasets UI — search, filter, star/save, cite-copy, links |
| `dataset_guide.md` | Dataset integration documentation |
| `docs/Milestone3_Progress_Report.md` | Official M3 progress report |
| `docs/AI Gesture Recognition API.md` | Gesture API documentation |

## 📁 Milestone 4 — My Deliverables (`Milestone4/`)
| File | What I Built |
|---|---|
| `backend/routers/courses.py` | Course listing, enrollment, lesson management |
| `backend/routers/progress.py` | Sign mastery tracking per user |
| `backend/routers/history.py` | Practice session logging |
| `backend/routers/goals.py` | Learning goals CRUD |
| `backend/routers/leaderboard.py` | Weekly + all-time rankings |
| `backend/routers/notifications.py` | Streak + achievement alerts |
| `backend/routers/instructor.py` | Student analytics endpoints |
| `backend/routers/profile.py` | User profile endpoints |
| `backend/schemas/user_schema.py` | User data schemas |
| `backend/main.py` | FastAPI app with all routers registered |
| `docs/Milestone4_Final_Report.md` | Official M4 final report |
| `docs/API_Reference_Complete.md` | Full API reference documentation |
