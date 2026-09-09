from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

router = APIRouter(prefix="/notifications", tags=["Notifications"])

TEMPLATES = [
    {"type":"streak","message":"You're on a 5-day practice streak! Keep it up!","is_read":False},
    {"type":"achievement","message":"Achievement unlocked: First 10 sessions completed!","is_read":False},
    {"type":"reminder","message":"Don't forget your daily practice goal!","is_read":True},
    {"type":"feedback","message":"Great job on Sign B! You achieved 92% accuracy.","is_read":True},
    {"type":"course","message":"New course available: Medical and Emergency Signs","is_read":False},
]

class MarkReadRequest(BaseModel):
    notification_ids: List[str]

@router.get("/{learner_id}", summary="Get notifications for a learner")
def get_notifs(learner_id: str):
    notifs=[{"notification_id":f"n{i+1:03d}","created_at":(datetime.now()-timedelta(hours=i*3)).isoformat(),**t} for i,t in enumerate(TEMPLATES)]
    return {"learner_id":learner_id,"notifications":notifs,"unread_count":sum(1 for n in notifs if not n["is_read"])}

@router.post("/mark-read", summary="Mark notifications as read")
def mark_read(req: MarkReadRequest):
    return {"marked_read":req.notification_ids,"count":len(req.notification_ids),"success":True}

@router.get("/{learner_id}/count", summary="Get unread notification count")
def unread_count(learner_id: str):
    return {"learner_id":learner_id,"unread_count":3}
