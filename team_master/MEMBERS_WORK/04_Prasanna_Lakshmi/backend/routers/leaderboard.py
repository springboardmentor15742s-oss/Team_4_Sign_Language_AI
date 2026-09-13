from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

WEEKLY = [
    {"rank":1,"learner_id":"l007","name":"Ananya Iyer","avatar":"AI","mastered_signs":26,"avg_accuracy":94.3,"streak_days":30,"score":9843,"badge":"Trophy"},
    {"rank":2,"learner_id":"l004","name":"Aditya Kumar","avatar":"AK","mastered_signs":24,"avg_accuracy":91.7,"streak_days":21,"score":9210,"badge":"Silver"},
    {"rank":3,"learner_id":"l002","name":"Rahul Mehta","avatar":"RM","mastered_signs":17,"avg_accuracy":84.1,"streak_days":12,"score":7842,"badge":"Bronze"},
    {"rank":4,"learner_id":"l008","name":"Karan Gupta","avatar":"KG","mastered_signs":15,"avg_accuracy":80.5,"streak_days":9,"score":6930,"badge":""},
    {"rank":5,"learner_id":"l005","name":"Meera Nair","avatar":"MN","mastered_signs":13,"avg_accuracy":77.8,"streak_days":7,"score":6210,"badge":""},
    {"rank":6,"learner_id":"l001","name":"Priya Sharma","avatar":"PS","mastered_signs":8,"avg_accuracy":72.4,"streak_days":5,"score":5180,"badge":""},
    {"rank":7,"learner_id":"l_ankur","name":"Ankur Biswal","avatar":"AB","mastered_signs":11,"avg_accuracy":79.2,"streak_days":6,"score":5840,"badge":""},
    {"rank":8,"learner_id":"l003","name":"Sneha Patel","avatar":"SP","mastered_signs":4,"avg_accuracy":61.3,"streak_days":2,"score":3200,"badge":""},
    {"rank":9,"learner_id":"l_praga","name":"Pragathi V","avatar":"PV","mastered_signs":6,"avg_accuracy":68.9,"streak_days":3,"score":3980,"badge":""},
    {"rank":10,"learner_id":"l006","name":"Vikram Singh","avatar":"VS","mastered_signs":2,"avg_accuracy":55.2,"streak_days":1,"score":1840,"badge":""},
]
ALL_TIME = sorted(WEEKLY, key=lambda x: x["mastered_signs"]*100+x["avg_accuracy"], reverse=True)
for i,e in enumerate(ALL_TIME): ALL_TIME[i] = {**e, "rank": i+1}

@router.get("/weekly", summary="Weekly leaderboard - top 10")
def weekly(): return {"type":"weekly","entries":WEEKLY,"updated_at":datetime.now().isoformat()}

@router.get("/all-time", summary="All-time leaderboard - top 10")
def all_time(): return {"type":"all_time","entries":ALL_TIME,"updated_at":datetime.now().isoformat()}

@router.get("/rank/{learner_id}", summary="Get rank of a specific learner")
def get_rank(learner_id: str):
    e = next((e for e in WEEKLY if e["learner_id"]==learner_id), {"rank":7,"score":5840,"name":"You"})
    return {"learner_id":learner_id,"rank":e["rank"],"score":e["score"],"name":e.get("name","")}
