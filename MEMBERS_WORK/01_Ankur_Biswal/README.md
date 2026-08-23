# 🤟 Sign Language Learning & Assessment Platform
### Team 4 — Infosys Springboard Internship 2026

![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)
![Week](https://img.shields.io/badge/Current-Week%201-blue)
![Mentor](https://img.shields.io/badge/Mentor-Shravya-purple)

---

## 📌 Project Overview

An **AI-powered Sign Language Learning & Assessment Platform** that helps users learn sign language through:

- 📹 Interactive video lessons
- 🤖 Real-time gesture recognition via webcam
- 🎯 AI-driven accuracy feedback and correction
- 📊 Learning progress tracking and analytics
- 🏆 Skill assessments and certification

**Target Users:** Students, hearing-impaired individuals, educators, accessibility trainers, and language learning platforms.

---

## 👥 Team 4 Members

| Name | GitHub Branch | Focus Area |
|------|--------------|------------|
| Ankur Biswal | `ankur/week1-frontend` | Frontend (React UI) |
| Adityakumar Prabodhkumar Thakur | `adityakumar/week1-` | TBD |
| Pogakula Pragathi | `pogakula/week1-` | TBD |
| Chinmayee Badiger | `chinmayee/week1-` | TBD |
| Chintagumpala Sarveswara Rao | `chintagumpala/week1-` | TBD |
| Rishi Kumar | `rishi/week1-` | TBD |
| Sirasana Gnana Prasanna Lakshmi | `sirasana/week1-` | TBD |

---

## 🗓️ Week 1 & Week 2 — What We Are Learning & Building

### 📚 Week 1 — Research, Planning & Foundation

#### What We Learned (Day 1)
- ✅ Understood the full project requirements and objectives
- ✅ Identified all 4 user roles: **Learner, Instructor, Accessibility Trainer, Administrator**
- ✅ Researched and compared all 4 datasets:
  - **ASL Alphabet Dataset** — 87K images, 29 classes, for static sign CNN training
  - **Sign Language MNIST** — 34K grayscale images, ideal for rapid prototyping
  - **WLASL** (Word-Level ASL) — 21K+ videos, 2000 words, for dynamic LSTM models
  - **RWTH-PHOENIX** — German Sign Language, for continuous sequence recognition
- ✅ Researched sign language learning platforms (SignSchool, HandSpeak, Lingvano, ASL Bloom)
- ✅ Collected UI inspirations from Duolingo, Coursera, Khan Academy
- ✅ Defined learner dashboard features and learner profile requirements

#### What We Are Building (Day 2 onwards)
- 🔨 Designing the learning workflow and system architecture
- 🔨 Setting up backend environment (FastAPI + PostgreSQL + MongoDB)
- 🔨 Initializing React frontend project with Tailwind CSS
- 🔨 Building Login and Registration UI
- 🔨 Developing Learner Dashboard layout
- 🔨 Downloading and organizing datasets
- 🔨 Beginning dataset preprocessing

---

### 🏗️ Week 2 — Core Setup & Authentication

#### Goals
- ✅ Fully working authentication system (JWT + OAuth2)
- ✅ Role-based access control (Learner / Instructor / Trainer / Admin)
- ✅ Learner profile management (create, update, track)
- ✅ Sign language datasets integrated into the backend pipeline
- ✅ Frontend routing and navigation complete

#### Key Milestone (End of Week 2 — Evaluation)
> - Project initialization completed
> - Authentication implemented
> - Learner profile management operational
> - Sign language datasets integrated

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                   │
│         Login | Dashboard | Practice | Profile           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│               API GATEWAY (FastAPI)                      │
│     Auth | Routing | Rate Limiting | CORS | Logging      │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  [Auth Service]  [Course Service] [Gesture Service]
  JWT + OAuth2    Lessons/Modules  MediaPipe + CV
        │              │              │
        ▼              ▼              ▼
  [PostgreSQL]    [MongoDB]       [ML Models]
   Users/Roles   Video/Gesture   CNN + LSTM
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Tailwind CSS, Chart.js, React Router |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, Alembic |
| **Primary DB** | PostgreSQL |
| **Secondary DB** | MongoDB |
| **Cache** | Redis |
| **Computer Vision** | MediaPipe, OpenCV, FFmpeg |
| **ML Models** | TensorFlow / PyTorch — CNN, LSTM, Transformer |
| **Analytics** | Pandas, NumPy, XGBoost |
| **Auth** | JWT, OAuth2, bcrypt |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Cloud** | AWS / Azure |

---

## 📊 Datasets Used

| Dataset | Type | Size | Use |
|---------|------|------|-----|
| Sign Language MNIST | Static images | 34K | Prototyping |
| ASL Alphabet | Static images | 87K | CNN training |
| WLASL | Dynamic videos | 21K+ | LSTM training |
| RWTH-PHOENIX | Continuous video | ~7K | Translation |

---

## 🌿 Git Branch Naming Convention

```
yourname/week-number-feature
```

**Examples:**
```
ankur/week1-frontend
adityakumar/week1-backend
pogakula/week1-datasets
```

**Rules:**
- ✅ Always push to YOUR branch
- ✅ Create a Pull Request to merge into `main`
- ❌ NEVER push directly to `main`
- ❌ Never work on someone else's branch

---

## 📁 Project Structure (Planned)

```
Team_4_Sign_Language_AI/
├── frontend/          # React.js application
├── backend/           # FastAPI microservices
├── ml/                # ML model training scripts
├── datasets/          # Dataset scripts and configs
├── docs/              # Documentation
├── docker-compose.yml
└── README.md
```

---

## 📅 8-Week Milestone Overview

| Milestone | Weeks | Deliverable |
|-----------|-------|-------------|
| **M1** | 1–2 | Auth + Profiles + Dataset Integration |
| **M2** | 3–4 | Gesture Recognition + Assessment Engine |
| **M3** | 5–6 | AI Feedback + Learning Intelligence |
| **M4** | 7–8 | Certification + Testing + Deployment |

---

## 📬 Contact

**Mentor:** Shravya — Infosys Springboard Program
**Meeting:** Daily 7–8 PM | [Google Meet Link](https://meet.google.com/hsx-xsdy-maf)

---

*Last updated: July 2026 | Team 4 — Sign Language AI*
