# Chinmayee Badiger Work Details

This document explains Chinmayee Badiger's work in detail so it can be read later without opening every source file. It is based on the files under `MEMBERS_WORK/02_Chinmayee_Badiger/` and the matching files that were copied into the final top-level project.

## 1. Role Summary

**Name:** Chinmayee Badiger

**Project role:** Backend and Dataset Lead

**Branch noted in member docs:** `chinmayee-week2-milestone2`

Chinmayee's work focuses on the technical layer behind AI sign evaluation and learning-data support:

- FastAPI backend routers.
- Gesture evaluation endpoint.
- Dataset metadata API.
- Dataset research and integration documentation.
- ML training script for gesture classification.
- Dataset library UI page.
- Milestone reports and API reference material.
- A personal portfolio app presenting her project work.

## 2. Where Her Work Lives

```text
MEMBERS_WORK/02_Chinmayee_Badiger/
+-- MY_WORK_README.md
+-- AI Gesture Recognition API.md
+-- backend/
+-- dataset_docs/
+-- frontend/
+-- ml/
+-- Milestone3/
+-- Milestone4/
+-- portfolio/
```

Many of Chinmayee's files are also copied into the main app:

| Chinmayee source | Final project location | Status |
|---|---|---|
| `backend/routers/ai_evaluate.py` | `backend/routers/ai_evaluate.py` | Same as final app. |
| `backend/routers/courses.py` | `backend/routers/courses.py` | Same as final app. |
| `backend/routers/progress.py` | `backend/routers/progress.py` | Same as final app. |
| `backend/routers/history.py` | `backend/routers/history.py` | Same as final app. |
| `backend/routers/goals.py` | `backend/routers/goals.py` | Same as final app. |
| `backend/routers/leaderboard.py` | `backend/routers/leaderboard.py` | Same as final app. |
| `backend/routers/notifications.py` | `backend/routers/notifications.py` | Same as final app. |
| `backend/routers/instructor.py` | `backend/routers/instructor.py` | Same as final app. |
| `frontend/src/pages/DatasetLibraryPage.jsx` | `frontend/src/pages/DatasetLibraryPage.jsx` | Same as final app. |
| `ml/dataset_pipeline.py` | `ml/dataset_pipeline.py` | Same as final app. |
| `ml/train_classifier.py` | `ml/train_classifier.py` | Different: Chinmayee's archived version is more detailed. |

## 3. Main Contribution Areas

### Backend Routers

Chinmayee's backend work is organized as individual FastAPI routers. Each router handles one product area and returns structured JSON responses.

### AI evaluation router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/ai_evaluate.py
```

Final app copy:

```text
backend/routers/ai_evaluate.py
```

Purpose:

This router evaluates hand landmark data from MediaPipe and returns a predicted sign, accuracy percentage, correctness flag, and correction tips.

Important endpoints:

| Method | Endpoint in active backend | Purpose |
|---|---|---|
| `POST` | `/api/ai/evaluate` | Evaluates hand landmarks against the target sign. |
| `POST` | `/api/ai/evaluate/detailed` | Returns the same evaluation plus debug metadata. |
| `GET` | `/api/ai/supported-signs` | Lists supported alphabet and dynamic word signs. |
| `GET` | `/api/ai/health` | Returns AI module health and dataset availability. |

How the classifier works:

1. It receives either:
   - `landmarks_flat`: 63 floats, or
   - `landmarks`: 21 structured points with `x`, `y`, and `z`.
2. It converts landmarks into 21 3D points.
3. It calculates distances between:
   - wrist and fingertips,
   - wrist and knuckles,
   - thumb tip and index tip,
   - thumb tip and index knuckle.
4. It decides whether the index, middle, ring, and pinky fingers are extended.
5. It uses ordered gesture rules to predict signs.
6. It compares the predicted sign to the target sign.
7. It returns correction guidance.

Examples of rule logic:

- `F`: index-thumb pinch plus middle/ring/pinky extended.
- `B`: four fingers extended and thumb tucked.
- `HELLO`: four fingers extended and thumb spread.
- `D`: only index finger extended.
- `A`: all four main fingers curled.
- fallback: predicts `C` or `HELLO` depending on extension count.

Why this matters:

This file gives the backend a real AI-style API contract even before a full trained neural model is plugged in. It lets the frontend send landmark data and receive coaching-style feedback.

### Progress router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/progress.py
```

Final app copy:

```text
backend/routers/progress.py
```

Purpose:

Tracks learner progress using deterministic mock data generated from the learner ID.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/progress/{learner_id}` | Returns mastery percentages for A-Z plus `HELLO` and `THANK_YOU`. |
| `GET` | `/api/progress/{learner_id}/streak` | Returns current streak, longest streak, sessions, and practice time. |
| `GET` | `/api/progress/{learner_id}/weekly` | Returns 7-day activity chart data. |
| `GET` | `/api/progress/{learner_id}/summary` | Returns total sessions, accuracy, level, XP, and best/worst signs. |
| `POST` | `/api/progress/log` | Creates a response for a completed practice session. |

Implementation detail:

The router uses `hashlib.md5` on the learner ID to seed repeatable random data. This means the same learner ID will usually get consistent-looking demo progress.

### Courses router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/courses.py
```

Final app copy:

```text
backend/routers/courses.py
```

Purpose:

Provides the backend course catalog and lesson data.

Main dataset inside the file:

- 6 courses.
- 41 total lessons.
- course IDs like `c001`, `c002`, etc.
- lesson IDs like `l001`, `l002`, etc.
- YouTube embed URLs for lesson videos.
- levels: Beginner, Intermediate, Advanced.
- categories: Alphabet, Phrases, Core Vocabulary, Conversation, Specialized, Professional.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/courses` | Lists all available courses without full lessons. |
| `GET` | `/api/courses/enrolled/{learner_id}` | Returns demo enrolled course IDs. |
| `GET` | `/api/courses/{course_id}` | Returns a single course with lessons. |
| `GET` | `/api/courses/{course_id}/lessons` | Returns lessons only. |
| `POST` | `/api/courses/{course_id}/enroll` | Returns an enrollment success response. |

Why this matters:

This gives the learning platform its structured course content layer, connecting the idea of sign practice to a curriculum.

### History router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/history.py
```

Final app copy:

```text
backend/routers/history.py
```

Purpose:

Generates practice history and statistics.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/history/{learner_id}` | Returns paginated practice history. |
| `GET` | `/api/history/{learner_id}/stats` | Returns total sessions, average accuracy, best/worst sign, practice time, pass rate. |
| `GET` | `/api/history/{learner_id}/export` | Returns CSV text for exporting session history. |

Implementation detail:

This router uses generated demo sessions rather than a database. It creates signs, scores, timestamps, pass/fail flags, and durations.

### Goals router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/goals.py
```

Final app copy:

```text
backend/routers/goals.py
```

Purpose:

Supports learning goal listing and basic goal operations.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/goals/{learner_id}` | Returns mock goals and completion counts. |
| `POST` | `/api/goals` | Creates a generated goal response. |
| `PATCH` | `/api/goals/{goal_id}/complete` | Marks a goal as complete. |
| `DELETE` | `/api/goals/{goal_id}` | Deletes a goal response. |

Example goals:

- Master all ASL alphabet letters A-Z.
- Practice for 7 consecutive days.
- Achieve 90%+ accuracy on Sign B.
- Complete the Common Phrases course.

### Leaderboard router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/leaderboard.py
```

Final app copy:

```text
backend/routers/leaderboard.py
```

Purpose:

Provides weekly and all-time leaderboard rankings.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/leaderboard/weekly` | Returns weekly top 10 demo rankings. |
| `GET` | `/api/leaderboard/all-time` | Returns sorted all-time rankings. |
| `GET` | `/api/leaderboard/rank/{learner_id}` | Returns a specific learner rank. |

Ranking data includes:

- rank
- learner ID
- name
- avatar initials
- mastered signs
- average accuracy
- streak days
- score
- badge labels

### Notifications router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/notifications.py
```

Final app copy:

```text
backend/routers/notifications.py
```

Purpose:

Returns achievement, streak, reminder, feedback, and course notifications.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/notifications/{learner_id}` | Returns notification list and unread count. |
| `POST` | `/api/notifications/mark-read` | Marks notification IDs as read. |
| `GET` | `/api/notifications/{learner_id}/count` | Returns unread count. |

### Instructor router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/instructor.py
```

Final app copy:

```text
backend/routers/instructor.py
```

Purpose:

Supports instructor-facing monitoring and analytics.

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/instructor/learners` | Lists learners, optionally filtered by level. |
| `GET` | `/api/instructor/learner/{learner_id}/history` | Returns recent sessions for a learner. |
| `GET` | `/api/instructor/stats` | Returns platform stats. |
| `POST` | `/api/instructor/course` | Creates a new course response. |

This connects Chinmayee's backend work to the instructor dashboard feature.

### Dataset router

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/Milestone3/backend/routers/dataset.py
```

Final app copy:

```text
backend/routers/dataset.py
```

Purpose:

Exposes dataset metadata through FastAPI.

Endpoints:

| Method | Endpoint if mounted with `/api` | Purpose |
|---|---|---|
| `GET` | `/api/datasets/` | Lists integrated dataset metadata. |
| `GET` | `/api/datasets/{dataset_key}` | Returns one dataset's details. |

Datasets in this backend router:

- Sign Language MNIST
- ASL Alphabet Dataset
- WLASL 100 subset
- RWTH-PHOENIX-Weather 2014

Important caveat:

This router exists in the project, but the current top-level `backend/main.py` does not include `dataset` in its mounted router list.

## 4. ML Work

Chinmayee's ML work lives in:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/ml/
```

and partially in:

```text
ml/
```

### Archived Chinmayee training script

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/ml/train_classifier.py
```

Purpose:

Trains a RandomForest classifier using synthetic MediaPipe-style landmark data.

What it does:

1. Defines supported signs:
   - `A`, `B`, `C`, `D`, `E`, `F`
   - `HELLO`, `THANK_YOU`, `YES`, `NO`, `PLEASE`
   - `I`, `L`, `O`, `W`, `Y`
2. Generates synthetic hand landmarks for each sign.
3. Adds engineered features such as:
   - fingertip-to-wrist distances,
   - knuckle-to-wrist distances,
   - fingertip/knuckle ratios,
   - distances between important finger points.
4. Splits data into train/test sets.
5. Trains a scikit-learn pipeline:
   - `StandardScaler`
   - `RandomForestClassifier`
6. Saves:
   - `sign_classifier.pkl`
   - `label_encoder.pkl`
   - `model_metadata.json`

Why this is important:

This creates the bridge between MediaPipe landmarks and a trainable sign classifier. Even though the data is synthetic in the current file, the structure is model-ready.

### Final top-level training script

File:

```text
ml/train_classifier.py
```

Purpose:

Also trains a RandomForest classifier on synthetic 63-feature landmark samples, but it is simpler than Chinmayee's archived version.

Differences from Chinmayee's archived script:

- Top-level version supports a larger sign list, including A-Z and several words.
- It uses random synthetic landmarks rather than detailed sign-specific landmark generation.
- It saves one model bundle to `ml/model/sign_classifier.pkl`.
- It does not save separate label encoder and metadata JSON files.

### Dataset pipeline

Files:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/ml/dataset_pipeline.py
ml/dataset_pipeline.py
```

Purpose:

Defines dataset metadata and preprocessing helpers for sign language datasets.

Datasets listed:

- Sign Language MNIST
- ASL Alphabet Dataset
- WLASL 100 subset
- RWTH-PHOENIX-Weather 2014

Available class:

```text
SignLanguageDatasetPipeline
```

Methods:

| Method | Purpose |
|---|---|
| `__init__(data_dir="datasets")` | Creates/uses a dataset directory. |
| `get_dataset_metadata(dataset_key)` | Returns metadata for one dataset. |
| `preprocess_mnist_sample(raw_pixels)` | Converts a 784-pixel MNIST CSV row into normalized `(28, 28, 1)` NumPy data. |
| `generate_dataset_summary_report` | Intended to return a summary of all datasets. |

Important caveat:

The `generate_dataset_summary_report` method currently has a syntax error:

```python
def generate_dataset_summary_report(() -> Dict:
```

It should be corrected before the pipeline script can run.

## 5. Dataset Documentation

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/dataset_docs/dataset_guide.md
```

Purpose:

Explains core datasets used by the project:

### Sign Language MNIST

- Format: 28x28 grayscale pixel CSV.
- 784 features per row.
- 24 classes.
- Excludes J and Z because those involve motion.
- Useful for fast baseline static sign classification.

### ASL Alphabet

- Format: 200x200 RGB images.
- 29 classes.
- Covers A-Z plus space, delete, and nothing.
- Useful for high-resolution CNN feature extraction.

### WLASL

- Format: MP4 video clips and JSON metadata.
- 100-word subset mentioned in the guide.
- Useful for dynamic video sequence recognition.

This documentation supports the AI/ML planning part of the project.

## 6. Dataset Library Frontend Page

File:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/frontend/src/pages/DatasetLibraryPage.jsx
```

Final app copy:

```text
frontend/src/pages/DatasetLibraryPage.jsx
```

Purpose:

Creates a polished dataset catalog page for research sources.

Features:

- searchable dataset cards
- format filters
- saved/starred dataset state
- dataset stats banner
- direct dataset links
- citation copy button
- color-coded dataset cards
- metadata display for samples, format, size, organization, year, tags, and citation

Datasets shown:

1. ASLLVD
2. WLASL
3. RWTH-PHOENIX
4. OpenASL
5. ASL-Citizen
6. How2Sign
7. MS-ASL
8. AUTSL
9. NCSLGR
10. SignBD
11. CSL-Daily
12. INCLUDE

Why this matters:

This page makes the research foundation visible inside the product. Instead of only saying "we used datasets," it gives users and evaluators a clear list of real public datasets and why they matter.

## 7. Milestone 3 Work

Folder:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/Milestone3/
```

Main deliverables:

| File/Area | What it contributes |
|---|---|
| `backend/routers/ai_evaluate.py` | Gesture evaluation API. |
| `backend/routers/dataset.py` | Dataset metadata API. |
| `backend/schemas/ai_evaluate.py` | Request/response validation for gesture evaluation. |
| `ml/train_classifier.py` | Training script for landmark classifier. |
| `ml/dataset_pipeline.py` | Dataset metadata and preprocessing helper. |
| `ml/requirements_ml.txt` | Python dependencies for ML work. |
| `frontend/src/pages/DatasetLibraryPage.jsx` | Dataset catalog UI. |
| `dataset_guide.md` | Dataset integration guide. |
| `docs/Milestone3_Progress_Report.md` | Milestone 3 report. |
| `docs/AI Gesture Recognition API.md` | API documentation for gesture recognition. |

Milestone 3 focus:

- AI evaluation API.
- Dataset metadata.
- Progress tracking.
- Course and lesson API foundations.
- Instructor dashboard backend support.
- Dataset library UI.
- Learning goals backend support.

## 8. Milestone 4 Work

Folder:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/Milestone4/
```

Main deliverables:

| File/Area | What it contributes |
|---|---|
| `backend/main.py` | FastAPI app with router registration. |
| `backend/routers/courses.py` | Course listing, enrollment, lesson management. |
| `backend/routers/progress.py` | Sign mastery and progress tracking. |
| `backend/routers/history.py` | Practice history and export. |
| `backend/routers/goals.py` | Learning goals CRUD-style endpoints. |
| `backend/routers/leaderboard.py` | Weekly and all-time rankings. |
| `backend/routers/notifications.py` | Streak and achievement alerts. |
| `backend/routers/instructor.py` | Student analytics endpoints. |
| `backend/routers/profile.py` | User profile endpoint source. |
| `backend/schemas/user_schema.py` | User and profile schemas. |
| `docs/Milestone4_Final_Report.md` | Final report material. |
| `docs/API_Reference_Complete.md` | Full API reference material. |

Milestone 4 focus:

- Completing backend feature coverage.
- Providing APIs for the whole learning platform.
- Supporting leaderboard, history, goals, notifications, instructor analytics, and courses.
- Documenting the final API surface.

## 9. Personal Portfolio Work

Folder:

```text
MEMBERS_WORK/02_Chinmayee_Badiger/portfolio/
```

Purpose:

This is a separate React + Vite portfolio site for Chinmayee. It presents her work professionally.

Main files:

| File | Purpose |
|---|---|
| `portfolio/src/main.jsx` | Portfolio React app. |
| `portfolio/src/styles.css` | Portfolio styling. |
| `portfolio/package.json` | Portfolio dependencies and scripts. |
| `portfolio/index.html` | Vite HTML entry. |
| `portfolio/SKILL.md` | Build/design guidance for the portfolio. |

Portfolio sections:

- site header with navigation
- hero section
- work/project cards
- skills section
- milestone timeline
- contact link

Projects shown in the portfolio:

- Sign Language Learning Platform
- Gesture Recognition API
- Dataset Pipeline

This portfolio is not part of the main SignLearn AI app. It is a presentation artifact for Chinmayee's personal contribution.

## 10. How Chinmayee's Work Fits Into the Whole Project

Chinmayee's work forms the backend/data spine of the app:

1. The **frontend practice studio** needs an AI evaluation API. Chinmayee provided `ai_evaluate.py`.
2. The **dashboard** needs progress data. Chinmayee provided `progress.py`.
3. The **courses page** needs course and lesson data. Chinmayee provided `courses.py`.
4. The **history page** needs practice logs and export. Chinmayee provided `history.py`.
5. The **profile/dashboard goals sections** need goals data. Chinmayee provided `goals.py`.
6. The **leaderboard page** needs rankings. Chinmayee provided `leaderboard.py`.
7. The **notification UI** needs notification data. Chinmayee provided `notifications.py`.
8. The **instructor dashboard** needs student analytics. Chinmayee provided `instructor.py`.
9. The **AI research story** needs dataset sources and training scripts. Chinmayee provided the dataset guide, dataset library page, dataset pipeline, and training scripts.

In simple terms: Chinmayee's work turns the project from only a UI concept into an API-backed learning platform prototype.

## 11. Current Strengths

Chinmayee's work is strong in these areas:

- Clear separation of backend features into routers.
- Easy-to-read API endpoints.
- Useful demo data for frontend integration.
- AI evaluation endpoint with meaningful correction feedback.
- Dataset research that supports the project academically.
- ML script that shows how landmark classification would be trained.
- Dataset library page that makes the research visible to users/evaluators.
- Milestone organization that shows progress over time.

## 12. Current Limitations and Caveats

These are not criticisms of the work; they are useful notes for anyone continuing the project.

### Mock data instead of database persistence

Most routers return hardcoded or generated demo data. For production, these should connect to the PostgreSQL schema.

### Dataset router not mounted

`backend/routers/dataset.py` exists, but top-level `backend/main.py` does not currently include it. To expose it, the app would need to include the router.

### Profile/auth routers not fully wired in the active backend

Chinmayee's Milestone 4 folder includes profile-related files, and the top-level project has auth/profile routers, but `backend/main.py` currently mounts only the selected feature routers.

### Dataset pipeline syntax error

The dataset pipeline has a typo in `generate_dataset_summary_report`. It must be fixed before running that script.

### Training data is synthetic

The RandomForest training script uses synthetic landmarks. This is useful for demonstrating structure, but a real model should train on extracted landmarks from real datasets such as WLASL, ASLLVD, ASL-Citizen, or ASL Alphabet.

### Backend evaluator is rule-based

The active backend evaluator uses geometric rules, not the saved RandomForest model. A next step would be loading `sign_classifier.pkl` inside the backend and using it for predictions.

## 13. How to Run Chinmayee's Parts

### Backend feature APIs

From the top-level project:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API docs:

```text
http://localhost:8000/docs
```

Mounted Chinmayee-related active endpoints include:

- `/api/ai/evaluate`
- `/api/progress/{learner_id}`
- `/api/courses`
- `/api/history/{learner_id}`
- `/api/goals/{learner_id}`
- `/api/leaderboard/weekly`
- `/api/notifications/{learner_id}`
- `/api/instructor/learners`

### ML training

Top-level simplified script:

```bash
cd ml
pip install -r requirements_ml.txt
python train_classifier.py
```

Chinmayee archived script:

```bash
cd MEMBERS_WORK/02_Chinmayee_Badiger/ml
pip install -r requirements_ml.txt
python train_classifier.py
```

### Dataset library page

Run the main frontend:

```bash
cd frontend
npm install
npm run dev
```

Then open the app and navigate to the Dataset Library page if it is exposed in the current navigation flow.

### Portfolio

```bash
cd MEMBERS_WORK/02_Chinmayee_Badiger/portfolio
npm install
npm run dev
```

## 14. Best Reading Path for Chinmayee's Work

1. `MEMBERS_WORK/02_Chinmayee_Badiger/MY_WORK_README.md`
2. `CHINMAYEE_WORK_DETAILS.md`
3. `MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/ai_evaluate.py`
4. `MEMBERS_WORK/02_Chinmayee_Badiger/ml/train_classifier.py`
5. `MEMBERS_WORK/02_Chinmayee_Badiger/frontend/src/pages/DatasetLibraryPage.jsx`
6. `MEMBERS_WORK/02_Chinmayee_Badiger/dataset_docs/dataset_guide.md`
7. `MEMBERS_WORK/02_Chinmayee_Badiger/Milestone3/docs/Milestone3_Progress_Report.md`
8. `MEMBERS_WORK/02_Chinmayee_Badiger/portfolio/src/main.jsx`

## 15. One-Paragraph Summary

Chinmayee Badiger's contribution centers on backend and dataset intelligence for SignLearn AI. She built or supplied the routers that power AI gesture evaluation, course data, learner progress, practice history, goals, leaderboard rankings, notifications, and instructor analytics. She also contributed dataset documentation, a dataset library UI, and ML scripts showing how MediaPipe landmark data can be converted into a trainable sign classifier. Her work is the main connection between the sign-language learning interface and the API/AI/data layer underneath it.
