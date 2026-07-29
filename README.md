# Sign Language Learning & Assessment Platform

Team 4 — Infosys Springboard Internship 2026

AI-powered platform for learning sign language with interactive lessons, gesture recognition, feedback, and assessments.

This branch sets up the **backend** and **frontend** foundations (Milestone 1 environment + auth/profile scaffolding).

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Auth | JWT + role-based access control |
| Database | SQLite (local default; swap `DATABASE_URL` for PostgreSQL) |
| Containers | Docker Compose |

**Roles:** Learner · Instructor · Accessibility Trainer · Administrator

## Project structure

```
backend/
  app/
    core/          # config, DB, security, deps
    models/        # User, LearnerProfile
    schemas/       # Pydantic request/response models
    routers/       # /api/auth, /api/profile
  requirements.txt
  Dockerfile
frontend/
  src/
    components/    # Layout
    context/       # AuthContext
    lib/           # API client
    pages/         # Home, Login, Register, Dashboard, Profile
  Dockerfile
docker-compose.yml
context.md         # Project brief
```

## Quick start (local)

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

If port `8000` is already in use (e.g. Docker), use `--port 8001` and set `VITE_API_BASE_URL=http://localhost:8001/api` in `frontend/.env`.

- API root: http://localhost:8000  
- Swagger docs: http://localhost:8000/docs  
- Health: http://localhost:8000/api/health  

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- App: http://localhost:5173  

### 3. Docker (optional)

```bash
docker compose up --build
```

## API endpoints (setup scope)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Register user + optional learner profile |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Current user (Bearer token) |
| `GET` | `/api/profile/me` | Get learner profile |
| `PUT` | `/api/profile/me` | Update learner profile |
| `GET` | `/api/health` | Health check |

### Example register body

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "Learn@2026",
  "role": "Learner"
}
```

## What this setup includes

- Frontend and backend project initialization
- JWT authentication and RBAC roles from the brief
- Learner profile create/read/update
- CORS wired for the Vite dev server
- Dockerfiles + Compose for containerized runs
- Env examples for local config

## Out of scope (later milestones)

Gesture recognition, pose tracking, assessment engines, certification, analytics dashboards, cloud production deploy.

## Datasets

Local raw data goes under `datasets/raw/` (gitignored). Full download links, sizes, class structures, and usage rules:

→ [`docs/Dataset_Integration_Guide.md`](docs/Dataset_Integration_Guide.md)

## Reference

See `context.md` for the full internship brief and module list.
