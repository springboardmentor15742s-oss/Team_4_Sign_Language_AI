from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import hashlib, random
from datetime import datetime, timedelta

router = APIRouter(prefix="/history", tags=["Practice History"])
SIGNS = ['A','B','C','D','E','F','HELLO','THANK_YOU','G','H','I','L']

@router.get("/{learner_id}", summary="Get paginated practice history")
def get_history(learner_id: str, page: int = 1, limit: int = 10):
    random.seed(int(hashlib.md5(learner_id.encode()).hexdigest(),16)%9999)
    entries = []
    for i in range(20):
        sign = random.choice(SIGNS); acc = round(random.uniform(30,98),1)
        dt = datetime.now()-timedelta(days=i//3,hours=random.randint(0,23))
        entries.append({"practice_id":f"p{i+1:03d}","sign_name":sign,"accuracy_score":acc,
                        "is_correct":acc>=75,"practiced_at":dt.isoformat(),"duration_seconds":random.randint(10,90)})
    random.seed()
    s=(page-1)*limit; return {"sessions":entries[s:s+limit],"total":20,"page":page,"total_pages":2}

@router.get("/{learner_id}/stats", summary="Aggregate practice statistics")
def get_stats(learner_id: str):
    s=int(hashlib.md5(learner_id.encode()).hexdigest(),16)%9999
    random.seed(s); signs=random.sample(SIGNS,4); random.seed()
    return {"total_sessions":(s%80)+20,"avg_accuracy":round(60+(s%35),1),"best_sign":signs[0],
            "worst_sign":signs[1],"total_time_mins":((s%80)+20)*8,"pass_rate":round(55+(s%40),1)}

@router.get("/{learner_id}/export", summary="Export history as CSV")
def export_csv(learner_id: str):
    random.seed(int(hashlib.md5(learner_id.encode()).hexdigest(),16)%9999)
    lines=["practice_id,sign_name,accuracy_score,is_correct,practiced_at,duration_seconds"]
    for i in range(20):
        sign=random.choice(SIGNS); acc=round(random.uniform(30,98),1)
        dt=(datetime.now()-timedelta(days=i//3)).strftime("%Y-%m-%d %H:%M")
        lines.append(f"p{i+1:03d},{sign},{acc},{acc>=75},{dt},{random.randint(10,90)}")
    random.seed()
    return {"csv":"\n".join(lines),"filename":f"history_{learner_id}.csv","rows":20}
