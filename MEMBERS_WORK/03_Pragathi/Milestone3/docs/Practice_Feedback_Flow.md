# Milestone 2 — Practice & Feedback Database Schema & Flow Document
**Author**: Pragathi V (Database Architect) | **Team 4 — Infosys Springboard Internship 2026**

---

## 🗄️ 1. Overview of Milestone 2 Database Enhancements

Milestone 2 expands the database layer with two new tables to record real-time MediaPipe AI practice evaluations and deliver automated coaching feedback to learners.

### New Database Tables
1. **`Practice_History`**: Logs every AI practice attempt, including target sign, landmark inputs, accuracy %, and timestamp.
2. **`AI_Practice_Feedback`**: Stores fine-grained error categories, joint landmark deviation JSON payloads, and automated coaching recommendations.

---

## 📐 2. Table Definitions & Schemas

### Table 1: `Practice_History`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `practice_id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each practice evaluation |
| `session_id` | VARCHAR(64) | NOT NULL, INDEX | Session UUID linking practice actions |
| `learner_id` | INT | FOREIGN KEY → Users(user_id) | ID of the practicing learner |
| `sign_id` | INT | FOREIGN KEY → Sign_Catalog(sign_id) | Foreign key to target sign |
| `target_sign` | VARCHAR(16) | NOT NULL | Target gesture name (e.g. 'A', 'B', 'HELLO') |
| `user_gesture_input` | TEXT | NULLABLE | Raw 21-landmark coordinate vector payload |
| `is_correct` | BOOLEAN | NOT NULL | Evaluation outcome (TRUE / FALSE) |
| `accuracy_percentage` | DECIMAL(5,2)| NOT NULL | Gesture accuracy percentage (0.00 to 100.00) |
| `attempt_timestamp` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of attempt |

### Table 2: `AI_Practice_Feedback`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `feedback_id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique feedback log ID |
| `practice_id` | BIGINT | FOREIGN KEY → Practice_History | Associated practice attempt ID |
| `error_category` | VARCHAR(64) | NOT NULL | Category (e.g., 'FINGER_CURL', 'WRIST_ANGLE') |
| `landmark_deviation_json` | JSON | NULLABLE | Joint angle deviation metrics |
| `coaching_recommendation` | TEXT | NOT NULL | Textual coaching tip returned to learner |

---

## ⚡ 3. Core Database SQL Queries (`queries.sql`)

### Query 1: Log Practice Attempt & AI Feedback
```sql
INSERT INTO Practice_History (
    session_id, learner_id, sign_id, target_sign, 
    user_gesture_input, is_correct, accuracy_percentage, attempt_timestamp
) VALUES (
    'sess_1092834', 101, 1, 'A', 
    'MEDIA_PIPE_21_LANDMARKS', TRUE, 94.20, NOW()
);

INSERT INTO AI_Practice_Feedback (
    practice_id, error_category, landmark_deviation_json, coaching_recommendation
) VALUES (
    LAST_INSERT_ID(), 'NONE', 
    '{"wrist_angle": 0.0, "finger_flexion": "OPTIMAL"}', 
    'Hand position matches sign A accurately. Wrist angle and 21 landmark finger joints optimal.'
);
```

### Query 2: Recalculate Skill Mastery Level
```sql
UPDATE Skill_Mastery 
SET 
    total_attempts = total_attempts + 1,
    successful_attempts = successful_attempts + 1,
    mastery_percentage = (successful_attempts + 1) * 100.0 / (total_attempts + 1),
    last_practiced_at = NOW()
WHERE learner_id = 101 AND sign_id = 1;
```

### Query 3: Retrieve Practice History Analytics
```sql
SELECT 
    ph.practice_id, ph.target_sign, ph.is_correct, 
    ph.accuracy_percentage, ph.attempt_timestamp, 
    fb.error_category, fb.coaching_recommendation
FROM Practice_History ph
LEFT JOIN AI_Practice_Feedback fb ON ph.practice_id = fb.practice_id
WHERE ph.learner_id = 101
ORDER BY ph.attempt_timestamp DESC LIMIT 10;
```
