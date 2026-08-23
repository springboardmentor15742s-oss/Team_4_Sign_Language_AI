# 📘 API Reference — SignLearn AI
## Complete Endpoint Documentation | Team 4

Base URL (dev): `http://localhost:8000`
Interactive Docs: `http://localhost:8000/docs`
All protected routes require: `Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 Authentication

### POST `/api/auth/register`
Register a new user.
```json
Request:  { "full_name": "Ankur Biswal", "email": "user@email.com", "password": "pass123", "role": "LEARNER" }
Response: { "message": "User registered", "user_id": "uuid" }
```

### POST `/api/auth/login`
```json
Request:  { "email": "user@email.com", "password": "pass123" }
Response: { "access_token": "eyJ...", "token_type": "bearer", "user": { "id", "email", "full_name", "role", "avatar_url" } }
```

### GET `/api/auth/me` 🔒
Returns current authenticated user profile.

---

## 📊 Progress Tracking

### GET `/api/progress/{learner_id}`
Returns sign mastery percentages for all signs.
```json
Response: { "A": 89, "B": 74, "C": 92, ..., "HELLO": 95, "THANK_YOU": 80 }
```

### GET `/api/progress/{learner_id}/streak`
```json
Response: { "current_streak": 6, "longest_streak": 12, "total_sessions": 47 }
```

### POST `/api/progress/log` 🔒
Log a completed practice session.
```json
Request:  { "learner_id": "uuid", "sign_name": "HELLO", "accuracy": 92.5, "duration_seconds": 18 }
Response: { "success": true, "message": "Session logged" }
```

### GET `/api/progress/{learner_id}/weekly`
```json
Response: { "sessions": [3, 5, 2, 7, 4, 6, 4], "days": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] }
```

### GET `/api/progress/{learner_id}/summary`
```json
Response: { "total_signs_practiced": 312, "avg_accuracy": 83.4, "mastered_signs": 18, "signs_in_progress": 7 }
```

---

## 📚 Courses

### GET `/api/courses`
List all 6 available courses.
```json
Response: [ { "id": "c1", "title": "ASL Alphabet Basics", "level": "Beginner", "lessons": 8, "hrs": 3, "instructor": "Dr. Sarah Chen", "color": "#0284C7" }, ... ]
```

### GET `/api/courses/{course_id}`
Single course details.

### GET `/api/courses/{course_id}/lessons`
```json
Response: [ { "lesson_id": 0, "title": "Introduction to ASL", "description": "...", "duration_mins": 12, "video_url": "https://youtube.com/watch?v=tkMg8g8vVUo", "is_completed": false }, ... ]
```

### POST `/api/courses/{course_id}/enroll` 🔒
```json
Request:  { "learner_id": "uuid" }
Response: { "success": true, "message": "Enrolled in ASL Alphabet Basics" }
```

### GET `/api/courses/enrolled/{learner_id}` 🔒
Returns list of enrolled course IDs.

---

## 🤖 AI Evaluation

### POST `/api/ai/evaluate`
Evaluate hand landmarks against a target sign.
```json
Request: {
  "sign": "HELLO",
  "landmarks": [[x,y,z], ...],  // 21 MediaPipe landmarks
  "hand_count": 1
}
Response: {
  "accuracy": 87.3,
  "passed": true,
  "sign": "HELLO",
  "feedback": "Good waving motion detected",
  "model": "geometric"
}
```

### GET `/api/ai/signs`
Returns list of all 60 supported signs with categories.
```json
Response: {
  "ASL Letters": ["A","B","C",...,"Z"],
  "Common Words": ["HELLO","THANK_YOU","PLEASE",...],
  "Two-Hand Signs": ["NAMASTE","PEACE","FRIEND",...]
}
```

---

## 🏆 Leaderboard

### GET `/api/leaderboard/weekly`
```json
Response: [ { "rank": 1, "name": "Ananya Iyer", "mastered": 26, "avg_accuracy": 94, "streak": 30, "is_current_user": false }, ... ]
```

### GET `/api/leaderboard/all-time`
Same structure, all-time stats.

---

## 📜 Practice History

### GET `/api/history/{learner_id}?page=1&limit=20`
Paginated practice log.
```json
Response: {
  "total": 47,
  "page": 1,
  "data": [ { "id": 1, "sign": "HELLO", "accuracy": 94, "passed": true, "date": "2026-08-20", "time": "09:42 AM", "duration_seconds": 18 }, ... ]
}
```

### GET `/api/history/{learner_id}/stats`
```json
Response: { "total_sessions": 47, "pass_rate": 83, "avg_accuracy": 81.2, "most_practiced": "HELLO", "best_sign": "A" }
```

---

## 🎯 Goals

### GET `/api/goals/{learner_id}` 🔒
```json
Response: [ { "id": "uuid", "title": "Master A-Z Alphabet", "progress": 86, "completed": false, "created_at": "2026-08-01" }, ... ]
```

### POST `/api/goals` 🔒
```json
Request:  { "learner_id": "uuid", "title": "Complete Phrases Course", "target_date": "2026-09-01" }
Response: { "id": "uuid", "title": "...", "progress": 0, "completed": false }
```

### PATCH `/api/goals/{goal_id}/complete` 🔒
```json
Response: { "success": true, "message": "Goal marked complete" }
```

---

## 👨‍🏫 Instructor (INSTRUCTOR role required)

### GET `/api/instructor/learners` 🔒
```json
Response: [ { "id": "uuid", "name": "Ananya Iyer", "avg_accuracy": 94, "mastered": 26, "streak": 30, "status": "Active", "last_active": "2h ago" }, ... ]
```

### GET `/api/instructor/learner/{id}/history` 🔒
Returns that learner's full practice history.

### POST `/api/instructor/course` 🔒
Create or update a course.
```json
Request:  { "title": "New Course", "description": "...", "level": "Beginner", "instructor_id": "uuid" }
Response: { "course_id": "c7", "message": "Course created" }
```

### GET `/api/instructor/stats` 🔒
```json
Response: { "total_students": 6, "active_students": 4, "at_risk": 2, "avg_class_accuracy": 83, "total_courses": 4 }
```

---

## 🔔 Notifications

### GET `/api/notifications/{learner_id}` 🔒
```json
Response: [ { "id": "uuid", "type": "streak", "message": "You have a 6-day streak! Keep it up 🔥", "read": false, "created_at": "2026-08-23T10:00:00Z" }, ... ]
```

### POST `/api/notifications/mark-read` 🔒
```json
Request:  { "notification_ids": ["uuid1", "uuid2"] }
Response: { "success": true, "marked": 2 }
```

---

## 👤 Profile

### GET `/api/profile/{learner_id}` 🔒
```json
Response: { "id": "uuid", "full_name": "Ankur Biswal", "email": "...", "role": "LEARNER", "avatar_url": "...", "joined": "2026-08-01", "bio": "ASL enthusiast" }
```

### PATCH `/api/profile/{learner_id}` 🔒
```json
Request:  { "bio": "Updated bio", "avatar_url": "https://..." }
Response: { "success": true, "profile": { ... } }
```

---

## Error Responses

All errors follow this format:
```json
{ "detail": "Error message here", "status_code": 400 }
```

| Code | Meaning |
|---|---|
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing/invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found |
| 422 | Validation Error — check request body |
| 500 | Internal Server Error |

---

*SignLearn AI — Team 4 — Infosys Springboard 2026*
