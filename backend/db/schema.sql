-- SignLearn AI PostgreSQL Schema — see backend/db/ for full models
-- Run: psql -U postgres -d signlearn -f schema.sql
CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, full_name TEXT, email TEXT UNIQUE, role TEXT DEFAULT 'LEARNER', xp INTEGER DEFAULT 0, streak_days INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS practice_sessions (id UUID PRIMARY KEY, user_id UUID, sign_name TEXT, accuracy DECIMAL, passed BOOLEAN, hand_count INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS sign_mastery (user_id UUID, sign_name TEXT, mastery_pct INTEGER DEFAULT 0, PRIMARY KEY(user_id, sign_name));
CREATE TABLE IF NOT EXISTS goals (id UUID PRIMARY KEY, user_id UUID, title TEXT, target_pct INTEGER, current_pct INTEGER, done BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS courses (id UUID PRIMARY KEY, title TEXT, level TEXT, category TEXT, created_by UUID);
CREATE TABLE IF NOT EXISTS enrollments (user_id UUID, course_id UUID, progress_pct INTEGER DEFAULT 0, PRIMARY KEY(user_id, course_id));
