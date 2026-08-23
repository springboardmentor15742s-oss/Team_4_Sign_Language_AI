-- ============================================================
-- SignLearn AI — Team 4 | Complete SQL Queries (Milestones 1-4)
-- Infosys Springboard Internship 2026
-- ============================================================

-- ── Milestone 1 & 2: Core Auth & Practice ────────────────────

-- Register a new user
INSERT INTO Users (user_id, full_name, email, password_hash, role)
VALUES (:user_id, :full_name, :email, :password_hash, 'LEARNER');

-- Create learner profile
INSERT INTO Learner_Profile (learner_id, user_id, learning_level, preferred_language, daily_target_mins)
VALUES (:learner_id, :user_id, 'Beginner', 'ASL', 15);

-- Log a practice session
INSERT INTO Practice_History (practice_id, learner_id, sign_name, accuracy_score, duration_seconds)
VALUES (:practice_id, :learner_id, :sign_name, :accuracy_score, :duration_seconds);

-- Log AI feedback result
INSERT INTO Feedback (feedback_id, learner_id, gesture_name, accuracy_percentage, rating, landmark_corrections)
VALUES (:feedback_id, :learner_id, :gesture_name, :accuracy_pct, :rating, :corrections::jsonb);

-- ── Milestone 3: Progress Tracking ───────────────────────────

-- Get all practice history for a learner (paginated)
SELECT practice_id, sign_name, accuracy_score, duration_seconds, practiced_at
FROM Practice_History
WHERE learner_id = :learner_id
ORDER BY practiced_at DESC
LIMIT :limit OFFSET :offset;

-- Get per-sign mastery averages for a learner
SELECT sign_name,
       ROUND(AVG(accuracy_score)::numeric, 1) AS avg_accuracy,
       COUNT(*) AS total_attempts,
       SUM(CASE WHEN accuracy_score >= 75 THEN 1 ELSE 0 END) AS passes
FROM Practice_History
WHERE learner_id = :learner_id
GROUP BY sign_name
ORDER BY avg_accuracy DESC;

-- Update skill mastery after each session
INSERT INTO Skill_Mastery (mastery_id, learner_id, module_name, mastery_percentage, status)
VALUES (:mastery_id, :learner_id, :module_name, :pct, 'In Progress')
ON CONFLICT (mastery_id) DO UPDATE
SET mastery_percentage = EXCLUDED.mastery_percentage,
    status = CASE WHEN EXCLUDED.mastery_percentage >= 90 THEN 'Mastered'
                  WHEN EXCLUDED.mastery_percentage >= 70 THEN 'Proficient'
                  WHEN EXCLUDED.mastery_percentage >= 10 THEN 'In Progress'
                  ELSE 'Not Started' END;

-- Get learner's current streak (consecutive practice days)
SELECT COUNT(DISTINCT DATE(practiced_at)) AS streak_days
FROM Practice_History
WHERE learner_id = :learner_id
  AND practiced_at >= CURRENT_DATE - INTERVAL '30 days';

-- Get 7-day weekly session activity
SELECT DATE(practiced_at) AS practice_date,
       COUNT(*) AS session_count,
       ROUND(AVG(accuracy_score)::numeric, 1) AS avg_accuracy
FROM Practice_History
WHERE learner_id = :learner_id
  AND practiced_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(practiced_at)
ORDER BY practice_date ASC;

-- Overall learner summary stats
SELECT COUNT(*) AS total_sessions,
       ROUND(AVG(accuracy_score)::numeric, 1) AS avg_accuracy,
       SUM(duration_seconds) / 60 AS total_practice_mins,
       COUNT(DISTINCT sign_name) AS unique_signs_practiced
FROM Practice_History
WHERE learner_id = :learner_id;

-- ── Milestone 3: Courses & Lessons ───────────────────────────

-- Enroll learner in a course
INSERT INTO Progress_Tracking (progress_id, learner_id, course_id, lessons_completed, completion_percentage)
VALUES (:progress_id, :learner_id, :course_id, 0, 0.0)
ON CONFLICT DO NOTHING;

-- Update lesson completion progress
UPDATE Progress_Tracking
SET lessons_completed = :lessons_done,
    completion_percentage = ROUND((:lessons_done::float / :total_lessons) * 100, 1),
    updated_at = NOW()
WHERE learner_id = :learner_id AND course_id = :course_id;

-- Get all enrolled courses with progress for a learner
SELECT c.title, c.category, pt.lessons_completed,
       pt.completion_percentage, pt.updated_at
FROM Progress_Tracking pt
JOIN Courses c ON pt.course_id = c.course_id
WHERE pt.learner_id = :learner_id
ORDER BY pt.updated_at DESC;

-- ── Milestone 3: Learning Goals ───────────────────────────────

-- Add a new learning goal
INSERT INTO Learning_Goals (goal_id, learner_id, goal_description, target_date)
VALUES (:goal_id, :learner_id, :description, :target_date);

-- Mark goal as completed
UPDATE Learning_Goals SET is_completed = TRUE WHERE goal_id = :goal_id;

-- Get all goals for a learner
SELECT goal_id, goal_description, is_completed, target_date
FROM Learning_Goals
WHERE learner_id = :learner_id
ORDER BY is_completed ASC, target_date ASC;

-- ── Milestone 4: Leaderboard ──────────────────────────────────

-- Weekly leaderboard — top 10 by average accuracy
SELECT lp.learner_id, u.full_name,
       ROUND(AVG(ph.accuracy_score)::numeric, 1) AS avg_accuracy,
       COUNT(ph.practice_id) AS total_sessions,
       COUNT(DISTINCT ph.sign_name) AS unique_signs,
       RANK() OVER (ORDER BY AVG(ph.accuracy_score) DESC) AS rank
FROM Practice_History ph
JOIN Learner_Profile lp ON ph.learner_id = lp.learner_id
JOIN Users u ON lp.user_id = u.user_id
WHERE ph.practiced_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY lp.learner_id, u.full_name
ORDER BY avg_accuracy DESC
LIMIT 10;

-- All-time leaderboard by mastered signs count
SELECT lp.learner_id, u.full_name,
       COUNT(DISTINCT CASE WHEN sm.mastery_percentage >= 80 THEN sm.module_name END) AS mastered_signs,
       ROUND(AVG(ph.accuracy_score)::numeric, 1) AS avg_accuracy,
       RANK() OVER (ORDER BY COUNT(DISTINCT CASE WHEN sm.mastery_percentage >= 80 THEN sm.module_name END) DESC) AS rank
FROM Learner_Profile lp
JOIN Users u ON lp.user_id = u.user_id
LEFT JOIN Skill_Mastery sm ON lp.learner_id = sm.learner_id
LEFT JOIN Practice_History ph ON lp.learner_id = ph.learner_id
GROUP BY lp.learner_id, u.full_name
ORDER BY mastered_signs DESC
LIMIT 10;

-- ── Milestone 4: Instructor Analytics ────────────────────────

-- Platform-wide stats for instructor dashboard
SELECT COUNT(DISTINCT lp.learner_id) AS total_learners,
       ROUND(AVG(ph.accuracy_score)::numeric, 1) AS platform_avg_accuracy,
       COUNT(ph.practice_id) AS total_sessions_today,
       MODE() WITHIN GROUP (ORDER BY ph.sign_name) AS most_practiced_sign
FROM Practice_History ph
JOIN Learner_Profile lp ON ph.learner_id = lp.learner_id
WHERE ph.practiced_at >= CURRENT_DATE;

-- Get all learners with their latest stats (instructor view)
SELECT u.full_name, u.email, lp.learning_level,
       COUNT(ph.practice_id) AS total_sessions,
       ROUND(AVG(ph.accuracy_score)::numeric, 1) AS avg_accuracy
FROM Users u
JOIN Learner_Profile lp ON u.user_id = lp.user_id
LEFT JOIN Practice_History ph ON lp.learner_id = ph.learner_id
WHERE u.role = 'LEARNER'
GROUP BY u.full_name, u.email, lp.learning_level
ORDER BY avg_accuracy DESC;
