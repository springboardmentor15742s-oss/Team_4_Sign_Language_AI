# Design Sign Language Learning Workflows

**Project:** AI-Powered Sign Language Learning & Assessment Platform
**Document Type:** Software Engineering Design Document (Workflow Specification)
**Module Owner:** Learning Workflow Design
**Related Documents:** Project Objectives, Learner Dashboard Layout, System Architecture

---

## 1. Introduction

### 1.1 Purpose of the Learning Workflow

This document specifies the end-to-end learning workflow of the AI-Powered Sign Language Learning & Assessment Platform. It defines how a learner moves through registration, lesson consumption, camera-based sign practice, AI-driven gesture assessment, quizzes, progress tracking, and certification. It also defines the supporting workflows — AI inference, database interaction, error handling, gamification, and adaptive learning — that make the learning experience functional, resilient, and personalized.

The workflow design builds directly on the previously completed **System Architecture** (FastAPI microservices, PostgreSQL/MongoDB data layer, AI/ML inference layer using TensorFlow, PyTorch, OpenCV, and MediaPipe) and the **Learner Dashboard Layout**. This document translates that architecture into concrete process flows that the frontend, backend, and AI services must implement.

### 1.2 Objectives

- Define a complete, unambiguous learner journey from first login to course certification.
- Specify distinct workflows for new learners, returning learners, practice mode, assessment mode, and revision mode.
- Model the AI gesture-recognition pipeline (webcam capture → landmark extraction → classification → confidence scoring → feedback).
- Document database read/write operations at each workflow stage.
- Define error-handling paths for camera, connectivity, and low-confidence prediction scenarios.
- Specify the gamification workflow (XP, badges, streaks, leaderboards).
- Specify the adaptive learning workflow that adjusts lesson difficulty based on learner performance.
- Provide Mermaid diagrams and summary tables suitable for direct inclusion in the team's GitHub repository and final project report.

---

## 2. End-to-End Learning Journey

The table below summarizes the full learner journey. Each stage is expanded into detailed sub-workflows in Sections 3–10.

| # | Stage | User Action | System Action | AI Action | Database Operation |
|---|-------|-------------|----------------|-----------|---------------------|
| 1 | Registration/Login | Signs up or logs in | Validates credentials, issues JWT | — | Create/read `users` |
| 2 | Profile Setup | Enters name, goals, preferred language | Creates learner profile | — | Write `learner_profiles` |
| 3 | Skill Assessment (optional) | Performs sample signs on request | Presents a short diagnostic quiz | Classifies gestures, estimates baseline level | Write `assessment_results` |
| 4 | Path Selection | Chooses Beginner/Intermediate/Advanced | Filters course catalog by level | Suggests a path based on assessment | Read `courses`, write `learner_path` |
| 5 | Module/Lesson Selection | Picks a lesson | Loads lesson content and metadata | — | Read `lessons`, `modules` |
| 6 | Content Learning | Watches videos/animations, reads text | Streams content, tracks watch time | — | Write `content_progress` |
| 7 | Camera-Based Practice | Enables webcam, performs sign | Activates capture pipeline | Detects hand, extracts landmarks, classifies gesture | Write `practice_history` |
| 8 | Real-Time Feedback | Views correctness/confidence feedback | Renders feedback UI | Generates corrective feedback | Write `feedback_log` |
| 9 | Quiz/Assessment | Attempts quiz questions and/or graded signs | Scores responses | Scores sign accuracy for graded items | Write `quiz_scores` |
| 10 | Progress Tracking | Views dashboard | Aggregates progress metrics | Computes skill/mastery analytics | Read/write `progress_tracking` |
| 11 | Lesson Unlock | Proceeds to next lesson | Checks completion threshold | Recommends next/adaptive lesson | Read `learner_path`, write `unlocked_lessons` |
| 12 | Course Completion | Completes final assessment | Validates completion criteria | Confirms mastery threshold met | Write `certificates` |

---

## 3. Workflows by Learner Type and Mode

### 3.1 New Learner Workflow

A first-time user follows the full onboarding sequence: account creation, profile setup, an optional skill assessment, and path selection, before reaching the lesson catalog.

```mermaid
flowchart TD
    A[Start] --> B[Register Account]
    B --> C[Verify Email / OTP]
    C --> D[Create Learner Profile]
    D --> E{Take Skill Assessment?}
    E -->|Yes| F[Perform Diagnostic Signs]
    F --> G[AI Estimates Baseline Level]
    E -->|No| H[Default to Beginner Level]
    G --> I[Recommend Learning Path]
    H --> I
    I --> J[Select Path: Beginner/Intermediate/Advanced]
    J --> K[Land on Learner Dashboard]
    K --> L[Select First Lesson]
```

### 3.2 Returning Learner Workflow

A returning learner skips onboarding and resumes from their last known state.

```mermaid
flowchart TD
    A[Start] --> B[Login]
    B --> C[Load Saved Progress and Streak]
    C --> D{Streak Active?}
    D -->|Yes| E[Show Streak Continuation Prompt]
    D -->|No| F[Show Streak Reset Notice]
    E --> G[Dashboard: Resume Last Lesson / Continue Path]
    F --> G
    G --> H{Learner Choice}
    H -->|Continue Lesson| I[Resume In-Progress Lesson]
    H -->|Practice| J[Enter Practice Mode]
    H -->|Revise| K[Enter Revision Mode]
    H -->|New Lesson| L[Select Next Unlocked Lesson]
```

### 3.3 Practice Mode Workflow

Practice mode is ungraded and repeatable, intended for skill-building without affecting quiz scores.

```mermaid
flowchart TD
    A[Enter Practice Mode] --> B[Select Sign/Topic to Practice]
    B --> C[Activate Webcam]
    C --> D[AI Hand Detection]
    D --> E{Hand Detected?}
    E -->|No| F[Show Positioning Guidance] --> D
    E -->|Yes| G[Extract Landmarks and Classify Gesture]
    G --> H{Confidence Above Threshold?}
    H -->|Yes, Correct| I[Show Success Feedback]
    H -->|Yes, Incorrect| J[Show Corrective Feedback]
    H -->|No, Low Confidence| K[Prompt Retry / Adjust Lighting]
    I --> L[Log Attempt to Practice History]
    J --> L
    K --> L
    L --> M{Practice Again?}
    M -->|Yes| B
    M -->|No| N[Return to Dashboard]
```

### 3.4 Assessment Mode Workflow

Assessment mode is graded: results feed quiz scores, progress tracking, and lesson-unlock decisions.

```mermaid
flowchart TD
    A[Start Assessment] --> B[Load Question/Sign Set]
    B --> C{Item Type}
    C -->|Multiple Choice/Text| D[Capture Answer]
    C -->|Sign Performance| E[Activate Webcam and Capture Gesture]
    E --> F[AI Gesture Classification and Scoring]
    D --> G[Score Item]
    F --> G
    G --> H{More Items?}
    H -->|Yes| B
    H -->|No| I[Compute Total Score]
    I --> J{Score >= Pass Threshold?}
    J -->|Yes| K[Mark Assessment Passed]
    J -->|No| L[Mark Assessment Failed]
    K --> M[Unlock Next Lesson]
    L --> N[Recommend Revision Exercises]
    M --> O[Update Progress and Award XP]
    N --> O
    O --> P[Store Quiz Score in Database]
```

### 3.5 Revision Mode Workflow

Revision mode is system-triggered or learner-initiated and targets previously weak topics.

```mermaid
flowchart TD
    A[Trigger: Low Score or Learner Request] --> B[AI Identifies Weak Topics from History]
    B --> C[Generate Revision Set: Signs + Quiz Items]
    C --> D[Learner Completes Revision Exercises]
    D --> E[AI Re-Evaluates Accuracy on Weak Topics]
    E --> F{Improved Above Threshold?}
    F -->|Yes| G[Clear Weak-Topic Flag]
    F -->|No| H[Keep Flagged for Further Revision]
    G --> I[Update Learner Skill Profile]
    H --> I
    I --> J[Return to Dashboard]
```

---

## 4. Core Workflow Diagrams

### 4.1 Main Application Workflow

```mermaid
flowchart TD
    A[Login/Register] --> B[Dashboard]
    B --> C[Select Lesson]
    C --> D[Lesson Content Delivery]
    D --> E[Camera-Based Practice]
    E --> F[AI Gesture Recognition]
    F --> G[Real-Time Feedback]
    G --> H[Quiz/Assessment]
    H --> I{Pass?}
    I -->|Yes| J[Update Progress, Award XP/Badges]
    I -->|No| K[Recommend Revision]
    J --> L{More Lessons in Path?}
    L -->|Yes| C
    L -->|No| M[Course Completion and Certification]
    K --> D
```

### 4.2 Lesson Workflow

```mermaid
flowchart TD
    A[Open Lesson] --> B[Load Lesson Metadata]
    B --> C[Present Content: Video / Image / Text / Animation]
    C --> D[Track Watch/Read Progress]
    D --> E{Content Fully Consumed?}
    E -->|No| C
    E -->|Yes| F[Enable Practice Segment]
    F --> G[Camera-Based Sign Practice]
    G --> H[Lesson Quiz]
    H --> I{Quiz Passed?}
    I -->|Yes| J[Mark Lesson Complete]
    I -->|No| K[Offer Retry or Revision]
    J --> L[Unlock Next Lesson]
    K --> H
```

### 4.3 Practice Workflow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant L as Learner
    participant UI as Frontend
    participant API as Backend API
    participant AI as AI/Gesture Service
    participant DB as Database

    L->>UI: Select sign to practice
    UI->>API: Request practice session
    API->>DB: Fetch reference gesture data
    DB-->>API: Reference data
    API-->>UI: Session initialized
    UI->>L: Activate webcam
    L->>UI: Perform sign
    UI->>AI: Stream video frames
    AI->>AI: Hand detection, landmark extraction
    AI->>AI: Gesture classification, confidence scoring
    AI-->>UI: Result (correct/incorrect, confidence, feedback)
    UI->>L: Display real-time feedback
    UI->>API: Log practice attempt
    API->>DB: Write to practice_history
```

### 4.4 Assessment Workflow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant L as Learner
    participant UI as Frontend
    participant API as Backend API
    participant AI as AI/Gesture Service
    participant DB as Database

    L->>UI: Start assessment
    UI->>API: Request assessment item set
    API->>DB: Fetch quiz/sign items
    DB-->>API: Item set
    API-->>UI: Deliver items
    loop Each item
        L->>UI: Submit answer or perform sign
        alt Sign-based item
            UI->>AI: Stream frames
            AI-->>UI: Classification + confidence score
        else Text/MCQ item
            UI->>API: Submit answer
        end
        UI->>API: Submit item result
    end
    API->>API: Compute total score
    API->>DB: Write quiz_scores
    API-->>UI: Pass/fail result
    UI->>L: Show result and next steps
```

### 4.5 Progress Tracking Workflow

```mermaid
flowchart TD
    A[Learning Event Occurs: Lesson/Practice/Quiz] --> B[Event Sent to Backend API]
    B --> C[Update Relevant Tables: content_progress, practice_history, quiz_scores]
    C --> D[Learning Intelligence Service Aggregates Data]
    D --> E[Compute Metrics: Accuracy, Completion %, Streak, XP]
    E --> F[Write to progress_tracking]
    F --> G[Dashboard Queries Latest Progress]
    G --> H[Render Progress Charts and Recommendations]
```

---

## 5. Decision Flows

The following decision logic governs correctness handling, quiz outcomes, and lesson completion.

```mermaid
flowchart TD
    A[Gesture Captured] --> B{Confidence >= Min Threshold?}
    B -->|No| C[Low-Confidence Path: Prompt Retry]
    B -->|Yes| D{Matches Expected Gesture?}
    D -->|Yes| E[Correct: Show Success, Log Success, Continue]
    D -->|No| F[Incorrect: Show Targeted Feedback]
    F --> G[Offer Retry]
    G --> A
    C --> A
```

```mermaid
flowchart TD
    A[Quiz Submitted] --> B[Calculate Score]
    B --> C{Score >= Pass Threshold e.g. 70%}
    C -->|Pass| D[Mark Quiz Passed]
    D --> E[Award XP and Update Streak]
    E --> F[Check Lesson Completion Criteria]
    C -->|Fail| G[Mark Quiz Failed]
    G --> H[Flag Weak Topics for Revision]
    H --> I[Offer Retry or Revision Mode]
```

```mermaid
flowchart TD
    A[Lesson Completion Check] --> B{Content Viewed?}
    B -->|No| Z[Lesson Incomplete]
    B -->|Yes| C{Practice Attempted?}
    C -->|No| Z
    C -->|Yes| D{Quiz Passed?}
    D -->|No| Z
    D -->|Yes| E[Lesson Marked Complete]
    E --> F[Unlock Next Lesson in Path]
```

---

## 6. AI Interaction Workflow

This section details the AI gesture-recognition pipeline referenced throughout Sections 3–5, aligning with the Gesture Recognition Engine and Pose & Hand Tracking Engine defined in the System Architecture.

```mermaid
flowchart TD
    A[Webcam Activation] --> B{Camera Permission Granted?}
    B -->|No| C[Error: Camera Unavailable — See Section 8]
    B -->|Yes| D[Capture Video Frame Stream]
    D --> E[Hand Detection - MediaPipe Hands]
    E --> F{Hand Detected?}
    F -->|No| G[Error: Hand Not Detected — See Section 8]
    F -->|Yes| H[Landmark Extraction: Finger, Palm, Wrist Joints]
    H --> I[Normalize Landmark Coordinates]
    I --> J[Gesture Classification: CNN/LSTM/Transformer Model]
    J --> K[Compute Confidence Score]
    K --> L{Confidence >= Threshold?}
    L -->|No| M[Request Retry / Adjust Position or Lighting]
    L -->|Yes| N[Compare to Reference Gesture]
    N --> O[Generate Feedback: Correct / Corrective Detail]
    O --> P[Return Result to Frontend]
```

**Pipeline stage summary:**

| Stage | Description | Output |
|-------|-------------|--------|
| Webcam Activation | Frontend requests camera access via browser/device API | Live video stream |
| Hand Detection | MediaPipe Hands locates hand region(s) in frame | Bounding region, detection flag |
| Landmark Extraction | 21-point hand landmark model extracts joint coordinates | Landmark coordinate set |
| Gesture Classification | CNN (static signs) or LSTM/Transformer (dynamic signs) classifies the gesture | Predicted sign label |
| Confidence Score Calculation | Model outputs a probability/confidence value for the prediction | Confidence score (0–1) |
| Feedback Generation | System compares prediction and confidence against the expected sign | Correct/incorrect status, corrective message |

---

## 7. Database Interactions

Each learning workflow stage reads from or writes to specific data entities. This section consolidates database interaction points for backend and data-layer implementation.

| Workflow Stage | Data Stored/Read | Example Fields |
|-----------------|-------------------|-----------------|
| Registration/Login | User account | user_id, email, password_hash, role |
| Profile Setup | Learner profile | learner_id, name, preferred_language, learning_goals |
| Skill Assessment | Assessment results | assessment_id, baseline_level, per-topic accuracy |
| Path/Lesson Selection | Learner path, lesson metadata | path_id, current_level, lesson_id, module_id |
| Content Learning | Content progress | content_id, watch_percentage, completed_flag |
| Camera-Based Practice | Practice history | attempt_id, sign_label, confidence_score, result, timestamp |
| Real-Time Feedback | Feedback log | feedback_id, mistake_type, suggestion_text |
| Quiz/Assessment | Quiz scores | quiz_id, score, pass_flag, item-level breakdown |
| Progress Tracking | Progress metrics | accuracy_trend, completion_percentage, mastery_level |
| Gamification | XP, badges, streaks | xp_total, badge_ids, streak_count, last_active_date |
| Lesson Unlock | Unlocked lessons | learner_id, unlocked_lesson_ids |
| Certification | Certificates | certificate_id, course_id, issue_date |

**Notes:**
- `practice_history` and `quiz_scores` are the primary sources for the Learning Progress Intelligence Engine's accuracy and mastery calculations.
- `feedback_log` entries are retained to support the AI Feedback & Correction Engine's personalized improvement plans.
- All writes from the AI/Gesture Service pass through the backend API layer rather than writing to the database directly, preserving validation and audit logging.

---

## 8. Error Handling Workflows

Robust error handling is essential given the platform's dependence on camera input and real-time inference. The table and diagram below define detection and recovery behavior for common failure scenarios.

| Scenario | Detection Point | System Response | Recovery Path |
|----------|------------------|------------------|----------------|
| Camera unavailable | Webcam activation step | Display permission/hardware error message | Prompt to grant permission or select another device; fall back to text-based practice if unresolved |
| Poor lighting | Hand detection confidence consistently low | Display lighting guidance overlay | Suggest repositioning or increasing light; allow manual retry |
| Hand not detected | No hand region found in frame after N attempts | Display "position your hand in frame" guide | Show on-screen hand placement outline; retry detection loop |
| Low confidence prediction | Classification confidence below threshold | Withhold pass/fail judgment | Prompt retry; after repeated low confidence, offer a slowed-down reference video |
| Internet disconnected | API/network call failure or timeout | Display offline banner | Cache in-progress attempt locally; queue sync; retry submission on reconnect |

```mermaid
flowchart TD
    A[Practice/Assessment Step] --> B{Camera Available?}
    B -->|No| C[Show Camera Error] --> H[Offer Alternate Mode / Retry]
    B -->|Yes| D{Hand Detected?}
    D -->|No| E[Show Positioning/Lighting Guidance] --> H
    D -->|Yes| F{Network Connected?}
    F -->|No| G[Queue Attempt Locally, Show Offline Notice] --> H
    F -->|Yes| I{Confidence Sufficient?}
    I -->|No| J[Prompt Retry with Reference Video] --> H
    I -->|Yes| K[Proceed with Result Processing]
    H --> A
```

---

## 9. Gamification Workflow

Gamification elements reinforce consistent practice and reward measurable progress.

| Element | Trigger | System Action |
|---------|---------|-----------------|
| XP | Lesson completion, quiz pass, daily practice | Add XP to learner's total; update level if threshold crossed |
| Badges | Milestone reached (e.g., first lesson, 10-day streak, module mastery) | Award badge; store in `badges` collection; trigger notification |
| Daily Streaks | Learner completes at least one activity per day | Increment streak counter; reset on missed day |
| Leaderboards | Periodic aggregation (daily/weekly) | Rank learners by XP within cohort or global scope |
| Achievement Unlocking | Composite conditions met (e.g., accuracy + completion) | Unlock achievement, update learner profile |

```mermaid
flowchart TD
    A[Learning Event: Lesson/Quiz/Practice Completed] --> B[Calculate XP Earned]
    B --> C[Update XP Total]
    C --> D{Milestone Reached?}
    D -->|Yes| E[Award Badge]
    D -->|No| F[Continue]
    E --> F
    F --> G{Activity Logged Today?}
    G -->|First Today| H[Increment Streak]
    G -->|Already Logged| I[No Streak Change]
    H --> J[Update Leaderboard Ranking]
    I --> J
    J --> K[Refresh Dashboard Gamification Widgets]
```

---

## 10. Adaptive Learning Workflow

The Learning Progress Intelligence Engine and Recommendation Engine use accumulated practice and assessment data to adjust the difficulty and content of upcoming lessons.

```mermaid
flowchart TD
    A[Aggregate Recent Performance: Accuracy, Quiz Scores, Practice Attempts] --> B{Evaluate Performance Trend}
    B -->|Accuracy Consistently Low| C[Recommend Easier Lessons / Reduce Pace]
    B -->|Accuracy Consistently High| D[Recommend Advanced Lessons / Increase Pace]
    B -->|Specific Topics Weak| E[Recommend Targeted Revision Exercises]
    B -->|Balanced Performance| F[Continue Standard Path Sequence]
    C --> G[Update Learner Path Recommendation]
    D --> G
    E --> G
    F --> G
    G --> H[Present Updated Recommendation on Dashboard]
```

**Adaptive rules:**

| Condition | Threshold (indicative) | Recommendation |
|-----------|--------------------------|------------------|
| Low accuracy | Average sign/quiz accuracy below ~60% over recent attempts | Insert easier/simplified lessons; increase practice repetitions |
| High accuracy | Average accuracy above ~90% with fast completion | Skip ahead or surface advanced/optional lessons |
| Weak topic pattern | Repeated low scores on a specific sign category | Insert revision-mode exercises targeting that category |
| Stagnant progress | No improvement across multiple attempts on same item | Suggest a reference video walkthrough or instructor-led alternative |

---

## 11. Summary Tables

### 11.1 Workflow Stage Summary

| Workflow Stage | User Actions | System Actions | AI Actions | Database Operations | Output |
|-----------------|---------------|------------------|-------------|------------------------|--------|
| Registration/Login | Sign up, log in | Authenticate, issue JWT | — | Create/read `users` | Authenticated session |
| Profile Setup | Enter profile details | Persist profile | — | Write `learner_profiles` | Learner profile created |
| Skill Assessment | Perform sample signs | Present diagnostic items | Classify baseline signs | Write `assessment_results` | Baseline level |
| Path Selection | Choose/accept path | Filter catalog | Suggest path | Read `courses`, write `learner_path` | Assigned path |
| Lesson Content | Watch/read content | Stream content, track progress | — | Write `content_progress` | Content marked viewed |
| Camera Practice | Perform sign | Manage capture session | Detect hand, classify gesture | Write `practice_history` | Practice attempt logged |
| Real-Time Feedback | View feedback | Render feedback UI | Generate corrective message | Write `feedback_log` | Feedback shown |
| Quiz/Assessment | Answer/perform items | Score responses | Score sign items | Write `quiz_scores` | Pass/fail result |
| Progress Tracking | View dashboard | Aggregate metrics | Compute analytics | Read/write `progress_tracking` | Progress charts |
| Lesson Unlock | Advance | Verify completion criteria | Recommend next lesson | Read/write `unlocked_lessons` | Next lesson unlocked |
| Gamification | Earn XP/badges | Update XP/streak/leaderboard | — | Write `xp`, `badges`, `streaks` | Gamification state updated |
| Certification | Complete final assessment | Validate mastery criteria | Confirm mastery | Write `certificates` | Certificate issued |

### 11.2 Error Scenario Summary

| Scenario | System Response | Recovery |
|----------|-------------------|----------|
| Camera unavailable | Error message, alternate mode offered | Retry / grant permission |
| Poor lighting | Guidance overlay shown | Retry after adjustment |
| Hand not detected | Positioning guide shown | Retry detection |
| Low confidence prediction | Judgment withheld, retry prompted | Retry / reference video |
| Internet disconnected | Offline banner, local queuing | Auto-sync on reconnect |

---

## 12. Summary

This document defines the complete learning workflow for the AI-Powered Sign Language Learning & Assessment Platform, covering the end-to-end learner journey, mode-specific workflows (new/returning learner, practice, assessment, revision), the AI gesture-recognition pipeline, database interactions, error handling, gamification, and adaptive learning logic. It is intended to guide frontend, backend, and AI-service implementation and to serve as the workflow-design reference within the team's System Architecture and Learner Dashboard documentation.
