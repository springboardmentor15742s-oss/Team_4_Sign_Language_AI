# Sirasana Gnana Prasanna Lakshmi — API Analyst
## Infosys Springboard 2026 · Team 4 · SignLearn AI

### My Role
API Analyst — Wrote the complete REST API specification document covering all endpoints, request/response schemas, and sequence diagrams.

### What I Built

#### REST API Specification Document
Located in `api_specs/` folder.

**Endpoints Documented (Backend Routers):**

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register new user with role |
| `/api/auth/login` | POST | Login, receive JWT token |
| `/api/auth/me` | GET | Get current user profile |
| `/api/auth/verify` | GET | Verify JWT token validity |
| `/api/ai/evaluate` | POST | Submit 21 landmarks → get sign classification + accuracy |
| `/api/ai/evaluate/detailed` | POST | Debug evaluation with confidence scores |
| `/api/ai/supported-signs` | GET | List all 37 supported signs |
| `/api/ai/health` | GET | AI engine health check |
| `/api/progress` | GET/POST | Learner sign mastery progress |
| `/api/courses` | GET/POST | Course listing and enrollment |
| `/api/history` | GET/POST | Practice session history |
| `/api/goals` | GET/POST/PUT | Learning goals management |
| `/api/leaderboard` | GET | Weekly and all-time rankings |
| `/api/notifications` | GET | User achievement notifications |
| `/api/instructor/*` | GET | Student analytics for instructors |

#### Gesture Recognition API Doc (`AI Gesture Recognition API.md`)
- 1068-line comprehensive API specification
- Covers all 37 signs with landmark coordinate rules
- Request/Response JSON schemas for each endpoint
- Error codes and status meanings
- Rate limiting and authentication headers

#### Sequence Diagrams
- Live Practice Session flow
- Speed Quiz evaluation flow
- Exception handling (low confidence, bad lighting)
- JWT authentication flow

### Branch
`prasanna/milestone-2`

---
*Infosys Springboard Internship 2026 | Team 4 | SignLearn AI*

---

## 📁 Milestone 3 — My Deliverables (`Milestone3/`)
| File | What I Built |
|---|---|
| `api_specs/Milestone2_API_Specs.md` | Full M2 API specification document |
| `api_specs/AI Gesture Recognition API.md` | **1068-line** gesture recognition API spec — all 37 signs, landmark rules, JSON schemas |
| `backend/routers/ai_evaluate.py` | Implementation reference for `/api/ai/evaluate` |
| `backend/routers/ai_evaluate.py (schemas)` | Pydantic input/output schemas |
| `docs/Milestone3_Progress_Report.md` | Official M3 progress report |

**Key API Endpoints I Documented in M3:**
- `POST /api/ai/evaluate` — 21-landmark gesture classifier
- `POST /api/ai/evaluate/detailed` — debug confidence breakdown
- `GET /api/ai/supported-signs` — list of all 37 recognized signs
- `GET /api/ai/health` — AI engine status check

## 📁 Milestone 4 — My Deliverables (`Milestone4/`)
| File | What I Built |
|---|---|
| `api_specs/API_Reference_Complete.md` | Full M4 API reference — all 15+ endpoints documented |
| `backend/routers/*.py` | All 13 router implementations (reference) |
| `backend/main.py` | FastAPI app with all routers registered |
| `docs/Milestone4_Final_Report.md` | Official M4 final report |
| `docs/Deployment_Guide.md` | Production deployment guide with API hosting instructions |

**Complete API Surface I Documented in M4:**
| Router | Endpoints |
|---|---|
| auth_router | register, login, me, verify |
| ai_evaluate | evaluate, evaluate/detailed, supported-signs, health |
| courses | list, enroll, lessons |
| progress | get, update |
| history | list, create |
| goals | CRUD |
| leaderboard | weekly, all-time |
| notifications | list, mark-read |
| instructor | students, courses, analytics |
