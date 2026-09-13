# Database Schema

## AI-Powered Sign Language Learning & Assessment Platform

## Table 1 : Users
| Column Name       |     Data Type     |           Description                               |
|-------------------|-------------------|-----------------------------------------------------|
|   user_id         | INT (Primary Key) | Unique ID for each user                             |
| full_name         |   VARCHAR(100)    | Full name of the user                               |
|    email          |   VARCHAR(150)    | Email address of the user                           |
|  hashed_password  |   VARCHAR(255)    | Stores the user's encrypted password                |
|    role           |   VARCHAR(50)     | User role(Learner,Instructor,Trainer,Administrator) |
| created_at        |   DATETIME        | Date and Time when the account was created          |


## Table 2 : Learner_Profile
| Column Name         |     Data Type     |                    Description                            |
|-----------------------|-------------------|-----------------------------------------------------------|
| learner_id           | INT (Primary Key) | Unique ID for each learner                                |
| user_id              | INT (Foreign Key) | References the user in the Users table                    |
| learning_level       | VARCHAR(50)       | Current learning level (Beginner, Intermediate, Advanced) |
| learning_goal        | VARCHAR(255)      | Goal set by the learner                                   |
| preferred_language   | VARCHAR(50)       | Preferred language for learning                           |
| daily_target_mins    | INT               | Daily Target in mins                                      |
| accessibility_needs  | TEXT              | Stores any accessibility accommodations required by the learner (e.g., high-contrast mode, slower playback speed) |
| practice_history     | TEXT              | Stores the learner's practice records (quick-glance summary, not source of truth) |
| assessment_history   | TEXT              | Stores previous assessment records (quick-glance summary, not source of truth) |
| progress_status      | VARCHAR(50)       | Current learning progress of the learner                  |


## Table 3 : Courses
| Column Name |      Data Type    |       Description                  |
|-------------|-------------------|------------------------------------|
| course_id   | INT (Primary Key) | Unique ID for each course          |
| course_name | VARCHAR(100)      | Name of the sign language course   |
| category    | VARCHAR(50)       | Category of the course             |
| description | TEXT              | Detailed description of the course |


## Table 4 : Lessons
|   Column Name  |     Data Type     |                 Description                       |
|----------------|-------------------|---------------------------------------------------|
| lesson_id      | INT (Primary Key) | Unique ID for each lesson                         |
| course_id      | INT (Foreign Key) | References the course to which the lesson belongs |
| lesson_name    | VARCHAR(100)      | Name of the lesson                                |
| lesson_content | TEXT              | Learning content for the lesson                   |
| lesson_order   | INT               | Sequence number of the lesson in the course       |


## Table 5 : Assessments
|   Column Name   |     Data Type     |                Description                      |
|-----------------|-------------------|-------------------------------------------------|
| assessment_id   | INT (Primary Key) | Unique ID for each assessment                   |
| learner_id      | INT (Foreign Key) | References the learner taking the assessment    |
| score           | DECIMAL(5,2)      | Score obtained in the assessment                |
| assessment_date | DATE              | Date on which the assessment was taken          |
| completed_at    | DATETIME          | Date and time when the assessment was completed |
| status          | VARCHAR(50)       | Assessment status (Completed, Pending, Failed)  |


## Table 6 : Progress_Tracking
|      Column Name      |      Data Type    |                      Description                       |
|-----------------------|-------------------|--------------------------------------------------------|
| progress_id           | INT (Primary Key) | Unique ID for each progress record                     |
| learner_id            | INT (Foreign Key) | References the learner whose progress is being tracked |
| course_id             | INT (Foreign Key) | References the course being tracked                    |
| completion_percentage | DECIMAL(5,2)      | Percentage of the course completed by the learner      |
| last_updated          | DATETIME          | Date and time when the progress was last updated       |


## Table 7 : Feedback
_(Course-level feedback from a learner — not to be confused with AI_Practice_Feedback, Table 11, which is AI-generated gesture correction data.)_

|  Column Name |     Data Type     |                   Description                     |
|--------------|-------------------|---------------------------------------------------|
| feedback_id  | INT (Primary Key) | Unique ID for each feedback                       |
| learner_id   | INT (Foreign Key) | References the learner providing feedback         |
| course_id    | INT (Foreign Key) | References the course for which feedback is given |
| rating       | INT               | Rating given by the learner (1–5)                 |
| comments     | TEXT              | Feedback comments provided by the learner         |
| submitted_at | DATETIME          | Date and time when the feedback was submitted     |


## Table 8 : Learning_Goals

| Column Name | Data Type         |               Description                    |
|-------------|-------------------|------------------------------------------------|
| goal_id     | INT (Primary Key) | Unique ID for each learning goal               |
| learner_id  | INT (Foreign Key) | References the learner in the Learner_Profile table |
| goal_name   | VARCHAR(100)      | Learning goal selected by the learner          |


## Table 9 : Practice_History
_(Milestone 2 update: added predicted_sign, is_correct, and session_id to log results from the AI gesture evaluation endpoint.)_

| Column Name      | Data Type         |                Description                  |
|-------------------|-------------------|---------------------------------------------|
| practice_id       | INT (Primary Key) | Unique ID for each practice session         |
| learner_id        | INT (Foreign Key) | References the learner in the Learner_Profile table |
| sign_name         | VARCHAR(100)      | Name of the sign practiced (target sign)    |
| predicted_sign    | VARCHAR(100)      | Sign predicted by the AI gesture model      |
| accuracy_score    | DECIMAL(5,2)      | Accuracy score achieved                     |
| is_correct        | BOOLEAN           | Whether the predicted sign matched the target sign |
| duration_seconds  | INT               | Practice duration in seconds                |
| session_id        | VARCHAR(100)      | Groups one practice attempt, generated by the frontend |
| status            | VARCHAR(50)       | Practice status (Completed/Failed)          |
| practiced_at      | DATETIME          | Date and time the practice attempt occurred |


## Table 10 : Skill_Mastery
_(Milestone 2 update: added mastery_percentage, calculated as the average of recent accuracy_score values for the same learner and sign.)_

| Column Name         | Data Type         |            Description                      |
|-----------------------|-------------------|---------------------------------------------|
| mastery_id            | INT (Primary Key) | Unique ID for each mastery record           |
| learner_id            | INT (Foreign Key) | References the learner in the Learner_Profile table |
| sign_name             | VARCHAR(100)      | Name of the mastered sign                   |
| accuracy_score        | DECIMAL(5,2)      | Most recent accuracy score achieved         |
| mastery_percentage    | DECIMAL(5,2)      | Average accuracy across recent practice attempts for this sign |
| duration_seconds      | INT               | Time spent practicing                       |
| status                | VARCHAR(50)       | Mastery status (Learning/Mastered/In Progress/Needs Practice) |


## Table 11 : AI_Practice_Feedback  (NEW — Milestone 2)
_(Stores AI-generated correction messages for a single practice attempt. Different from Feedback (Table 7), which is a learner's course review.)_

| Column Name           | Data Type         |            Description                      |
|-------------------------|-------------------|---------------------------------------------|
| feedback_id             | INT (Primary Key) | Unique ID for each AI feedback record       |
| learner_id              | INT (Foreign Key) | References the learner in the Learner_Profile table |
| practice_id             | INT (Foreign Key) | References the practice attempt in Practice_History |
| sign_name               | VARCHAR(100)      | Target sign for this practice attempt       |
| predicted_sign          | VARCHAR(100)      | Sign predicted by the AI gesture model      |
| accuracy_percentage     | DECIMAL(5,2)      | Accuracy percentage for this attempt        |
| corrections             | TEXT              | AI-generated coaching tips (stored as JSON/text list) |
| created_at              | DATETIME          | Date and time the feedback was generated    |


## Table 12 : Quiz_Scores  (NEW — Milestone 2)
_(Stores results from the 60-second Speed Quiz.)_

| Column Name         | Data Type         |            Description                      |
|-----------------------|-------------------|---------------------------------------------|
| quiz_score_id         | INT (Primary Key) | Unique ID for each quiz attempt             |
| learner_id            | INT (Foreign Key) | References the learner in the Learner_Profile table |
| session_id            | VARCHAR(100)      | Quiz/session identifier from the frontend   |
| total_questions       | INT               | Total number of questions in the quiz       |
| correct_answers       | INT               | Number of correctly answered questions      |
| score_percentage      | DECIMAL(5,2)      | (correct_answers / total_questions) * 100   |
| duration_seconds      | INT               | Duration of the quiz, fixed at 60 seconds   |
| completed_at          | DATETIME          | Date and time the quiz was completed        |


## Database Relationships

- Users → Learner_Profile (One-to-One)
- Learner_Profile → Learning_Goals (One-to-Many)
- Learner_Profile → Practice_History (One-to-Many)
- Learner_Profile → Skill_Mastery (One-to-Many)
- Courses → Lessons (One-to-Many)
- Learner_Profile → Assessments (One-to-Many)
- Learner_Profile → Progress_Tracking (One-to-Many)
- Courses → Feedback (One-to-Many)
- Learner_Profile → Feedback (One-to-Many)
- Learner_Profile → AI_Practice_Feedback (One-to-Many) — **NEW, Milestone 2**
- Practice_History → AI_Practice_Feedback (One-to-Many) — **NEW, Milestone 2**
- Learner_Profile → Quiz_Scores (One-to-Many) — **NEW, Milestone 2**


## ER_diagram

![ER Diagram](ER_Diagram.png)

## Conclusion

The updated database schema provides a well-organized structure for the AI-Powered Sign Language Learning & Assessment Platform. It supports user authentication, multiple user roles, learner profile management, learning goals, AI-based practice tracking, AI gesture feedback, speed quiz scoring, assessments, progress tracking, courses, lessons, and feedback. The use of Primary Keys and Foreign Keys ensures proper relationships between tables and maintains data accuracy. This design is scalable, easy to maintain, and provides a strong foundation for future development of the platform.