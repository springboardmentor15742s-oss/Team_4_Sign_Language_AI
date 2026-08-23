# Adityakumar Thakur — UI/UX Designer
## Infosys Springboard 2026 · Team 4 · SignLearn AI

### My Role
UI/UX Designer — Created the low-fidelity wireframes and UI screen layout specifications for all 10 pages.

### What I Built

#### Wireframes (`wireframes/`)
| Document | Description |
|---|---|
| `wireframes/Milestone2_UI_Wireframes.md` | Complete M2 UI wireframe specs for Practice Studio, Quiz, Leaderboard |
| `wireframes/wireframes.md` | All 10-page wireframe layouts — dimensions, components, spacing |

#### UI Design Specifications

**Design System I Defined:**
- Background: `#F8FAFC` (light grey)
- Primary Blue: `#0284C7`
- Orange Accent: `#F97316`
- Violet: `#7C3AED`
- Emerald: `#059669`
- Font: Plus Jakarta Sans (400/600/700/800)
- Card radius: 20px, Border: `#E2E8F0`
- Icon set: Lucide React

**Pages I Designed Wireframes For:**
| Page | Key Components |
|---|---|
| AuthPage | Login/register tabs, 2-role selector cards, goal checkboxes |
| DashboardPage | Gradient hero, 4 stat cards, weekly bar chart, mastery grid |
| AI Practice Studio | Dual-panel: camera left + sign guide right, status bar |
| Speed Quiz | Question card, 4-option buttons, timer bar |
| Courses | Card grid, banner headers, lesson accordion |
| Leaderboard | Podium top-3, ranked table |
| Profile | Hero banner, stats strip, goals section, badges grid |
| History | Filter bar, sortable table |
| Dataset Library | Search + cards with metadata |
| Instructor Dashboard | Tabs, student table, course progress bars |

#### Implementation Reference (`ui_reference/`)
The final implemented JSX pages are included here as reference — these show how my wireframes were translated into the actual product.

### Design Decisions
- **No dark mode** — forced `color-scheme: light` in HTML for accessibility consistency
- **Gradient headers** — each page has a unique gradient (blue-violet, amber, emerald etc.)
- **Mobile-first nav** — hamburger at <900px screen width
- **Inline styles** — dark mode immune, no Tailwind dependency

### Branch
`aditya/wireframes-ui`

---
*Infosys Springboard Internship 2026 | Team 4 | SignLearn AI*

---

## 📁 Milestone 3 — My Deliverables (`Milestone3/`)
| File | What I Built |
|---|---|
| `wireframes/Milestone2_UI_Wireframes.md` | M2 wireframes — layout specs for Practice Studio, Quiz |
| `wireframes/wireframes.md` | All 10 page wireframe layouts |
| `ui_reference/pages/PracticeSessionPage.jsx` | Final implementation of AI camera screen I designed |
| `ui_reference/pages/AssessmentQuizPage.jsx` | Quiz page — 4-option buttons, timer bar, result screen |
| `ui_reference/pages/DashboardPage.jsx` | Dashboard — stat cards, mastery grid, bar chart |
| `ui_reference/index.html` | HTML entry with MediaPipe CDN + design fonts |
| `docs/Milestone3_Progress_Report.md` | Official M3 progress report |

**M3 UI Screens I Designed:**
- AI Practice Studio: dual-panel (camera left + sign guide right), status bar, confidence meter
- Speed Quiz: question card, 4-option lettered buttons, red timer bar countdown
- Dashboard: gradient hero, colorful stat cards (blue/orange/emerald/violet)

## 📁 Milestone 4 — My Deliverables (`Milestone4/`)
All 10 final implemented screens are included as my UI design reference:

| Page | Design Highlights |
|---|---|
| `AuthPage.jsx` | 2-role card selector, show/hide password, demo hints |
| `DashboardPage.jsx` | 4 stat cards, 7-day bar chart, A–Z mastery grid |
| `PracticeSessionPage.jsx` | Camera + skeleton overlay, category tabs, session log |
| `AssessmentQuizPage.jsx` | Timer bar, lettered options, grade screen with confetti |
| `ProfilePage.jsx` | Avatar, 4 stat chips, learning goals, 6 badges |
| `PracticeHistoryPage.jsx` | Filterable table, pass/fail icons, progress bars |
| `LeaderboardPage.jsx` | Gold/silver/bronze podium, rank badges |
| `CoursesPage.jsx` | Card grid, color banners, YouTube video modal |
| `InstructorDashboardPage.jsx` | Tabs, student list, at-risk highlighting |
| `DatasetLibraryPage.jsx` | Dataset cards, search + filter, citation copy |

**Design System I Established:**
- `#F8FAFC` background, `#FFFFFF` cards, `#0284C7` primary, `#F97316` orange
- Gradient headers unique per page, 20px card radius, Plus Jakarta Sans font
- 100% inline styles — immune to OS dark mode
- Mobile breakpoint: hamburger nav at <900px
| `docs/Milestone4_Final_Report.md` | Official M4 final report |
