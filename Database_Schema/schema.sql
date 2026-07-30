-- ============================================================
-- AI-Powered Sign Language Learning & Assessment Platform
-- Database Schema
-- Author: Pragathi (Database Architect) - Team 4
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
-- FIXED: now references Learner_Profile (learner_id), not Users directly.
-- Reason: goals are a learner-specific concept, consistent with
-- Assessments / Progress_Tracking / Feedback.
-- ------------------------------------------------------------
CREATE TABLE Learning_Goals (
    goal_id     INT PRIMARY KEY AUTO_INCREMENT,
    learner_id  INT             NOT NULL,
    goal_name   VARCHAR(100)    NOT NULL,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 9: Practice_History
-- FIXED: now references Learner_Profile (learner_id), not Users directly.
-- Reason: practicing a sign is a learner-only action.
-- ------------------------------------------------------------
CREATE TABLE Practice_History (
    practice_id      INT PRIMARY KEY AUTO_INCREMENT,
    learner_id        INT             NOT NULL,
    sign_name         VARCHAR(100)    NOT NULL,
    accuracy_score    DECIMAL(5,2),
    duration_seconds  INT,
    status            VARCHAR(50)     CHECK (status IN ('Completed','Failed')),
    practiced_at       DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table 10: Skill_Mastery
-- FIXED: now references Learner_Profile (learner_id), not Users directly.
-- Reason: mastering a sign is a learner-only concept.
-- ------------------------------------------------------------
CREATE TABLE Skill_Mastery (
    mastery_id        INT PRIMARY KEY AUTO_INCREMENT,
    learner_id         INT             NOT NULL,
    sign_name          VARCHAR(100)    NOT NULL,
    accuracy_score     DECIMAL(5,2),
    duration_seconds   INT,
    status             VARCHAR(50)     CHECK (status IN ('Learning','Mastered')),
    FOREIGN KEY (learner_id) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE
);

-- ============================================================
-- Database Relationships (updated / standardized)
-- ============================================================
-- Users            -> Learner_Profile     (One-to-One)
-- Learner_Profile  -> Learning_Goals      (One-to-Many)   [FIXED from user_id]
-- Learner_Profile  -> Practice_History    (One-to-Many)   [FIXED from user_id]
-- Learner_Profile  -> Skill_Mastery       (One-to-Many)   [FIXED from user_id]
-- Learner_Profile  -> Assessments         (One-to-Many)
-- Learner_Profile  -> Progress_Tracking   (One-to-Many)
-- Learner_Profile  -> Feedback            (One-to-Many)
-- Courses          -> Lessons             (One-to-Many)
-- Courses          -> Progress_Tracking   (One-to-Many)
-- Courses          -> Feedback            (One-to-Many)
-- ============================================================