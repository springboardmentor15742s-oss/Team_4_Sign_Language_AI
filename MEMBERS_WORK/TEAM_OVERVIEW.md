# 🤟 Team 4 — SignLearn AI | Work Distribution
## Infosys Springboard Internship 2026 · Accessible Sign Language Learning & AI Assessment Platform

---

## 👥 Team Members & Responsibilities

| # | Member | Role | Branch | Folder |
|---|---|---|---|---|
| 1 | **Ankur Biswal** | Full-Stack Lead | `ankur/week2-milestone2` | `01_Ankur_Biswal/` |
| 2 | **Chinmayee Badiger** | Backend & Dataset Lead | `chinmayee-week2-milestone2` | `02_Chinmayee_Badiger/` |
| 3 | **Pragathi** | Database Architect | `pragathi/week2-milestone2` | `03_Pragathi/` |
| 4 | **Sirasana Gnana Prasanna Lakshmi** | API Analyst | `prasanna/milestone-2` | `04_Prasanna_Lakshmi/` |
| 5 | **Rishi** | Workflow Analyst | `Rishi_team4/week2-milestone2` | `05_Rishi/` |
| 6 | **Adityakumar Thakur** | UI/UX Designer | `aditya/wireframes-ui` | `06_Adityakumar_Thakur/` |

---

## 📁 Folder Structure (Each Member Gets Their Own Folder)

```
MEMBERS_WORK/
├── 01_Ankur_Biswal/
│   ├── MY_WORK_README.md          ← Read this first
│   ├── frontend/src/pages/        ← All 10 page components (JSX)
│   ├── frontend/src/components/   ← Navbar.jsx
│   ├── frontend/src/context/      ← AuthContext.jsx
│   ├── frontend/src/App.jsx       ← Tab routing
│   ├── frontend/index.html        ← MediaPipe CDN + config
│   ├── backend/main.py            ← FastAPI app
│   ├── backend/auth/              ← JWT handler
│   └── backend/routers/auth_router.py
│
├── 02_Chinmayee_Badiger/
│   ├── MY_WORK_README.md
│   ├── backend/routers/           ← 8 API routers (ai_evaluate, courses, progress...)
│   ├── ml/train_classifier.py     ← Gesture AI model training
│   ├── ml/dataset_pipeline.py     ← WLASL/ASLLVD data loader
│   ├── frontend/src/pages/DatasetLibraryPage.jsx
│   └── dataset_docs/              ← Dataset integration docs
│
├── 03_Pragathi/
│   ├── MY_WORK_README.md
│   └── database/sql/schema.sql    ← 12-table PostgreSQL schema
│
├── 04_Prasanna_Lakshmi/
│   ├── MY_WORK_README.md
│   ├── api_specs/                 ← REST API specification docs
│   ├── AI Gesture Recognition API.md  ← 1068-line API spec
│   └── backend/routers/           ← All routers for reference
│
├── 05_Rishi/
│   ├── MY_WORK_README.md
│   ├── workflows/                 ← Mermaid workflow diagrams
│   └── Sign_Language_Learning_Workflows.md
│
└── 06_Adityakumar_Thakur/
    ├── MY_WORK_README.md
    ├── wireframes/                ← Low-fi UI wireframes (M1 + M2)
    └── ui_reference/pages/        ← Final JSX pages as design reference
```

---

## 🚀 How Each Member Should Upload to GitHub

### Step 1 — Go to YOUR folder only
Open `MEMBERS_WORK\[YOUR_FOLDER_NAME]\`

### Step 2 — Init and push your work
```bash
git init
git add .
git commit -m "feat: [Your Name] — [Your Role] deliverables"
git remote add origin https://github.com/YOUR_USERNAME/SignLearn-AI-Team4.git
git checkout -b your-branch-name
git push -u origin your-branch-name
```

### Step 3 — Or push to the team repo on YOUR branch
```bash
# Clone team repo
git clone https://github.com/team-repo/SignLearn-AI.git
cd SignLearn-AI
git checkout -b your-branch-name

# Copy your files from MEMBERS_WORK into the repo
# Then commit and push
git add .
git commit -m "feat: Milestone 2 — [Your Name] deliverables"
git push -u origin your-branch-name
```

---

## 📊 What Was Built — Complete Platform Summary

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Lucide Icons |
| Styling | 100% Inline Styles (light-mode forced, dark-mode immune) |
| AI / Gesture | MediaPipe Hands (21 landmarks, dual-hand) |
| Backend | Python FastAPI + Uvicorn |
| Auth | HMAC-SHA256 JWT (24h expiry) |
| Database | PostgreSQL (12 tables) |
| ML Model | RandomForest on pose landmarks (scikit-learn) |

### Features Delivered
- ✅ 37 signs recognized (A-Z alphabet + words + two-hand gestures)
- ✅ Dynamic motion signs (J, Z, PLEASE, WAVE, YES, NO, COME)
- ✅ Dual-hand support (right=blue, left=orange skeleton)
- ✅ 6 courses with YouTube video embed player
- ✅ Speed Quiz with 20s timer, grading A+ through D
- ✅ Leaderboard with gold/silver/bronze podium
- ✅ Practice History with CSV export
- ✅ 12 research datasets with citations
- ✅ Instructor dashboard with student analytics
- ✅ Mobile responsive navbar (hamburger menu)
- ✅ JWT authentication (register + login)

---

*SignLearn AI | Team 4 | Infosys Springboard 2026*
