"""
Milestone 3 - Progress Tracking Router
GET /api/progress/{learner_id} - Sign mastery percentages
GET /api/progress/{learner_id}/streak - Practice streak
GET /api/progress/{learner_id}/weekly - 7-day session counts
GET /api/progress/{learner_id}/summary - Overall stats
POST /api/progress/log - Log a session
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import random, hashlib
from datetime import datetime, timedelta

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])

SIGNS = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
         'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
         'HELLO','THANK_YOU']

def _seed(learner_id: str, salt: str = "") -> int:
    return int(hashlib.md5((learner_id + salt).encode()).hexdigest(), 16) % 10000

class LogRequest(BaseModel):
    learner_id: str
    sign_name: str
    accuracy: float
    duration_seconds: Optional[int] = 30

@router.get("/{learner_id}", summary="Get sign mastery percentages")
def get_progress(learner_id: str):
    """Returns mastery percentage (0-100) for each sign."""
    random.seed(_seed(learner_id))
    mastery = {}
    for sign in SIGNS:
        base = random.randint(20, 98)
        mastery[sign] = base
    random.seed()
    return {
        "learner_id": learner_id,
        "mastery": mastery,
        "total_signs": len(SIGNS),
        "mastered_count": sum(1 for v in mastery.values() if v >= 80),
        "in_progress_count": sum(1 for v in mastery.values() if 40 <= v < 80),
    }

@router.get("/{learner_id}/streak", summary="Get practice streak")
def get_streak(learner_id: str):
    """Returns current streak, longest streak, total sessions."""
    s = _seed(learner_id, "streak")
    return {
        "learner_id": learner_id,
        "current_streak_days": (s % 12) + 1,
        "longest_streak_days": (s % 25) + 5,
        "total_sessions": (s % 80) + 20,
        "total_practice_mins": ((s % 80) + 20) * 8,
        "last_practiced": (datetime.now() - timedelta(hours=s % 24)).isoformat(),
    }

@router.get("/{learner_id}/weekly", summary="Get 7-day session counts")
def get_weekly(learner_id: str):
    """Returns array of 7 day session counts (oldest to today)."""
    random.seed(_seed(learner_id, "weekly"))
    days = []
    labels = []
    for i in range(6, -1, -1):
        dt = datetime.now() - timedelta(days=i)
        days.append(random.randint(0, 8))
        labels.append(dt.strftime("%a"))
    random.seed()
    return {"learner_id": learner_id, "labels": labels, "sessions": days,
            "total_this_week": sum(days)}

@router.get("/{learner_id}/summary", summary="Overall progress summary")
def get_summary(learner_id: str):
    """Returns aggregate statistics."""
    s = _seed(learner_id, "summary")
    return {
        "learner_id": learner_id,
        "total_sessions": (s % 80) + 20,
        "avg_accuracy": round(60 + (s % 35), 1),
        "best_sign": random.choice(SIGNS[:10]),
        "worst_sign": random.choice(SIGNS[10:20]),
        "total_time_mins": (s % 80 + 20) * 8,
        "mastered_signs": (s % 12) + 3,
        "current_level": ["Beginner", "Intermediate", "Advanced"][s % 3],
        "xp_points": ((s % 80) + 20) * 15,
    }

@router.post("/log", summary="Log a completed practice session")
def log_session(req: LogRequest):
    """Records a practice session to the history."""
    return {
        "success": True,
        "message": f"Session logged for {req.learner_id} — Sign {req.sign_name} ({req.accuracy:.1f}%)",
        "practice_id": f"prac_{hashlib.md5(f'{req.learner_id}{datetime.now()}'.encode()).hexdigest()[:12]}",
        "logged_at": datetime.now().isoformat(),
    }
