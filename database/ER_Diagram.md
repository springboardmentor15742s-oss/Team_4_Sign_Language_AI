# 🗄️ Pragathi's Database Schema & ER Diagram
**Infosys Springboard Internship 2026 — Team 4**

---

## 📌 Relational Entity Relationship (ER) Diagram

```mermaid
erDiagram
    Users ||--o| Learner_Profiles : "1:1 profile"
    Users ||--o{ Courses : "instructs"
    Learner_Profiles ||--o{ Practice_History : "logs"
    Learner_Profiles ||--o{ Skill_Mastery : "tracks"
    Learner_Profiles ||--o{ Quiz_Scores : "completes"
    Learner_Profiles ||--o{ Certificates : "earns"
    Learner_Profiles ||--o{ AI_Practice_Feedback : "receives"
    Courses ||--o{ Lessons : "contains"
    Courses ||--o{ Assessments : "evaluates"
    Assessments ||--o{ Quiz_Scores : "generates"
    Courses ||--o{ Certificates : "awards"

    Users {
        string user_id PK
        string full_name
        string email UK
        string password_hash
        string role
        timestamp created_at
    }

    Learner_Profiles {
        string learner_id PK
        string user_id FK
        string learning_level
        string preferred_language
        int daily_target_mins
        text accessibility_needs
        jsonb learning_goals
    }

    Courses {
        string course_id PK
        string title
        text description
        string instructor_id FK
        string category
    }

    Lessons {
        string lesson_id PK
        string course_id FK
        string title
        int sequence_order
        string video_url
    }

    Practice_History {
        string practice_id PK
        string learner_id FK
        string sign_name
        float accuracy_score
        int duration_seconds
        timestamp practiced_at
    }

    Skill_Mastery {
        string mastery_id PK
        string learner_id FK
        string module_name
        int mastery_percentage
        string status
    }

    Assessments {
        string assessment_id PK
        string title
        string course_id FK
    }

    Quiz_Scores {
        string score_id PK
        string assessment_id FK
        string learner_id FK
        int score
        boolean passed
    }

    Certificates {
        string certificate_id PK
        string learner_id FK
        string course_id FK
        timestamp issued_at
    }

    AI_Practice_Feedback {
        string feedback_id PK
        string learner_id FK
        string gesture_name
        float accuracy_percentage
        jsonb landmark_corrections
    }
```

---

## 📋 10 Relational Tables Overview

1. **`Users`**: Stores core authentication details and 4 operational roles (`LEARNER`, `INSTRUCTOR`, `TRAINER`, `ADMIN`).
2. **`Learner_Profiles`**: Foreign key linked (`user_id`) storing learning levels, preferred languages, and daily practice targets.
3. **`Courses`**: Course catalog managed by Instructors.
4. **`Lessons`**: Ordered video curriculum modules.
5. **`Practice_History`**: Standardized foreign key (`learner_id`) logging sign gesture practice duration and accuracy.
6. **`Skill_Mastery`**: Tracks module completion percentages and proficiency statuses.
7. **`Assessments`**: Course evaluation assessments.
8. **`Quiz_Scores`**: Stores learner test performance.
9. **`Certificates`**: Verified course completion certificates.
10. **`AI_Practice_Feedback`**: Stores real-time MediaPipe hand landmark feedback and correction data.
