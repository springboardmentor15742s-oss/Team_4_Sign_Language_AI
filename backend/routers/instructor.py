"""Milestone 3 - Instructor Dashboard Router"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import hashlib, random
from datetime import datetime, timedelta

router = APIRouter(prefix="/instructor", tags=["Instructor Dashboard"])

MOCK_LEARNERS = [
    {"learner_id":"l001","name":"Priya Sharma","email":"priya@example.com","level":"Beginner","total_sessions":24,"avg_accuracy":72.4,"streak_days":5,"mastered_signs":8},
    {"learner_id":"l002","name":"Rahul Mehta","email":"rahul@example.com","level":"Intermediate","total_sessions":41,"avg_accuracy":84.1,"streak_days":12,"mastered_signs":17},
    {"learner_id":"l003","name":"Sneha Patel","email":"sneha@example.com","level":"Beginner","total_sessions":15,"avg_accuracy":61.3,"streak_days":2,"mastered_signs":4},
    {"learner_id":"l004","name":"Aditya Kumar","email":"aditya@example.com","level":"Advanced","total_sessions":89,"avg_accuracy":91.7,"streak_days":21,"mastered_signs":24},
    {"learner_id":"l005","name":"Meera Nair","email":"meera@example.com","level":"Intermediate","total_sessions":33,"avg_accuracy":77.8,"streak_days":7,"mastered_signs":13},
    {"learner_id":"l006","name":"Vikram Singh","email":"vikram@example.com","level":"Beginner","total_sessions":9,"avg_accuracy":55.2,"streak_days":1,"mastered_signs":2},
    {"learner_id":"l007","name":"Ananya Iyer","email":"ananya@example.com","level":"Advanced","total_sessions":102,"avg_accuracy":94.3,"streak_days":30,"mastered_signs":26},
    {"learner_id":"l008","name":"Karan Gupta","email":"karan@example.com","level":"Intermediate","total_sessions":48,"avg_accuracy":80.5,"streak_days":9,"mastered_signs":15},
]

SIGNS = ['A','B','C','D','E','F','HELLO','THANK_YOU']

class CourseCreate(BaseModel):
    title: str
    description: str
    level: str
    category: str

@router.get("/learners", summary="Get all learners with stats")
def get_learners(level: Optional[str] = None):
    data = MOCK_LEARNERS
    if level and level != "All":
        data = [l for l in data if l["level"] == level]
    return {"learners": data, "total": len(data)}

@router.get("/learner/{learner_id}/history", summary="Get learner practice history")
def get_learner_history(learner_id: str):
    random.seed(int(hashlib.md5(learner_id.encode()).hexdigest(), 16) % 9999)
    sessions = []
    for i in range(10):
        sign = random.choice(SIGNS)
        acc = round(random.uniform(45, 98), 1)
        dt = datetime.now() - timedelta(days=i, hours=random.randint(0,8))
        sessions.append({"session_id": f"s{i+1:03d}","sign_name": sign,
                         "accuracy": acc,"is_correct": acc >= 75,
                         "practiced_at": dt.isoformat(),"duration_seconds": random.randint(15,60)})
    random.seed()
    return {"learner_id": learner_id, "sessions": sessions}

@router.get("/stats", summary="Platform-wide statistics")
def get_platform_stats():
    return {
        "total_learners": 247,
        "active_today": 38,
        "avg_platform_accuracy": 76.4,
        "most_practiced_sign": "A",
        "total_sessions_today": 183,
        "total_sessions_all_time": 12847,
        "avg_session_duration_mins": 8.3,
    }

@router.post("/course", summary="Create a new course")
def create_course(course: CourseCreate):
    cid = f"c{hashlib.md5(course.title.encode()).hexdigest()[:6]}"
    return {"success": True, "course_id": cid, "title": course.title,
            "message": f"Course '{course.title}' created successfully"}
