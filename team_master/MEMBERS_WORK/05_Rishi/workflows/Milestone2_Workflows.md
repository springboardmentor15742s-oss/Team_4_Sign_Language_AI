# Milestone 2 — Sign Language Learning & AI Gesture Workflows
**Author**: Rishi (Workflow & Sequence Architect) | **Team 4 — Infosys Springboard Internship 2026**

---

## 🔄 1. Overview of System Workflows

Milestone 2 introduces three core interactive workflows for the platform:
1. **AI Gesture Practice Session & Evaluation Flow**
2. **Real-Time Automated Feedback & Posture Coaching Loop**
3. **Learner Skill Mastery Recalculation Flow**

---

## 📊 2. Workflow Sequence Diagrams

### Workflow 1: AI Gesture Practice Session & Evaluation Flow
```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner (User)
    participant React as React Frontend Studio
    participant MP as MediaPipe Vision Engine
    participant API as FastAPI Backend (/api/ai/evaluate)
    participant DB as MySQL Database (Practice_History)

    Learner->>React: Select Sign (e.g. 'A') & Start Camera
    React->>MP: Send Video Frames (30 FPS)
    MP-->>React: Extract 21 3D Landmark Coordinates (x,y,z)
    Learner->>React: Click "Evaluate Sign Gesture"
    React->>API: POST /api/ai/evaluate {target_sign, landmarks_flat}
    API->>API: Run 3D Geometric Vector Classifier
    API->>DB: INSERT into Practice_History & AI_Practice_Feedback
    DB-->>API: Confirm Record Creation
    API-->>React: EvaluateResponse {is_correct, accuracy_percentage, corrections}
    React-->>Learner: Render Result Badge (PASS/FAIL) + Coaching Tips
```

### Workflow 2: Automated Feedback Loop & Posture Coaching
```mermaid
sequenceDiagram
    autonumber
    participant Engine as AI Classifier Engine
    participant Feedback as Feedback Generator
    participant UI as Practice Studio UI

    Engine->>Feedback: Calculate Landmark Deviations (Finger flexion, Wrist angle)
    alt Gesture Correct (Accuracy >= 80%)
        Feedback-->>UI: Return Positive Affirmation + Match Score (e.g., 94.2%)
    else Gesture Incorrect (Accuracy < 80%)
        Feedback-->>UI: Return Error Category + Step-by-Step Posture Coaching Tips
    end
```

### Workflow 3: Learner Skill Mastery Recalculation Flow
```mermaid
sequenceDiagram
    autonumber
    participant API as FastAPI Backend
    participant DB as MySQL Database (Skill_Mastery)

    API->>DB: UPDATE Skill_Mastery SET total_attempts = total_attempts + 1
    DB->>DB: Calculate new mastery_percentage = (successful_attempts / total_attempts) * 100
    DB-->>API: Return updated learner profile stats
```
