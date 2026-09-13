# 🤟 Team 4 — SignLearn AI | Complete Member Work Index
## Infosys Springboard Internship 2026 · Accessible Sign Language Learning & AI Assessment Platform

---

## 👥 Team Members & Project Roles

| # | Member | Official Role | Focus Area | Folder in `MEMBERS_WORK/` |
|---|---|---|---|---|
| 1 | **Ankur Biswal** | Full-Stack Lead | Frontend, Backend Integration, ML Pipeline, Certificates, Master Word Documentation | [`01_Ankur_Biswal/`](./01_Ankur_Biswal/) |
| 2 | **Chinmayee Badiger** | Backend & Dataset Lead | Dataset Integration Pipeline, AI Evaluation Routers, Dataset Documentation | [`02_Chinmayee_Badiger/`](./02_Chinmayee_Badiger/) |
| 3 | **Pogakula Pragathi** | Database Architect | PostgreSQL Database Schema (12 Tables), Models, SQL Queries, ER Diagrams | [`03_Pragathi/`](./03_Pragathi/) |
| 4 | **Sirasana Gnana Prasanna Lakshmi** | API & Architecture Analyst | REST API Specifications, Backend Routers, System Deployment Guides | [`04_Prasanna_Lakshmi/`](./04_Prasanna_Lakshmi/) |
| 5 | **Rishi Kumar** | Workflow & Systems Analyst | System Architecture, Learning Workflows (Mermaid), User Journeys | [`05_Rishi/`](./05_Rishi/) |
| 6 | **Adityakumar Prabodhkumar Thakur** | UI/UX Designer | UI Wireframes (11 Screen Mockups), Component Reference Designs | [`06_Adityakumar_Thakur/`](./06_Adityakumar_Thakur/) |

---

## 📁 Detailed Breakdown of Deliverables by Member

### 1. Ankur Biswal (`01_Ankur_Biswal/`)
- **Frontend Application**:
  - Full React 18 + Vite client (`frontend/src/`)
  - 8 core pages: `DashboardPage`, `CoursesPage`, `ProfilePage`, `PracticeSessionPage`, `AssessmentQuizPage`, `LeaderboardPage`, `PracticeHistoryPage`, `InstructorDashboardPage`
  - High-res Canvas Certificate generator and PNG download modal (`CertModal.jsx`)
  - Client-side navigation & auth persistence (`AuthContext.jsx`, `App.jsx`)
- **Backend & ML Integration**:
  - FastAPI application entry point with 9 modular routers (`backend/main.py`)
  - 111-feature trained MLP gesture classifier (`backend/models/sign_classifier.pkl` - 93.38% test accuracy across 60 signs)
  - Live MediaPipe capture recorder endpoint (`/api/ai/record-capture`)
- **Documentation**:
  - 40+ page comprehensive Word document: `SignLearn_AI_Team_4_Project_Documentation.docx`
  - Milestone 1, 2, 3, and 4 final reports and presentation scripts

### 2. Chinmayee Badiger (`02_Chinmayee_Badiger/`)
- **Dataset Integration**:
  - Data loading and preprocessing pipelines for WLASL and MS-ASL (`ml/dataset_pipeline.py`)
  - Dataset guides and specifications (`dataset_guide.md`, `dataset_docs/`)
  - Dataset Library frontend interface (`DatasetLibraryPage.jsx`)
- **ML & Backend**:
  - AI gesture recognition router and response schemas (`ai_evaluate.py`, `dataset.py`)
  - Milestone 3 & 4 progress and final reports

### 3. Pogakula Pragathi (`03_Pragathi/`)
- **Database Architecture**:
  - Full PostgreSQL DDL schema with 12 normalized tables (`schema.sql`)
  - Foreign key constraints, cascade rules, indexing on user and session IDs
  - SQLAlchemy ORM database models (`database/models.py`)
  - Production analytical and reporting queries (`queries.sql`)
- **Data Documentation & Visualization**:
  - Full graphical Entity-Relationship Diagram (`Database_Schema/ER_Diagram.png`)
  - Markdown ER diagram specification (`database/ER_Diagram.md`)
  - Data dictionary detailing every column, type, and constraint (`Database_Dictionary.md`)
  - Practice feedback write sequence documentation (`Practice_Feedback_Flow.md`)

### 4. Sirasana Gnana Prasanna Lakshmi (`04_Prasanna_Lakshmi/`)
- **API Specifications**:
  - 1,000+ line REST API reference document (`api_specs/API_Reference_Complete.md`)
  - Endpoint contracts, query parameters, request/response JSON schemas
  - Milestone 2 & Milestone 4 API specifications (`Milestone2_API_Specs.md`, `api_specs.md`)
- **Backend Routers & Deployment**:
  - Router implementations for courses, progress, goals, history, leaderboard, and notifications
  - Comprehensive deployment guide covering Docker, Uvicorn, and Nginx configurations (`Deployment_Guide.md`)

### 5. Rishi Kumar (`05_Rishi/`)
- **System Architecture**:
  - End-to-end multi-tier system architecture documentation (`System_Architecture.md`)
  - Microservice communication patterns and security boundaries
- **Workflow Specifications**:
  - High-level and detailed learning workflow specifications with Mermaid diagrams (`workflows.md`, `Milestone2_Workflows.md`)
  - Assessment flow, practice feedback loop, and user onboarding journeys
  - Milestone 4 final report

### 6. Adityakumar Prabodhkumar Thakur (`06_Adityakumar_Thakur/`)
- **UI Wireframe Designs**:
  - 11 high-fidelity wireframe screen mockups:
    1. Splash Screen
    2. Login Screen
    3. Sign Up Screen
    4. Learner Dashboard
    5. Dataset Library
    6. Profile Setup
    7. AI Practice Session
    8. Courses Catalog
    9. Assessment & Speed Quiz
    10. Certificates Modal & Gallery
    11. Profile Management
- **UI Component References**:
  - Layout guidelines, button hierarchy, and accessibility notes (`wireframes.md`)

---

## 🚀 Verification & Readiness for Merge into `main`

The `ankur/review` branch represents the collective work of all 6 members:
1. **Frontend**: Verified with `npm run build` (0 errors).
2. **Backend**: Verified with `uvicorn main:app` with all 9 routers loaded and ML model active.
3. **Database**: Complete schemas, models, and ER diagrams included.
4. **Docs**: Complete documentation including `.docx`, `.md`, and `.png` assets included.
