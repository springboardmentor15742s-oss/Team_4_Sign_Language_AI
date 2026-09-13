-- Pragathi's Team 4 Database Schema (10 Relational Tables with CHECK Constraints)

CREATE TABLE IF NOT EXISTS Users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('LEARNER', 'INSTRUCTOR', 'TRAINER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Learner_Profile (
    learner_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE REFERENCES Users(user_id) ON DELETE CASCADE,
    learning_level VARCHAR(20) DEFAULT 'Beginner' CHECK (learning_level IN ('Beginner', 'Intermediate', 'Advanced')),
    preferred_language VARCHAR(50) DEFAULT 'ASL',
    daily_target_mins INT DEFAULT 15,
    accessibility_needs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Courses (
    course_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    instructor_id VARCHAR(50) REFERENCES Users(user_id),
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Lessons (
    lesson_id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) REFERENCES Courses(course_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    sequence_order INT,
    video_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Practice_History (
    practice_id VARCHAR(50) PRIMARY KEY,
    learner_id VARCHAR(50) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    sign_name VARCHAR(50) NOT NULL,
    accuracy_score FLOAT NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
    duration_seconds INT,
    practiced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Skill_Mastery (
    mastery_id VARCHAR(50) PRIMARY KEY,
    learner_id VARCHAR(50) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    mastery_percentage INT DEFAULT 0 CHECK (mastery_percentage >= 0 AND mastery_percentage <= 100),
    status VARCHAR(30) DEFAULT 'In Progress' CHECK (status IN ('Not Started', 'In Progress', 'Proficient', 'Mastered'))
);

CREATE TABLE IF NOT EXISTS Assessments (
    assessment_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    course_id VARCHAR(50) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Progress_Tracking (
    progress_id VARCHAR(50) PRIMARY KEY,
    learner_id VARCHAR(50) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES Courses(course_id) ON DELETE CASCADE,
    lessons_completed INT DEFAULT 0,
    completion_percentage FLOAT DEFAULT 0.0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Feedback (
    feedback_id VARCHAR(50) PRIMARY KEY,
    learner_id VARCHAR(50) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    gesture_name VARCHAR(50),
    accuracy_percentage FLOAT CHECK (accuracy_percentage >= 0 AND accuracy_percentage <= 100),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    landmark_corrections JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Learning_Goals (
    goal_id VARCHAR(50) PRIMARY KEY,
    learner_id VARCHAR(50) REFERENCES Learner_Profile(learner_id) ON DELETE CASCADE,
    goal_description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    target_date DATE
);
