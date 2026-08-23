# Pragathi — Database Architect
## Infosys Springboard 2026 · Team 4 · SignLearn AI

### My Role
Database Architect — Designed and implemented the complete relational database schema for the platform.

### What I Built

#### PostgreSQL Database Schema (`database/sql/schema.sql`)
| Table | Description |
|---|---|
| `users` | Core user accounts — email, hashed password, role (LEARNER/INSTRUCTOR), created_at |
| `learner_profiles` | Extended profile — learning level, preferred language, avatar URL |
| `courses` | Course catalog — title, level, category, instructor, duration |
| `lessons` | Individual lessons within courses — sequence, video URL, duration |
| `enrollments` | Many-to-many: user ↔ course, with progress percentage |
| `practice_sessions` | Every AI camera session — sign attempted, accuracy, passed/failed, hand_count |
| `sign_mastery` | Running mastery per user per sign — accuracy history, best score |
| `learning_goals` | User-defined goals with completion status |
| `leaderboard_entries` | Cached weekly rankings — score, streak, mastered count |
| `notifications` | Achievement & streak alerts — type, read status |
| `AI_Practice_Feedback` | (Milestone 2) — Stores MediaPipe landmark correction tips per session |
| `Quiz_Scores` | (Milestone 2) — Logs speed quiz session: score, grade, time_taken |

#### Leaderboard VIEW
```sql
CREATE VIEW leaderboard AS
  SELECT u.full_name, SUM(ps.passed::int)*10 + AVG(ps.accuracy) AS score
  FROM users u JOIN practice_sessions ps ON u.id = ps.user_id
  GROUP BY u.id ORDER BY score DESC;
```

### ER Diagram
12 normalized tables (3NF), foreign key relationships across all entities.
See `database/docs/` for the full ER diagram and data dictionary.

### Key Design Decisions
- All timestamps in UTC using `TIMESTAMPTZ`
- Soft deletes with `is_active` boolean on users table
- Role enforced as ENUM: `LEARNER`, `INSTRUCTOR`, `ADMIN`
- Indexes on `user_id`, `sign_name`, `created_at` for query performance

### Branch
`pragathi/week2-milestone2`

---
*Infosys Springboard Internship 2026 | Team 4 | SignLearn AI*

---

## 📁 Milestone 3 — My Deliverables (`Milestone3/`)
| File | What I Built |
|---|---|
| `database/schema.sql` | Extended schema with `AI_Practice_Feedback` table (landmark correction tips per session) |
| `database/ER_Diagram.md` | Full entity-relationship diagram for all 12 tables |
| `docs/Practice_Feedback_Flow.md` | Data flow: how AI evaluation results get stored in DB |
| `docs/Milestone3_Progress_Report.md` | Official M3 progress report |

## 📁 Milestone 4 — My Deliverables (`Milestone4/`)
| File | What I Built |
|---|---|
| `database/schema.sql` | Complete 12-table PostgreSQL schema (production-ready) |
| `database/models.py` | SQLAlchemy ORM models with graceful fallback for all tables |
| `database/queries.sql` | Optimized queries for leaderboard, progress, mastery views |
| `database/ER_Diagram.md` | Final ER diagram with all M4 tables |
| `docs/Milestone4_Final_Report.md` | Official M4 final report |
| `docs/API_Reference_Complete.md` | API documentation (cross-reference for DB field names) |
| `docs/System_Architecture.md` | Full system architecture with DB layer explained |

### New Tables Added for M3/M4
| Table | Purpose |
|---|---|
| `AI_Practice_Feedback` | Stores MediaPipe landmark correction tips per session |
| `Quiz_Scores` | Logs speed quiz: score, grade, time_taken, questions attempted |
| `leaderboard_entries` | Cached rankings for fast leaderboard queries |
| `notifications` | Achievement + streak alerts |
