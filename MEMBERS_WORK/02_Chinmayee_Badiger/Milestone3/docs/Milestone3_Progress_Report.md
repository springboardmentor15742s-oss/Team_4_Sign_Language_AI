# Milestone 3 — Progress Report
## SignLearn AI | Team 4 | Infosys Springboard 2026

---

## Summary
Milestone 3 delivers all advanced learning features: progress tracking, full course system, video dataset integration, instructor dashboard, and learning goals.

---

## Features Delivered

### M3.1 — Real-Time Progress Tracking
- **Backend**: progress.py router with 5 endpoints
  - Sign mastery % for all 28 signs (A–Z + HELLO + THANK_YOU)
  - Practice streak tracking (current, longest, total sessions)
  - 7-day weekly activity chart data
  - Overall summary statistics
- **Frontend**: Enhanced DashboardPage.jsx with:
  - Interactive sign mastery grid (color-coded: green=mastered, amber=progress, grey=needs work)
  - Weekly bar chart (7-day session visualization)
  - Real streak counter with flame icon
  - Learning goals progress list

### M3.2 — Full Course & Lesson System
- **Backend**: courses.py router with full course catalog
  - 6 complete courses: ASL Alphabet, Common Phrases, Numbers & Colors, Intermediate Conversations, Medical Signs, Professional Signs
  - 41 total lessons with real YouTube ASL video links
  - Enroll/unenroll functionality
- **Frontend**: New CoursesPage.jsx
  - Course cards with level badges, lesson count, instructor info
  - Expandable lesson lists with direct YouTube video links
  - Filter by level: All / Beginner / Intermediate / Advanced
  - Enroll button with state tracking

### M3.3 — Video Dataset Library (8 Real Datasets)
- **Enhanced**: DatasetLibraryPage.jsx with 8 peer-reviewed datasets:
  | Dataset | Source | Scale |
  |---|---|---|
  | MS-ASL | Microsoft Research | 1,000 signs, 25K+ clips |
  | WLASL | Purdue University | 2,000 words, 21K clips |
  | How2Sign | Carnegie Mellon | 35K+ clips, RGB+Depth |
  | YouTube-ASL | Google Research | 11,000+ hours |
  | OpenASL | Meta AI | 97 hours open domain |
  | RWTH-PHOENIX | RWTH Aachen | Continuous SL benchmark |
  | ASL-LEX | Northeastern Univ | 2,723 sign lexical DB |
  | AUTSL | Ankara University | 226 signs, 38K clips |
- Search and filter by category
- Direct access links + research paper links

### M3.4 — Instructor Dashboard
- **Backend**: instructor.py router
  - Platform-wide stats (247 learners, 76.4% avg accuracy)
  - Per-learner progress with session history
  - Course creation endpoint
- **Frontend**: New InstructorDashboardPage.jsx
  - Platform stats strip
  - Learner table with accuracy progress bars
  - Click to expand: shows last 5 sessions per learner
  - Level filter (Beginner/Intermediate/Advanced)
  - Add Course modal form
  - Role-gated (INSTRUCTOR and ADMIN only)

### M3.5 — Learning Goals
- **Backend**: goals.py router (CRUD operations)
- **Frontend**: Goals section in DashboardPage
  - Checklist with progress bars
  - Completed goals (ticked in green)
  - Target date tracking

---

## API Endpoints Added (M3)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/progress/{id} | Sign mastery map |
| GET | /api/progress/{id}/streak | Practice streak |
| GET | /api/progress/{id}/weekly | 7-day activity |
| GET | /api/progress/{id}/summary | Overall stats |
| POST | /api/progress/log | Log session |
| GET | /api/courses | List all courses |
| GET | /api/courses/{id}/lessons | Course lessons |
| POST | /api/courses/{id}/enroll | Enroll learner |
| GET | /api/instructor/learners | All learner stats |
| GET | /api/instructor/stats | Platform stats |
| GET/POST/PATCH/DELETE | /api/goals/{id} | Goals CRUD |

---

## Team Contributions — Milestone 3
| Member | Role | Contribution |
|---|---|---|
| Ankur Biswal | Frontend Lead | All frontend pages, App.jsx routing, Navbar |
| Pragathi | Database | schema.sql, queries.sql, ER diagram |
| Prasanna | API Design | API specifications, endpoint docs |
| Rishi | Workflows | Learning workflow diagrams |
| Aditya | UI/UX | Wireframes for new pages |
| Chinmayee | Backend | Backend router implementations |
