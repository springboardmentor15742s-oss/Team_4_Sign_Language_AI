-- ============================================================
-- AI-Powered Sign Language Learning & Assessment Platform
-- Database Schema
-- Author: Pragathi (Database Architect) - Team 4
-- Milestone 2 update: added predicted_sign / is_correct / session_id
-- to Practice_History, added mastery_percentage to Skill_Mastery,
-- and added AI_Practice_Feedback + Quiz_Scores tables.
-- ============================================================

-- ------------------------------------------------------------
-- Table 1: Users
-- Stores authentication details and role info for all users
-- ------------------------------------------------------------
CREATE TABLE Users (
    user_id         INT PRIMARY KEY AUTO_INCREMENT,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    hashed_password VARCHAR(255)    NOT NULL,
    role            VARCHAR(50)     NOT NULL CHECK (role IN ('LEARNER','INSTRUCTOR','TRAINER','ADMIN')),
    created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Table 2: Learner_Profile
-- One-to-One with Users. Extra info specific to learners only.
-- ------------------------------------------------------------
CREATE TABLE Learner_Profile (
    learner_id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id             INT             NOT NULL UNIQUE,
    learning_level      VARCHAR(50)     DEFAULT 'Beginner',
    learning_goal       VARCHAR(255),
    preferred_language  VARCHAR(50),
    daily_target_mins   INT             DEFAULT 15,
    accessibility_needs TEXT,           -- e.g. "requires high-contrast mode, slower playback"
    practice_history    TEXT,           -- quick-glance summary/cache, NOT source of truth
    assessment_history  TEXT,           -- quick-glance summary/cache, NOT source of truth
    progress_status     VARCHAR(50)     DEFAULT 'Not Started',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 3: Courses
-- ------------------------------------------------------------
CREATE TABLE Courses (
    course_id   INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100)    NOT NULL,
    category    VARCHAR(50),
    description TEXT
);

-- ------------------------------------------------------------
-- Table 4: Lessons
-- One-to-Many: Courses -> Lessons
-- ------------------------------------------------------------
CREATE TABLE Lessons (
    lesson_id      INT PRIMARY KEY AUTO_INCREMENT,
    course_id      INT             NOT NULL,
    lesson_name    VARCHAR(100)    NOT NULL,
    lesson_content TEXT,
    lesson_order   INT,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 5: Assessments
-- One-to-Many: Learner_Profile -> Assessments
-- ------------------------------------------------------------
CREATE TABLE Assessments (
    assessment_id   INT PRIMARY KEY AUTO_INCREMENT,
    learner_id      INT             NOT NULL,
    score           DECIMAL(5,2),
    assessment_date DATE,
    completed_at    DATETIME,
    status          VARCHAR(50)     DEFAULT 'Pending' CHECK (status IN ('Completed','Pending','Failed')),
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 6: Progress_Tracking
-- One-to-Many: Learner_Profile -> Progress_Tracking
-- Also references Courses
-- ------------------------------------------------------------
CREATE TABLE Progress_Tracking (
    progress_id             INT PRIMARY KEY AUTO_INCREMENT,
    learner_id              INT             NOT NULL,
    course_id               INT             NOT NULL,
    completion_percentage   DECIMAL(5,2)    DEFAULT 0.00,
    last_updated            DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 7: Feedback
-- One-to-Many: Learner_Profile -> Feedback, Courses -> Feedback
-- This is COURSE feedback (learner rates a course) -- NOT the
-- same as AI_Practice_Feedback below (AI corrections on a gesture).
-- ------------------------------------------------------------
CREATE TABLE Feedback (
    feedback_id  INT PRIMARY KEY AUTO_INCREMENT,
    learner_id   INT             NOT NULL,
    course_id    INT             NOT NULL,
    rating       INT             CHECK (rating BETWEEN 1 AND 5),
    comments     TEXT,
    submitted_at DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 8: Learning_Goals
-- References Learner_Profile (learner_id), not Users directly.
-- ------------------------------------------------------------
CREATE TABLE Learning_Goals (
    goal_id     INT PRIMARY KEY AUTO_INCREMENT,
    learner_id  INT             NOT NULL,
    goal_name   VARCHAR(100)    NOT NULL,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 9: Practice_History
-- MILESTONE 2 UPDATE: added predicted_sign, is_correct, session_id
-- so we can log the AI evaluation result from Chinmayee's
-- POST /api/ai/evaluate endpoint.
-- ------------------------------------------------------------
CREATE TABLE Practice_History (
    practice_id       INT PRIMARY KEY AUTO_INCREMENT,
    learner_id         INT             NOT NULL,
    sign_name          VARCHAR(100)    NOT NULL,
    predicted_sign     VARCHAR(100),                      -- NEW: what the AI model predicted
    accuracy_score      DECIMAL(5,2),
    is_correct          BOOLEAN,                            -- NEW: predicted_sign == sign_name
    duration_seconds     INT,
    session_id           VARCHAR(100),                       -- NEW: groups one practice attempt
    status               VARCHAR(50)     CHECK (status IN ('Completed','Failed')),
    practiced_at          DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 10: Skill_Mastery
-- MILESTONE 2 UPDATE: added mastery_percentage, calculated from
-- recent accuracy_score values for the same learner + sign.
-- ------------------------------------------------------------
CREATE TABLE Skill_Mastery (
    mastery_id          INT PRIMARY KEY AUTO_INCREMENT,
    learner_id            INT             NOT NULL,
    sign_name             VARCHAR(100)    NOT NULL,
    accuracy_score         DECIMAL(5,2),
    mastery_percentage      DECIMAL(5,2),                      -- NEW: avg of recent accuracy_score
    duration_seconds         INT,
    status                    VARCHAR(50)     CHECK (status IN ('Learning','Mastered','Needs Practice','In Progress')),
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 11: AI_Practice_Feedback   (NEW IN MILESTONE 2)
-- Stores the AI's correction messages for one practice attempt.
-- Different from Feedback (which is a learner rating a course).
-- ------------------------------------------------------------
CREATE TABLE AI_Practice_Feedback (
    feedback_id           INT PRIMARY KEY AUTO_INCREMENT,
    learner_id              INT             NOT NULL,
    practice_id               INT             NOT NULL,
    sign_name                  VARCHAR(100),
    predicted_sign              VARCHAR(100),
    accuracy_percentage           DECIMAL(5,2),
    corrections                     TEXT,                        -- stored as JSON/text list of tips
    created_at                       DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    FOREIGN KEY (practice_id) REFERENCES Practice_History(practice_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 12: Quiz_Scores   (NEW IN MILESTONE 2)
-- Stores Speed Quiz results (60-second timed quiz).
-- ------------------------------------------------------------
CREATE TABLE Quiz_Scores (
    quiz_score_id       INT PRIMARY KEY AUTO_INCREMENT,
    learner_id             INT             NOT NULL,
    session_id               VARCHAR(100),
    total_questions            INT,
    correct_answers              INT,
    score_percentage               DECIMAL(5,2),
    duration_seconds                 INT             DEFAULT 60,
    completed_at                       DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ============================================================
-- Database Relationships (updated for Milestone 2)
-- ============================================================
-- Users            -> Learner_Profile        (One-to-One)
-- Learner_Profile  -> Learning_Goals         (One-to-Many)
-- Learner_Profile  -> Practice_History       (One-to-Many)
-- Learner_Profile  -> Skill_Mastery          (One-to-Many)
-- Learner_Profile  -> Assessments            (One-to-Many)
-- Learner_Profile  -> Progress_Tracking      (One-to-Many)
-- Learner_Profile  -> Feedback               (One-to-Many)
-- Learner_Profile  -> AI_Practice_Feedback   (One-to-Many)   [NEW]
-- Learner_Profile  -> Quiz_Scores            (One-to-Many)   [NEW]
-- Practice_History -> AI_Practice_Feedback   (One-to-Many)   [NEW]
-- Courses          -> Lessons                (One-to-Many)
-- Courses          -> Progress_Tracking      (One-to-Many)
-- Courses          -> Feedback               (One-to-Many)
-- ============================================================