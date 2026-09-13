from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import hashlib
from datetime import datetime

router = APIRouter(prefix="/goals", tags=["Learning Goals"])

MOCK_GOALS = [
    {"goal_id":"g001","description":"Master all ASL alphabet letters A-Z","is_completed":True,"target_date":"2026-08-15","completed_at":"2026-08-12"},
    {"goal_id":"g002","description":"Practice for 7 consecutive days","is_completed":True,"target_date":"2026-08-20","completed_at":"2026-08-18"},
    {"goal_id":"g003","description":"Achieve 90%+ accuracy on Sign B","is_completed":False,"target_date":"2026-08-30","completed_at":None},
    {"goal_id":"g004","description":"Complete the Common Phrases course","is_completed":False,"target_date":"2026-09-10","completed_at":None},
]

class GoalCreate(BaseModel):
    learner_id: str
    description: str
    target_date: Optional[str] = None

@router.get("/{learner_id}", summary="Get learning goals for a learner")
def get_goals(learner_id: str):
    return {"learner_id": learner_id, "goals": MOCK_GOALS, "total": len(MOCK_GOALS), "completed": sum(1 for g in MOCK_GOALS if g['is_completed'])}

@router.post("", summary="Create a new learning goal")
def create_goal(req: GoalCreate):
    gid = f"g{hashlib.md5(f'{req.learner_id}{req.description}'.encode()).hexdigest()[:6]}"
    return {"goal_id": gid, "learner_id": req.learner_id, "description": req.description, "is_completed": False, "target_date": req.target_date, "created_at": datetime.now().isoformat()}

@router.patch("/{goal_id}/complete", summary="Mark goal as completed")
def complete_goal(goal_id: str):
    return {"goal_id": goal_id, "is_completed": True, "completed_at": datetime.now().isoformat(), "message": "Goal marked complete!"}

@router.delete("/{goal_id}", summary="Delete a goal")
def delete_goal(goal_id: str):
    return {"goal_id": goal_id, "deleted": True, "message": "Goal deleted"}
