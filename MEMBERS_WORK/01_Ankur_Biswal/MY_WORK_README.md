# Ankur Biswal — Full-Stack Lead
## Infosys Springboard 2026 · Team 4 · SignLearn AI

### My Role
Full-Stack Lead — Built the complete frontend application and backend authentication system.

### What I Built

#### Frontend (React.js + Vite)
| File | Description |
|---|---|
| `AuthPage.jsx` | Login & Registration with role selection (Learner/Instructor), JWT auth |
| `DashboardPage.jsx` | Main dashboard — stats, streak tracker, sign mastery map, bar chart |
| `PracticeSessionPage.jsx` | **AI Camera Studio** — MediaPipe dual-hand gesture recognition, 37 signs (A-Z + words + two-hand), J/Z/PLEASE motion detection, lighting check |
| `AssessmentQuizPage.jsx` | 10-question Speed Quiz with 20s timer, grade system (A+/B/C/D), answer review |
| `ProfilePage.jsx` | User profile with learning goals, progress bars, 6 achievement badges |
| `PracticeHistoryPage.jsx` | Session history table with CSV export, filters by pass/fail/type |
| `LeaderboardPage.jsx` | Weekly + All-time leaderboard with gold/silver/bronze podium |
| `CoursesPage.jsx` | 6 courses, lesson list, **YouTube video modal embed** on click, progress tracking |
| `InstructorDashboardPage.jsx` | Instructor view — student progress, at-risk alerts, course stats |
| `DatasetLibraryPage.jsx` | 12 research datasets (WLASL, ASLLVD, How2Sign etc.) with links + citations |
| `Navbar.jsx` | Sticky navbar — role badge, mobile hamburger menu (<900px), user dropdown |
| `AuthContext.jsx` | Global auth state — login/register/logout, user role, JWT storage |
| `App.jsx` | Tab-based routing (10 tabs), auth guard |

#### Backend (Python FastAPI)
| File | Description |
|---|---|
| `main.py` | FastAPI app entry point — all routers registered |
| `auth/jwt_handler.py` | HMAC-SHA256 JWT creation (24h expiry), password hashing |
| `routers/auth_router.py` | `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/verify` |

### Tech Stack
- **Frontend**: React 18, Vite, Lucide Icons, MediaPipe Hands CDN
- **Backend**: Python 3.11, FastAPI, Uvicorn
- **Gesture AI**: MediaPipe Hands (maxNumHands:2, 21 landmarks per hand)
- **Design**: Pure inline styles, #F8FAFC bg, #0284C7 primary blue, Plus Jakarta Sans font

### How to Run My Part
```bash
# Frontend
cd frontend
npm install
npm run dev          # → http://localhost:5173

# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Branch
`ankur/week2-milestone2`

---
*Infosys Springboard Internship 2026 | Team 4 | SignLearn AI*

---

## 📁 Milestone 3 — My Deliverables (`Milestone3/`)
| File | What I Built |
|---|---|
| `frontend/src/pages/PracticeSessionPage.jsx` | **Full AI Camera Studio** — MediaPipe dual-hand, 37 signs, J/Z/PLEASE motion detection, lighting normalization, blue/orange skeleton |
| `frontend/src/pages/AssessmentQuizPage.jsx` | Speed Quiz — 10 ASL questions, 20s countdown timer, A+/B/C/D grading |
| `frontend/src/components/Navbar.jsx` | Mobile hamburger menu (<900px), role badge, static (no switcher) |
| `frontend/index.html` | Added 3 MediaPipe CDN scripts — fixed camera not loading |
| `backend/auth/jwt_handler.py` | HMAC-SHA256 JWT auth (24h expiry), password hashing |
| `backend/routers/auth_router.py` | `/api/auth/register`, `/api/auth/login`, `/api/auth/me` |
| `backend/main.py` | FastAPI entry point with all routers |
| `docs/Milestone3_Progress_Report.md` | Official M3 progress report |

## 📁 Milestone 4 — My Deliverables (`Milestone4/`)
| File | What I Built |
|---|---|
| `frontend/src/pages/DashboardPage.jsx` | Colorful stats, streak tracker, bar chart, sign mastery grid |
| `frontend/src/pages/ProfilePage.jsx` | Avatar, learning goals with progress bars, 6 achievement badges |
| `frontend/src/pages/PracticeHistoryPage.jsx` | Session table — filter by pass/fail/type, CSV export |
| `frontend/src/pages/LeaderboardPage.jsx` | Gold/silver/bronze podium, weekly + all-time ranking |
| `frontend/src/pages/CoursesPage.jsx` | **Working video player modal** — YouTube embed on lesson click |
| `frontend/src/pages/InstructorDashboardPage.jsx` | Student progress, at-risk alerts, course analytics |
| `frontend/src/pages/AuthPage.jsx` | Fixed garbled password bug, show/hide toggle, 2-role selection |
| `docs/Milestone4_Final_Report.md` | Official M4 final report |
| `docs/Deployment_Guide.md` | Full deployment instructions |
