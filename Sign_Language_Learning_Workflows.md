# Software Engineering Workflow Specification

## Module: Plan Application Workflows (Milestone 2)
*   **Author**: Rishi Kumar (Branch: `Rishi_team4/week2-milestone2`)
*   **Project**: AI-Powered Sign Language Learning & Assessment Platform
*   **Internship**: Team 4 - Infosys Springboard Internship 2026

---

## 1. Introduction & Context

This document specifies the technical sequence flows of the platform's core interactive modules after Phase 1 completion. It maps the runtime interactions between:
*   **Frontend UI Client**: Built in React (Vite), containing webcam view controllers, canvas rendering logic, and local token storage.
*   **MediaPipe Hands SDK**: Loaded directly in the browser's JavaScript environment to extract hand joint coordinates.
*   **FastAPI Backend Service**: Powering authentication and AI gesture evaluation (`POST /api/ai/evaluate`).
*   **MySQL Database Schema**: Storing learner metrics, practice attempts, and test logs.

The goal is to trace the real application flow, incorporating validation states, error recovery paths, and database persistences.

---

## 2. Workflow 1: Live Gesture Practice Flow

### 2.1 Description
This flow captures webcam frames, processes them locally using MediaPipe Hands, streams coordinate metrics to the backend gesture recognition engine, and logs practice attempts in the database upon successful completion.

### 2.2 Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant UI as Frontend UI (PracticeSession.jsx)
    participant MP as MediaPipe Hands (Local)
    participant API as FastAPI Backend (POST /api/ai/evaluate)
    participant Model as Gesture Classifier Model
    participant DB as MySQL Database (Pragathi's Tables)

    Learner->>UI: Open Live Practice Page
    UI->>API: GET /api/ai/supported-signs
    API-->>UI: Return 200 OK (alphabet + dynamic_words lists)
    UI-->>Learner: Render sign selection dropdown
    Learner->>UI: Select sign to practice (e.g. expected_sign = "A")
    UI->>UI: Request webcam access
    Learner->>UI: Approve webcam permission
    UI->>UI: Initialize webcam stream & load MediaPipe Hands model

    loop Frame Capture & Keypoint Extraction (30 FPS)
        UI->>MP: Pass raw video frame
        MP->>MP: Extract 21 hand keypoints (x, y, z coords)
        alt Hand Detected
            MP-->>UI: Return keypoints array (landmarks)
            UI->>UI: Render hand coordinates on HTML5 canvas overlay
        else No Hand Detected
            MP-->>UI: Return empty / undefined
            UI->>UI: Draw dashed placement guide & show warning
        end
    end

    Note over UI, API: Throttle/Debounce API requests (e.g. 500ms intervals)
    UI->>API: POST /api/ai/evaluate (JWT Auth, landmarks_flat, expected_sign="A", session_id, source="webcam")
    API->>API: Validate input (EvaluateRequest schema)
    API->>Model: Run feature extraction and inference
    Model-->>API: Predict sign ("A") + calculate accuracy (e.g. 92.5%)
    API->>API: Evaluate if predicted_sign == expected_sign (is_correct=true)
    API->>API: Generate coaching corrections (Corrections Generator)
    API-->>UI: Return 200 OK (predicted_sign, accuracy_percentage, is_correct, corrections)
    
    UI->>UI: Render Green feedback card & success overlay (accuracy >= 80%)
    UI-->>Learner: Display prediction, accuracy & correction tips

    Note over Learner, UI: Learner holds correct sign for 3 consecutive seconds
    UI->>API: POST /api/practice/save (Persist practice result payload)
    activate API
    API->>DB: Query 1: INSERT INTO Practice_History (learner_id, sign_name, predicted_sign, accuracy_score, is_correct, duration_seconds, session_id, status='Completed')
    DB-->>API: Return practice_id
    API->>DB: Query 3: INSERT INTO AI_Practice_Feedback (learner_id, practice_id, sign_name, predicted_sign, accuracy_percentage, corrections)
    DB-->>API: Success
    API->>DB: Query 2: INSERT/UPDATE Skill_Mastery (Calculate average accuracy from Practice_History for sign "A")
    DB-->>API: Success
    API-->>UI: Return 201 Created (Save confirmation)
    deactivate API
    UI-->>Learner: Award XP, update streak, show celebration badge
```

---

## 3. Workflow 2: Exception Handling & Fault Tolerance Flow

### 3.1 Description
This flow illustrates the recovery mechanism for failure conditions (blocked camera, hand drifting out of frame, bad lighting, model endpoint crashed, and internet drops) ensuring the application maintains responsiveness.

### 3.2 Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant UI as Frontend UI (PracticeSession.jsx)
    participant MP as MediaPipe Hands (Local)
    participant API as FastAPI Backend (POST /api/ai/evaluate)
    participant DB as MySQL Database

    rect rgb(240, 240, 240)
        Note over Learner, UI: Scenario A: Hand Out of Frame / Not Detected
        UI->>MP: Pass camera frame
        MP-->>UI: Return 0 keypoints / Empty coordinates
        UI->>UI: Draw dashed placement guide box on HTML5 canvas overlay
        UI->>UI: Pause API requests to POST /api/ai/evaluate (prevent server overload)
        UI-->>Learner: Show alert card: "Hand out of frame. Please position hand inside camera guide."
    end

    rect rgb(230, 240, 250)
        Note over Learner, UI: Scenario B: Bad Lighting / Low Tracking Confidence
        UI->>MP: Pass dark camera frame
        MP-->>UI: Return low-confidence landmarks (confidence < 40%)
        UI->>UI: Render red dashed guidelines on canvas
        UI-->>Learner: Show overlay toast: "Poor lighting or hand too far. Please adjust room brightness."
        Note over Learner, UI: Alternatively: Backend classifier probability score < 60%
        UI->>API: POST /api/ai/evaluate (landmarks)
        API-->>UI: Return accuracy < 60% or Low confidence error
        UI-->>Learner: Display: "Low accuracy. Keep trying or review lesson video!"
    end

    rect rgb(250, 230, 230)
        Note over Learner, API: Scenario C: API Gateway / Model Server Failure
        UI->>API: POST /api/ai/evaluate (landmarks)
        alt 503 Service Unavailable / Model Crash
            API-->>UI: Return HTTP 503 / 500 (Gesture model loading failed / Database connection timeout)
        else Network Timeout
            API-->>UI: Request timeout
        end
        UI->>UI: Handle error catcher (try-catch block)
        UI->>UI: Keep webcam stream active (do NOT freeze or crash page)
        UI-->>Learner: Show alert card: "AI recognition server is offline. Your progress is temporarily offline."
    end

    rect rgb(255, 245, 230)
        Note over Learner, API: Scenario D: Internet Disconnect / Offline Mode
        UI->>UI: Browser event catches 'offline' (navigator.onLine === false)
        UI->>UI: Switch to Local Practice Mode
        UI-->>Learner: Show banner: "You are offline. Live feedback is active, database sync is paused."
        Learner->>UI: Continues practicing
        UI->>UI: Cache attempt logs locally in localStorage / IndexedDB (session_id, sign_name, duration)
        Note over UI: Internet connection restores (navigator.onLine === true)
        UI->>API: POST /api/practice/sync (Batch upload cached attempts from localStorage)
        API->>DB: Bulk insert cached sessions into Practice_History
        DB-->>API: Success
        API-->>UI: Sync Confirmed
        UI->>UI: Clear browser localStorage buffer
        UI-->>Learner: Toast message: "Back online! Syncing completed practices."
    end
```

---

## 4. Workflow 3: Timed Speed Quiz Flow

### 4.1 Description
This flow details the sequence for the 60-second timed Speed Quiz. During evaluation, all helpful red/green overlays and coaching comments are hidden. Correct answers are tracked on the frontend and persisted directly to the database upon expiration.

### 4.2 Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant UI as Frontend UI (SpeedQuiz.jsx)
    participant MP as MediaPipe Hands (Local)
    participant API as FastAPI Backend (POST /api/ai/evaluate)
    participant Model as Gesture Classifier Model
    participant DB as MySQL Database (Quiz_Scores Table)

    Learner->>UI: Click "Start Speed Quiz"
    UI->>UI: Generate unique quiz session_id
    UI->>UI: Start 60-second countdown timer
    UI->>UI: Reset counters (correct_answers = 0, total_questions = 0)
    
    loop Dynamic Question Loop (Until Timer Reaches 0)
        UI->>UI: Select random sign prompt (e.g. expected_sign = "F")
        UI-->>Learner: Display prompt: "Perform Sign: F" (with progress bar)
        
        loop Capture Gesture Landmarks (Local)
            UI->>MP: Pass raw video frame
            MP-->>UI: Return 21 coordinates (landmarks)
            UI->>UI: Render hand skeleton on canvas overlay (NO green/red correctness lines)
        end
        
        Learner->>UI: Hold gesture to submit answer
        UI->>API: POST /api/ai/evaluate (landmarks_flat, expected_sign="F", session_id, source="webcam")
        API->>Model: Predict sign & calculate accuracy
        Model-->>API: Return results (predicted_sign, accuracy, is_correct)
        API-->>UI: Return 200 OK (predicted_sign, accuracy_percentage, is_correct)
        
        alt Answer Is Correct (is_correct == true)
            UI->>UI: Increment correct_answers by 1
            UI->>UI: Log result (Green marker in timeline - no direct correction text shown)
        else Answer Is Incorrect
            UI->>UI: Log result (Red marker in timeline)
        end
        UI->>UI: Increment total_questions by 1
        UI->>UI: Load next random sign prompt
    end

    Note over UI: Timer expires (reaches 0 seconds)
    UI->>UI: Terminate camera feed & disable input
    UI->>UI: Calculate final score_percentage = (correct_answers / total_questions) * 100
    UI-->>Learner: Render results screen (shows total, correct, percentage score)
    
    UI->>API: POST /api/quiz/submit (learner_id, session_id, total_questions, correct_answers, score_percentage)
    activate API
    API->>DB: Query 4: INSERT INTO Quiz_Scores (learner_id, session_id, total_questions, correct_answers, score_percentage, duration_seconds=60)
    DB-->>API: Success
    API-->>UI: Return 200 OK (Save confirmation + XP awarded)
    deactivate API
    UI-->>Learner: Display: "Score saved! Awarded 30 XP!"
```

---

## 5. Summary Table: API & DB Schema Alignment

The following table summarizes the endpoints and database tables accessed across the 3 workflows, confirming compliance with the design work of other modules:

| Flow Name | API Endpoints Called | DB Tables Modified / Written | Key Stored Query / Operation |
| :--- | :--- | :--- | :--- |
| **1. Live Practice Flow** | `GET /api/ai/supported-signs`<br>`POST /api/ai/evaluate` | `Practice_History`<br>`AI_Practice_Feedback`<br>`Skill_Mastery` | - Query 1: Insert evaluation result<br>- Query 3: Insert AI coaching feedback<br>- Query 2: Recalculate and update skill mastery percentage |
| **2. Exception Handling** | `POST /api/ai/evaluate`<br>`POST /api/practice/sync` (batch offline sync) | `Practice_History`<br>`AI_Practice_Feedback` | - Buffer practice attempts in `localStorage`<br>- Query 1 & Query 3 triggered bulk-wise on reconnection |
| **3. Speed Quiz Flow** | `POST /api/ai/evaluate`<br>`POST /api/quiz/submit` | `Quiz_Scores` | - Query 4: Insert quiz attempt data (scores, questions, 60s quiz length) |
