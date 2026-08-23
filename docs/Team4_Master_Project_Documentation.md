# 🤟 Team 4 Master Project Documentation & Evaluation Dossier
**Infosys Springboard Internship 2026 — Sign Language Learning & Assessment Platform**

---

## 📌 1. Executive Summary & Problem Statement

### Problem Statement
Over 430 million individuals globally experience disabling hearing loss. Access to structured Sign Language education (ASL, BSL, ISL) is severely hindered by a lack of interactive real-time gesture feedback, automated assessment scoring, and multi-role administrative tools.

### Key Objectives
1. **Interactive Real-Time Feedback**: Instant MediaPipe hand landmark detection with accuracy scoring.
2. **Role-Based Access Control (RBAC)**: Support 4 distinct operational roles: `LEARNER`, `INSTRUCTOR`, `TRAINER`, and `ADMIN`.
3. **Learner Profile Management**: Custom goal setting, skill mastery tracking, and practice history logging.
4. **Weighted Performance Scoring Formula**:
   $$\text{Learning Performance Score} = 0.40 \cdot G_a + 0.25 \cdot A_p + 0.15 \cdot L_c + 0.10 \cdot P_c + 0.10 \cdot S_i$$

---

## 👥 2. Complete Team 4 Branch Breakdown & Deliverable Audit

### 👤 1. Ankur Biswal — Team Lead & Full-Stack Developer
* **Git Branch**: `ankur/week1-frontend`
* **Branch Files & Structure**:
  * `frontend/` (React 18 + Vite Light Theme App: AuthPage, ProfilePage, DashboardPage, Navbar, RoleBadge).
  * `backend/` (FastAPI Microservices: auth, profile, dataset routers, user_schema Pydantic models).
  * `team_master/` (Consolidated master folder containing unified app, backend, database, api_specs, workflows, wireframes, dataset_docs).
* **Completed Tasks**:
  * Led overall system architecture & PDF compliance.
  * Designed clean White, Sky Blue & Orange UI design system.
  * Implemented Auth Portal, 4-Role RBAC system, and Learner Profile weighted performance score card.
  * Consolidated all team member deliverables into `team_master/`.
* **Problem Faced & Solution**:
  * *Problem*: Backend Pydantic validation error (`email-validator` import crash) and Vite unstyled CSS.
  * *Solution*: Updated `user_schema.py` to native string validation and integrated Tailwind CDN in `index.html`.

---

### 👤 2. Chinmayee Badiger — Frontend & Backend Developer / Documentation Specialist
* **Git Branch**: `chinmayee-week1`
* **Branch Files & Structure**:
  * `backend/` (FastAPI app scaffold, SQLite DB config, JWT Auth router `/api/auth`, User & Profile models, RBAC role definitions).
  * `frontend/` (React + Vite app setup, Home, Login, Register, Dashboard, Profile pages wired to backend API).
  * `Dockerfile`, `docker-compose.yml`, `.gitignore`, `README.md` root configuration files.
  * `docs/Dataset_Integration_Guide.md` (Sign Language MNIST, ASL Alphabet, WLASL dataset guide).
* **Completed Tasks**:
  * Scaffolded initial FastAPI backend microservice with JWT authentication & password hashing.
  * Scaffolded React + Vite frontend application with Auth & Profile API integration.
  * Authored Docker compose configuration files & Dataset Integration Guide.
* **Problem Faced & Solution**:
  * *Problem*: Memory overhead when parsing 87,000 RGB images from ASL Alphabet locally.
  * *Solution*: Developed a batch preprocessing pipeline in Python to resize and normalize images into pre-scaled arrays before feeding into training models.

---

### 👤 3. Pragathi — Database Architect
* **Git Branch**: `pragathi/week1`
* **Branch Files & Structure**:
  * `database/schema.sql` (10 SQL table definitions).
  * `database/ER_Diagram.png` & documentation.
  * `database/data_dictionary.md`.
* **Completed Tasks**:
  * Designed 10 normalized relational tables (`Users`, `Learner_Profile`, `Courses`, `Lessons`, `Practice_History`, `Skill_Mastery`, `Assessments`, `Progress_Tracking`, `Feedback`, `Learning_Goals`).
  * Established foreign key relationships and cascade delete rules.
  * Added CHECK constraints on role, status, and rating fields for data validation.
  * Added `accessibility_needs` field to `Learner_Profile` to support the platform's accessibility mission.
* **Problem Faced & Solution**:
  * *Problem*: Initial schema drafts mixed `user_id` and `learner_id` across analytics tables (`Learning_Goals`, `Practice_History`, `Skill_Mastery`).
  * *Solution*: Standardized all learner-facing records to reference `learner_id` foreign keys linking directly to `Learner_Profile`, ensuring full normalization and eliminating ambiguous join paths.

---

### 👤 4. Sirasana Gnana Prasanna Lakshmi — API Analyst
* **Git Branch**: `prasanna/week1`
* **Branch Files & Structure**:
  * `api-specification.md` (OpenAPI 3.0 REST API contracts).
  * `sequence-diagrams/` (Client-server sequence flows).
* **Completed Tasks**:
  * Authored OpenAPI REST contracts for `/auth/register`, `/auth/login`, `/profile/{id}`, `/datasets`.
  * Defined JWT bearer token authorization flow & JSON request/response schemas.
* **Problem Faced & Solution**:
  * *Problem*: Validating RBAC roles on every protected endpoint required additional DB queries, adding API latency.
  * *Solution*: Embedded user `role` claims directly inside signed JWT token payloads (`Bearer <token>`).

---

### 👤 5. Adityakumar Thakur — UI/UX Designer
* **Git Branch**: `adityakumar/week1-ui-wireframes`
* **Branch Files & Structure**:
  * `wireframes/` (Figma screen exports & low-fidelity wireframe specs).
* **Completed Tasks**:
  * Designed clean white and grey low-fidelity Figma UI wireframes for Auth Portal, Profile Setup, and AI Gesture Camera screens.
  * Focused on intuitive user flows, screen hierarchy, accessibility, and easy frontend implementation.
* **Problem Faced & Solution**:
  * *Problem*: Dark generic mockups created poor visual contrast and cluttered layout hierarchy when presenting live camera gesture feedback alongside skill metrics.
  * *Solution*: Redesigned wireframe layouts into clean white and grey low-fidelity split-view cards—separating real-time gesture feedback from skill progress cards for a clean, accessible user experience.

---

### 👤 6. Rishi — Workflow Analyst
* **Git Branch**: `Rishi_team4/week1`
* **Branch Files & Structure**:
  * `Sign_Language_Learning_Workflows.md` (Mermaid sequence diagrams & workflow specs).
* **Completed Tasks**:
  * Mapped 6-step end-to-end learner journey from login to gesture feedback.
  * Designed MediaPipe hand landmark detection & gesture accuracy scoring workflows.
* **Problem Faced & Solution**:
  * *Problem*: Gesture processing halted when a learner's hand moved out of frame during practice.
  * *Solution*: Designed an exception handling branch triggering a visual "Reposition Hand" toast notification without crashing the session.

---

## 🏗️ 3. System Architecture & Tech Stack Matrix

```
   [ React 18 + Vite Light Theme Frontend ]
                    │
           (HTTP / JSON REST APIs)
                    ▼
     [ Python FastAPI Microservices ]
       ├── /auth (JWT Registration & Login)
       ├── /profile (Learner Goal Management)
       └── /datasets (Sign Language Metadata)
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[ SQLite / PostgreSQL DB ]  [ ML Datasets Pipeline ]
 (10 Relational Tables)     (MNIST, ASL, WLASL)
```

| Tech Layer | Standard | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Tailwind CSS CDN, Lucide Icons, White + Sky Blue + Orange Theme |
| **Backend** | Python 3.10 + FastAPI | Pydantic v2, PyJWT, Bcrypt, Uvicorn, RESTful Endpoints |
| **Database** | PostgreSQL / SQLite | 10 Normalized Relational Tables (`schema.sql`) |
| **ML & AI** | Python 3.10 | OpenCV, MediaPipe Hand Landmark Detection, Dataset Loaders |

---

## 🚀 4. Execution Commands for Evaluation Demo

### Backend Microservice (`team_master/backend`)
```powershell
cd team_master/backend
python main.py
```
> Live Swagger Docs: `http://localhost:8000/docs`

### Frontend Web App (`team_master/frontend`)
```powershell
cd team_master/frontend
npm install
npm run dev
```
> Live Light Theme Application: `http://localhost:5173`
