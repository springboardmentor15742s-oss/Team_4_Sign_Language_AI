# 🤟 SignLearn AI — AI-Powered Sign Language Learning & Assessment Platform
### Infosys Springboard Internship 2026 · Team 4 Master Review Branch

[![Milestone Status](https://img.shields.io/badge/Milestones%201--4-COMPLETED%20%E2%9C%93-brightgreen)](file:///./docs)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.11-009688)](file:///./backend)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB)](file:///./frontend)
[![MediaPipe](https://img.shields.io/badge/AI%2FCV-MediaPipe%20Hands-FF6F00)](file:///./ml)
[![ML Model](https://img.shields.io/badge/ML%20Accuracy-93.38%25%20(111--feature%20MLP)-blueviolet)](file:///./ml)

---

## 📌 Executive Overview

**SignLearn AI** is a real-time, interactive, accessible sign language learning platform built for the **Infosys Springboard Internship 2026** by **Team 4**. It combines client-side computer vision (MediaPipe Hands) with a high-performance 111-feature machine learning classifier (scikit-learn MLP) and a FastAPI backend to deliver:

- 📹 **Live Camera Gesture Recognition**: Real-time 21-landmark 3D hand tracking, finger angle analysis, and live accuracy feedback.
- 🎯 **Interactive Video Courses**: 6 structured ASL courses (Alphabet, Phrases, Numbers & Colors, Intermediate Conversations, Medical Signs, Workplace ASL) with curated instructional videos.
- 🎓 **Automated Course Certification**: Dynamic client-side Canvas generation of high-resolution, downloadable (.PNG) Certificates of Completion with custom verification credentials and instructor signatures.
- 🏆 **Gamified Progress & Leaderboard**: Weekly/all-time leaderboards, streaks, achievement badges, and speed quizzes.
- 📊 **Comprehensive Analytics & Instructor Dashboard**: Student monitoring, mastery breakdown, at-risk student tracking, and session export.
- 🗄️ **Production-Ready Relational Database**: PostgreSQL schema with 12 normalized tables, ER diagrams, foreign key constraints, and optimized queries.

---

## 👥 Team 4 Roster & Work Distribution

Every member has their complete set of deliverables organized within the [`MEMBERS_WORK/`](./MEMBERS_WORK/) directory:

| # | Member | Role | Core Deliverables & Contributions | Folder in `MEMBERS_WORK/` |
|---|---|---|---|---|
| 1 | **Ankur Biswal** | Full-Stack Lead & ML Integrator | Complete React 18 frontend (8 pages, SPA nav, canvas certificates, auth persistence), FastAPI backend routers, 111-feature MLP training & live evaluation, MediaPipe capture recorder, 40+ page Word documentation | [`01_Ankur_Biswal/`](./MEMBERS_WORK/01_Ankur_Biswal/) |
| 2 | **Chinmayee Badiger** | Dataset & ML Pipeline Specialist | Dataset integration pipeline (WLASL, MS-ASL), AI evaluation router, dataset documentation guides, Milestone 3 & 4 reports | [`02_Chinmayee_Badiger/`](./MEMBERS_WORK/02_Chinmayee_Badiger/) |
| 3 | **Pogakula Pragathi** | Database Architect | 12-table PostgreSQL schema, SQLAlchemy models, complex SQL queries, ER diagrams, database dictionary, and feedback flow | [`03_Pragathi/`](./MEMBERS_WORK/03_Pragathi/) |
| 4 | **Sirasana Gnana Prasanna Lakshmi** | API & Backend Architect | Comprehensive REST API specifications, backend endpoint routers (courses, progress, history, notifications), deployment guides | [`04_Prasanna_Lakshmi/`](./MEMBERS_WORK/04_Prasanna_Lakshmi/) |
| 5 | **Rishi Kumar** | Workflow & Systems Analyst | System architecture documentation, Mermaid workflow specifications, user journey mappings, Milestone 4 reports | [`05_Rishi/`](./MEMBERS_WORK/05_Rishi/) |
| 6 | **Adityakumar Prabodhkumar Thakur** | UI/UX Designer | 11 high-fidelity screen wireframes (Splash, Login, Signup, Dashboard, Courses, Practice, Assessment, Profile, Certificates) | [`06_Adityakumar_Thakur/`](./MEMBERS_WORK/06_Adityakumar_Thakur/) |

Detailed file breakdown is available in [`MEMBERS_WORK/TEAM_OVERVIEW.md`](./MEMBERS_WORK/TEAM_OVERVIEW.md).

---

## 🗂️ Repository Structure

```
Team_4_Sign_Language_AI/
├── frontend/                      # Production React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/            # Navbar, NotificationToast, CertModal, RoleBadge
│   │   ├── context/               # AuthContext with localStorage persistence
│   │   ├── pages/                 # 8 interactive pages (Dashboard, Courses, Profile, etc.)
│   │   ├── App.jsx                # SPA tab router with cross-page navigation
│   │   └── index.css              # Styling system (Light theme tokens)
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # Production FastAPI Backend Application
│   ├── models/                    # Trained 111-feature sign classifier (sign_classifier.pkl)
│   ├── routers/                   # 9 modular API routers (ai_evaluate, courses, progress...)
│   ├── schemas/                   # Pydantic models for API request/response validation
│   ├── auth/                      # JWT authentication and role-based access control
│   └── main.py                    # Application entry point with CORS and route mounting
│
├── ml/                            # Machine Learning & Computer Vision Pipeline
│   ├── train_classifier.py        # 111-feature extraction and MLP training pipeline
│   ├── validate_real_data.py      # Real-world benchmark evaluator (MediaPipe live captures)
│   ├── synthetic_stress_test.py   # Camera variance stress test (clearly labeled synthetic)
│   └── real_captures/             # Live webcam capture storage (.gitkeep)
│
├── database/                      # Database Models & Queries
│   ├── schema.sql                 # Complete PostgreSQL DDL
│   ├── models.py                  # SQLAlchemy ORM models
│   ├── queries.sql                # Analytical and transactional SQL queries
│   └── ER_Diagram.md              # Entity-Relationship diagram & explanation
│
├── Database_Schema/               # Pragathi's Database Deliverables
│   ├── ER_Diagram.png             # Full graphical ER diagram image
│   ├── Database_Dictionary.md     # Data dictionary & column specifications
│   └── Practice_Feedback_Flow.md  # Write sequence & feedback flow documentation
│
├── docs/                          # Master Documentation Suite
│   ├── SignLearn_AI_Team_4_Project_Documentation.docx # Comprehensive 40+ page Word Doc
│   ├── System_Architecture.md     # Architecture documentation by Rishi
│   ├── API_Reference_Complete.md  # Complete API specs by Prasanna
│   ├── Deployment_Guide.md        # Deployment instructions
│   └── wireframes/                # 11 screen mockups by Adityakumar Thakur
│
├── MEMBERS_WORK/                  # Individual Member Deliverable Archives (Milestones 1-4)
│   ├── 01_Ankur_Biswal/
│   ├── 02_Chinmayee_Badiger/
│   ├── 03_Pragathi/
│   ├── 04_Prasanna_Lakshmi/
│   ├── 05_Rishi/
│   ├── 06_Adityakumar_Thakur/
│   └── TEAM_OVERVIEW.md
│
└── team_master/                   # Mirrored Standalone Repository Copy
```

---

## 🚀 Quickstart & Execution Guide

### 1. Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** 3.10 or 3.11 (with `pip`)
- Modern Web Browser (Chrome / Edge recommended for MediaPipe webcam access)

### 2. Running the Backend Server
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --port 8000 --reload
```
* Backend API Documentation: `http://localhost:8000/docs`
* API Root: `http://localhost:8000/`

### 3. Running the Frontend Client
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
* Frontend Web App: `http://localhost:5173/`

### 4. Verifying Production Build
```bash
cd frontend
npm run build
```
*(Builds in under 600ms with 0 errors).*

---

## 🎯 Milestone Completion Matrix

| Milestone | Key Deliverables Required | Implementation Status |
|---|---|:---:|
| **Milestone 1** | Requirement Analysis, 4 Datasets Research, Wireframe Designs, Workflow Diagrams | **COMPLETED (100%)** |
| **Milestone 2** | JWT Authentication, PostgreSQL Schema (12 tables), ER Diagrams, Learner Profile Management | **COMPLETED (100%)** |
| **Milestone 3** | REST API Routers, MediaPipe Integration, Practice Session UI, Gesture Recognition Endpoint | **COMPLETED (100%)** |
| **Milestone 4** | 60-Sign 111-Feature Classifier (93.38%), Real Benchmark Recorder, Course Completion Certificates (Canvas API & Download), Comprehensive Project Documentation (.docx) | **COMPLETED (100%)** |

---

## 📜 Official Certificate of Completion Feature
- Complete all lessons in any course (e.g. *ASL Alphabet Basics*).
- An automated gold button appears on the course card: **`🎓 View & Download Certificate`**.
- Opens a canvas certificate with:
  - Learner Name (*Ankur Biswal*)
  - Course Title & Difficulty Level
  - Hours of instruction & lesson counts
  - Official Seal & Platform Signature
  - Instant **Download as PNG** capability.
- Also viewable anytime under **Profile → Certificates**.

---
*Built with ❤️ by Infosys Springboard Internship 2026 Team 4.*
