# SignLearn AI Project Explanation

This document explains the complete project in this repository. It is written as a readable guide for someone who wants to understand what the project is, how the folders are organized, what each major feature does, and how each team member's work fits into the final platform.

## 1. Project Summary

**Project name:** SignLearn AI / Sign Language Learning & Assessment Platform

**Team:** Team 4, Infosys Springboard Internship 2026

**Purpose:** The platform helps learners practice sign language through a web app that combines lessons, a camera-based AI practice studio, quizzes, progress tracking, leaderboard rankings, instructor monitoring, and dataset documentation.

The project is built as a full-stack demo:

- **Frontend:** React + Vite web application.
- **Backend:** FastAPI service with separate routers for AI evaluation, courses, progress, goals, history, leaderboard, instructor analytics, and notifications.
- **AI/ML:** MediaPipe-style 21-landmark gesture evaluation plus RandomForest training scripts.
- **Database:** PostgreSQL schema and SQLAlchemy models for future persistent storage.
- **Documentation:** API references, dataset references, milestone reports, workflows, wireframes, deployment notes, and member-specific deliverables.

The app currently uses a mix of working UI logic, mock/demo backend data, heuristic gesture recognition, and planned production architecture documentation.

## 2. Repository Structure

```text
.
+-- README.md
+-- PROJECT_EXPLANATION.md
+-- CHINMAYEE_WORK_DETAILS.md
+-- frontend/
+-- backend/
+-- ml/
+-- docs/
+-- MEMBERS_WORK/
+-- team_master/
+-- AI Gesture Recognition API.md
+-- Sign_Language_Learning_Workflows.md
```

### Top-level application folders

| Folder | Purpose |
|---|---|
| `frontend/` | Main React + Vite application that users interact with in the browser. |
| `backend/` | Main FastAPI backend with router modules and schemas. |
| `ml/` | Model training and dataset preprocessing scripts. |
| `docs/` | Final project documentation, reports, architecture, dataset reference, and deployment guide. |
| `MEMBERS_WORK/` | Separate archived folders for each team member's contribution. |
| `team_master/` | Consolidated duplicate/master copy of the team deliverables. |

### Important root documents

| File | Purpose |
|---|---|
| `README.md` | Project overview, team list, tech stack, datasets, milestones, and setup intent. |
| `AI Gesture Recognition API.md` | Detailed gesture recognition API documentation. |
| `Sign_Language_Learning_Workflows.md` | Workflow documentation for learning and practice flows. |
| `docs/System_Architecture.md` | Planned architecture for frontend, backend, AI, data, and deployment layers. |
| `docs/API_Reference_Complete.md` | API endpoint reference for the platform. |
| `docs/Dataset_Reference.md` | Research dataset catalog and explanation. |
| `docs/Deployment_Guide.md` | Deployment instructions. |
| `docs/Milestone3_Progress_Report.md` | Milestone 3 report. |
| `docs/Milestone4_Final_Report.md` | Milestone 4 final report. |

## 3. Main Product Features

### Authentication and roles

The platform supports the following roles:

- `LEARNER`
- `INSTRUCTOR`
- `TRAINER`
- `ADMIN`

In the frontend, role handling is stored in `frontend/src/context/AuthContext.jsx`. It defines the available roles, their labels, descriptions, and permissions. The demo login/register flow uses in-memory state rather than a real database-backed session.

Backend authentication code exists in:

- `backend/auth/jwt_handler.py`
- `backend/routers/auth_router.py`
- `backend/routers/auth.py`
- `backend/schemas/user_schema.py`

The JWT helper creates and verifies HMAC-SHA256 signed tokens and hashes passwords with a SHA-256 salt. This is useful for the demo, but a production system should use a standard password hashing library such as bcrypt or Argon2.

Important caveat: the current top-level `backend/main.py` does not include the auth routers in its router list. The auth files are present, but the active FastAPI app only includes selected routers listed later in this document.

### Learner dashboard

Implemented in `frontend/src/pages/DashboardPage.jsx`.

The dashboard gives the learner a quick view of:

- current streak
- signs mastered
- average accuracy
- total sessions or practice activity
- weekly activity chart
- sign mastery rows/grid
- recommended review items
- buttons to start practice, start quiz, or view history

This page is mostly frontend/demo-driven and uses local static data.

### AI practice studio

Implemented in `frontend/src/pages/PracticeSessionPage.jsx`.

This is the central feature of the project. It is designed as a camera-based sign practice area using MediaPipe hand landmarks. It includes:

- camera practice flow
- one-hand and two-hand recognition logic
- sign categories
- static and dynamic gesture handling
- landmark normalization
- confidence-style feedback
- lighting checks
- session state
- sign tips and descriptions

The frontend classifier includes rules for many ASL letters and common signs. Dynamic signs such as `J`, `Z`, `PLEASE`, `WAVE`, `YES`, `NO`, and `COME` are handled by looking at motion/history patterns.

The backend also has an AI evaluation router in `backend/routers/ai_evaluate.py`. That route accepts 21 MediaPipe landmarks or 63 flattened landmark values and returns:

- predicted sign
- accuracy percentage
- whether the result matches the target sign
- correction tips

### Assessment quiz

Implemented in `frontend/src/pages/AssessmentQuizPage.jsx`.

This is a timed multiple-choice quiz experience. It includes:

- sign language questions
- four answer choices
- countdown timer
- scoring and grade display
- result/review flow
- confetti dependency for celebration effects

The quiz is frontend-driven and does not currently persist quiz scores through the active backend.

### Courses and lessons

Implemented in:

- `frontend/src/pages/CoursesPage.jsx`
- `backend/routers/courses.py`

The course system includes 6 courses and 41 lessons:

| Course | Level | Lesson Count |
|---|---:|---:|
| ASL Alphabet Basics | Beginner | 8 |
| Common Everyday Phrases | Beginner | 6 |
| Numbers, Colors & Time | Beginner | 7 |
| Intermediate Conversations | Intermediate | 7 |
| Medical & Emergency Signs | Intermediate | 6 |
| Professional & Workplace Signs | Advanced | 7 |

Backend course endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/courses` | Lists course summaries without lesson arrays. |
| `GET` | `/api/courses/enrolled/{learner_id}` | Returns deterministic demo enrollments for a learner. |
| `GET` | `/api/courses/{course_id}` | Returns a single course with its lessons. |
| `GET` | `/api/courses/{course_id}/lessons` | Returns only the lessons for a course. |
| `POST` | `/api/courses/{course_id}/enroll` | Enrolls a learner in a course and returns a success message. |

The frontend course page includes lesson lists and a YouTube video modal.

### Progress tracking

Implemented in:

- `frontend/src/pages/DashboardPage.jsx`
- `backend/routers/progress.py`

The backend progress router generates deterministic mock values based on the learner ID. It tracks:

- mastery percentage per sign
- mastered count
- in-progress count
- streak details
- weekly sessions
- summary stats
- practice session logging response

Backend progress endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/progress/{learner_id}` | Returns sign mastery percentages. |
| `GET` | `/api/progress/{learner_id}/streak` | Returns current streak, longest streak, total sessions, and practice minutes. |
| `GET` | `/api/progress/{learner_id}/weekly` | Returns 7-day session counts. |
| `GET` | `/api/progress/{learner_id}/summary` | Returns aggregate stats such as accuracy and XP. |
| `POST` | `/api/progress/log` | Returns a generated practice ID for a logged session. |

### Practice history

Implemented in:

- `frontend/src/pages/PracticeHistoryPage.jsx`
- `backend/routers/history.py`

The frontend shows a history table with filters and CSV export behavior. The backend returns generated session history for a learner.

Backend history endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/history/{learner_id}` | Returns paginated practice sessions. |
| `GET` | `/api/history/{learner_id}/stats` | Returns aggregate practice statistics. |
| `GET` | `/api/history/{learner_id}/export` | Returns CSV text and filename metadata. |

### Learning goals

Implemented in:

- `frontend/src/pages/ProfilePage.jsx`
- `backend/routers/goals.py`

The backend stores mock goals and supports create, complete, and delete style operations.

Backend goal endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/goals/{learner_id}` | Lists goals for a learner. |
| `POST` | `/api/goals` | Creates a new learning goal. |
| `PATCH` | `/api/goals/{goal_id}/complete` | Marks a goal as complete. |
| `DELETE` | `/api/goals/{goal_id}` | Returns a deletion success message. |

### Leaderboard

Implemented in:

- `frontend/src/pages/LeaderboardPage.jsx`
- `backend/routers/leaderboard.py`

The leaderboard has weekly and all-time rankings based on demo data.

Backend leaderboard endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/leaderboard/weekly` | Returns top weekly entries. |
| `GET` | `/api/leaderboard/all-time` | Returns sorted all-time entries. |
| `GET` | `/api/leaderboard/rank/{learner_id}` | Returns the rank for a learner. |

### Instructor dashboard

Implemented in:

- `frontend/src/pages/InstructorDashboardPage.jsx`
- `backend/routers/instructor.py`

This view helps instructors monitor students. It includes:

- platform stats
- learner list
- learner accuracy
- streaks
- mastered signs
- student history
- course creation endpoint

Backend instructor endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/instructor/learners` | Lists learners, optionally filtered by level. |
| `GET` | `/api/instructor/learner/{learner_id}/history` | Returns a learner's recent sessions. |
| `GET` | `/api/instructor/stats` | Returns platform-wide stats. |
| `POST` | `/api/instructor/course` | Creates a course response. |

### Notifications

Implemented in:

- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/NotificationToast.jsx`
- `backend/routers/notifications.py`

The app has two notification concepts:

- frontend toast messages for login, logout, profile changes, etc.
- backend notification records for streaks, achievements, reminders, feedback, and course updates

Backend notification endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/notifications/{learner_id}` | Returns notification list and unread count. |
| `POST` | `/api/notifications/mark-read` | Marks notification IDs as read. |
| `GET` | `/api/notifications/{learner_id}/count` | Returns unread count. |

### Dataset library

Implemented in:

- `frontend/src/pages/DatasetLibraryPage.jsx`
- `backend/routers/dataset.py`
- `docs/Dataset_Reference.md`
- `ml/dataset_pipeline.py`

The dataset work supports research and AI planning. The frontend dataset library lists 12 public sign language datasets with metadata, links, tags, and citation copy behavior:

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

The backend dataset router lists 4 integrated dataset metadata entries:

1. Sign Language MNIST
2. ASL Alphabet
3. WLASL 100 subset
4. RWTH-PHOENIX

Important caveat: `backend/routers/dataset.py` exists, but the current top-level `backend/main.py` does not include it in the active router list.

## 4. Frontend Architecture

### Main files

| File | Purpose |
|---|---|
| `frontend/src/main.jsx` | React entry point. |
| `frontend/src/App.jsx` | Main app shell, tab routing, auth guard. |
| `frontend/src/context/AuthContext.jsx` | Demo auth state, roles, profile defaults, permissions, toast state. |
| `frontend/src/components/Navbar.jsx` | Sticky navigation bar, mobile menu, role/user menu, notification dropdown. |
| `frontend/src/components/NotificationToast.jsx` | Toast notifications. |
| `frontend/src/components/RoleBadge.jsx` | Role badge display. |
| `frontend/src/components/RBACNotice.jsx` | Permission/role notice component. |
| `frontend/src/index.css` | Shared CSS and animation support. |
| `frontend/src/animations.css` | Additional animation classes. |

### Frontend pages

| Page file | Role in the app |
|---|---|
| `AuthPage.jsx` | Login/register screen with role selection and form fields. |
| `DashboardPage.jsx` | Learner dashboard and progress summary. |
| `PracticeSessionPage.jsx` | Camera-based AI gesture practice studio. |
| `AssessmentQuizPage.jsx` | Timed sign-language quiz. |
| `CoursesPage.jsx` | Course catalog, lesson lists, and video modal. |
| `LeaderboardPage.jsx` | Weekly/all-time rankings. |
| `PracticeHistoryPage.jsx` | Practice log, filters, and CSV export. |
| `ProfilePage.jsx` | Profile, goals, stats, and achievements. |
| `InstructorDashboardPage.jsx` | Instructor analytics and student monitoring. |
| `DatasetLibraryPage.jsx` | Research dataset catalog. |

### Frontend dependencies

From `frontend/package.json`:

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `lucide-react`
- `canvas-confetti`
- `oxlint`

The frontend uses tab-based routing inside React state instead of `react-router-dom`.

## 5. Backend Architecture

### Active FastAPI app

The top-level backend entry point is `backend/main.py`.

It creates a FastAPI app named **SignLearn AI - Platform API** and includes these routers with the `/api` prefix:

- `ai_evaluate`
- `progress`
- `courses`
- `instructor`
- `goals`
- `leaderboard`
- `history`
- `notifications`

Active root endpoint:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Returns backend status, service name, version, docs path, and milestone labels. |

### Backend folders

| Folder | Purpose |
|---|---|
| `backend/routers/` | FastAPI route modules. |
| `backend/schemas/` | Pydantic request/response models. |
| `backend/auth/` | JWT and password helper code. |
| `backend/db/` | SQLAlchemy models and basic SQL schema. |

### Active router summary

| Router file | Active prefix | Main responsibility |
|---|---|---|
| `ai_evaluate.py` | `/api/ai` | Gesture landmark evaluation and AI health. |
| `progress.py` | `/api/progress` | Mastery, streak, weekly stats, summary, log response. |
| `courses.py` | `/api/courses` | Courses, lessons, enrollments. |
| `instructor.py` | `/api/instructor` | Learners, learner history, platform stats, course creation. |
| `goals.py` | `/api/goals` | Learning goals CRUD-style responses. |
| `leaderboard.py` | `/api/leaderboard` | Weekly/all-time leaderboard and learner rank. |
| `history.py` | `/api/history` | Practice history, stats, CSV export. |
| `notifications.py` | `/api/notifications` | Notification list, count, mark-read. |

### Present but not mounted in top-level `main.py`

| File | Notes |
|---|---|
| `backend/routers/auth.py` | Mock register/login router with `/auth` prefix. Would become `/api/auth` if included with prefix `/api`. |
| `backend/routers/auth_router.py` | More complete JWT auth router already prefixed as `/api/auth`. Should be included carefully to avoid double `/api/api/auth` if using `include_router(..., prefix="/api")`. |
| `backend/routers/dataset.py` | Dataset metadata router with `/datasets` prefix. |
| `backend/routers/profile.py` | Learner profile router with `/profile` prefix. |

## 6. AI and ML Layer

### Gesture evaluation router

File: `backend/routers/ai_evaluate.py`

This backend classifier is a rule-based geometric evaluator using 21 MediaPipe hand landmarks. It:

- accepts either `landmarks_flat` with 63 values or structured `landmarks` with x/y/z points
- calculates distances from wrist to fingertips and knuckles
- detects whether fingers are extended or curled
- distinguishes simple signs such as `A`, `B`, `D`, `F`, `C`, and `HELLO`
- compares prediction to the target sign
- returns correction tips

Endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/ai/evaluate` | Main gesture evaluation. |
| `POST` | `/api/ai/evaluate/detailed` | Adds confidence, model type, sign names, and session ID. |
| `GET` | `/api/ai/supported-signs` | Returns alphabet signs and common dynamic words. |
| `GET` | `/api/ai/health` | Returns AI module status and dataset names. |

### Frontend gesture classifier

File: `frontend/src/pages/PracticeSessionPage.jsx`

This is more ambitious than the backend evaluator. It includes:

- landmark normalization
- one-hand classification rules
- two-hand classification rules
- dynamic motion detection
- lighting checks
- extensive sign descriptions and practice tips
- camera-based interaction flow

### Training scripts

Files:

- `ml/train_classifier.py`
- `ml/dataset_pipeline.py`
- `ml/requirements_ml.txt`

`ml/train_classifier.py` trains a RandomForest model on synthetic landmark arrays. Each sample has 63 values, representing 21 landmarks times x/y/z coordinates. It saves a model bundle to `ml/model/sign_classifier.pkl`.

`ml/dataset_pipeline.py` defines dataset metadata and a small preprocessing function for Sign Language MNIST samples. It is intended as a dataset integration helper.

Important caveat: `ml/dataset_pipeline.py` currently has a syntax error in `generate_dataset_summary_report`, written as `def generate_dataset_summary_report(() -> Dict:`. That method would need to be corrected before the script can run.

## 7. Database Layer

Database work appears in:

- `backend/db/schema.sql`
- `backend/db/models.py`
- `team_master/database/`
- `MEMBERS_WORK/03_Pragathi/`
- `docs/System_Architecture.md`

The simplified active backend DB model defines:

- `User`
- `PracticeSession`
- `SignMastery`

The broader project database design includes a larger normalized PostgreSQL schema with tables such as:

- `users`
- `learner_profiles`
- `courses`
- `lessons`
- `enrollments`
- `practice_sessions`
- `sign_mastery`
- `learning_goals`
- `leaderboard_entries`
- `notifications`
- `AI_Practice_Feedback`
- `Quiz_Scores`

At the current demo stage, most backend routes return in-memory/mock data rather than reading from PostgreSQL.

## 8. Documentation Layer

The documentation is extensive and covers:

- product overview
- API specs
- architecture
- dataset research
- workflows
- database schema
- wireframes
- deployment
- milestone reports
- member deliverables

Useful reading order:

1. `README.md`
2. `PROJECT_EXPLANATION.md`
3. `docs/System_Architecture.md`
4. `docs/API_Reference_Complete.md`
5. `docs/Dataset_Reference.md`
6. `MEMBERS_WORK/TEAM_OVERVIEW.md`
7. each member's `MY_WORK_README.md`

## 9. Member Work Summary

The repository keeps separate member folders under `MEMBERS_WORK/`.

### 1. Ankur Biswal - Full-Stack Lead

Main areas:

- frontend application
- major pages and navigation
- authentication context
- AI practice UI
- quiz UI
- dashboard, profile, history, leaderboard, courses, instructor views
- JWT helper and auth router
- final reports and deployment guide

Representative files:

- `MEMBERS_WORK/01_Ankur_Biswal/frontend/`
- `MEMBERS_WORK/01_Ankur_Biswal/backend/auth/jwt_handler.py`
- `MEMBERS_WORK/01_Ankur_Biswal/backend/routers/auth_router.py`
- `MEMBERS_WORK/01_Ankur_Biswal/MY_WORK_README.md`

### 2. Chinmayee Badiger - Backend and Dataset Lead

Main areas:

- backend routers
- AI evaluation endpoint
- dataset router and dataset documentation
- ML training pipeline
- dataset library frontend page
- API/dataset milestone docs
- personal portfolio app

Representative files:

- `MEMBERS_WORK/02_Chinmayee_Badiger/backend/routers/`
- `MEMBERS_WORK/02_Chinmayee_Badiger/ml/`
- `MEMBERS_WORK/02_Chinmayee_Badiger/frontend/src/pages/DatasetLibraryPage.jsx`
- `MEMBERS_WORK/02_Chinmayee_Badiger/dataset_docs/dataset_guide.md`
- `MEMBERS_WORK/02_Chinmayee_Badiger/portfolio/`
- `CHINMAYEE_WORK_DETAILS.md`

### 3. Pragathi - Database Architect

Main areas:

- PostgreSQL schema
- ER diagram
- SQL queries
- SQLAlchemy models
- practice feedback flow
- database-related final documentation

Representative files:

- `MEMBERS_WORK/03_Pragathi/database/`
- `MEMBERS_WORK/03_Pragathi/Milestone4/database/schema.sql`
- `MEMBERS_WORK/03_Pragathi/MY_WORK_README.md`

### 4. Sirasana Gnana Prasanna Lakshmi - API Analyst

Main areas:

- API specifications
- gesture recognition API documentation
- request/response schemas
- sequence and endpoint documentation
- full API reference

Representative files:

- `MEMBERS_WORK/04_Prasanna_Lakshmi/api_specs/`
- `MEMBERS_WORK/04_Prasanna_Lakshmi/AI Gesture Recognition API.md`
- `MEMBERS_WORK/04_Prasanna_Lakshmi/MY_WORK_README.md`

### 5. Rishi - Workflow Analyst

Main areas:

- learning workflows
- Mermaid diagrams
- user journey
- practice flow
- quiz flow
- leaderboard update flow
- instructor monitoring flow

Representative files:

- `MEMBERS_WORK/05_Rishi/workflows/`
- `MEMBERS_WORK/05_Rishi/Sign_Language_Learning_Workflows.md`
- `MEMBERS_WORK/05_Rishi/MY_WORK_README.md`

### 6. Adityakumar Thakur - UI/UX Designer

Main areas:

- wireframes
- UI layout specs
- page-level design references
- design system colors, spacing, and structure
- implemented JSX references

Representative files:

- `MEMBERS_WORK/06_Adityakumar_Thakur/wireframes/`
- `MEMBERS_WORK/06_Adityakumar_Thakur/ui_reference/`
- `MEMBERS_WORK/06_Adityakumar_Thakur/MY_WORK_README.md`

## 10. How to Run the Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API docs:

```text
http://localhost:8000/docs
```

### ML training

```bash
cd ml
pip install -r requirements_ml.txt
python train_classifier.py
```

Expected output:

```text
ml/model/sign_classifier.pkl
```

## 11. Current Implementation Status

### Working/demo-ready areas

- React app structure and pages.
- Tab-based navigation.
- Demo login/register state.
- Camera/gesture practice UI logic.
- Quiz UI.
- Course catalog UI.
- Backend routes for AI evaluation, courses, progress, history, goals, leaderboard, instructor analytics, and notifications.
- ML training script for synthetic landmark data.
- Dataset documentation and dataset library UI.

### Areas that are mostly mock or planned

- Real database persistence.
- Production JWT auth integration.
- Real course enrollment persistence.
- Real history/progress persistence.
- Model loading inside the backend evaluator.
- Full CNN/LSTM/Transformer training on downloaded datasets.
- WebSocket-based real-time backend inference.
- Cloud deployment pipeline.

### Notable caveats

- `backend/main.py` does not mount every router that exists in `backend/routers/`.
- `backend/routers/auth_router.py` already has `/api/auth` in its router prefix, so it should not be included with another `/api` prefix unless adjusted.
- `ml/dataset_pipeline.py` has a syntax error in one method signature.
- The active backend uses mock data for many endpoints.
- The frontend authentication is local demo state, not backend JWT-backed auth.

## 12. Big Picture

This repository is best understood as a complete internship milestone deliverable rather than a production-ready SaaS application. It demonstrates:

- the product idea,
- the main UI experience,
- backend API structure,
- AI landmark evaluation logic,
- ML training direction,
- database planning,
- datasets and research sources,
- team work distribution,
- final milestone documentation.

The strongest parts of the project are the breadth of the learning platform, the AI practice concept, the dataset research, and the organized member deliverables. The main next step would be connecting the demo pieces into a persistent full-stack system: mounted auth routes, database-backed APIs, a corrected dataset pipeline, and a real trained model loaded by the backend.
