"""
SignLearn AI -- AI Evaluate Router (Enhanced with ML + Ensemble)
POST /api/ai/evaluate
"""

import os, json, pickle, math, random
import numpy as np
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["AI Evaluate"])

BASE      = Path(__file__).parent.parent
_cfg_path = BASE / "ml_config.json"
_pkl_path = BASE / "models" / "sign_classifier.pkl"

def _load_config():
    if _cfg_path.exists():
        with open(_cfg_path) as f:
            return json.load(f)
    return {"pass_threshold":0.75,"ml_confidence_threshold":0.60,
            "geometric_weight":0.30,"ml_weight":0.70}

def _load_bundle():
    if _pkl_path.exists():
        with open(_pkl_path,"rb") as f:
            return pickle.load(f)
    return None

_CONFIG       = _load_config()
_BUNDLE       = _load_bundle()
_ML_AVAILABLE = _BUNDLE is not None
print(f"[ai_evaluate] ML model: {'LOADED' if _ML_AVAILABLE else 'NOT FOUND - geometric fallback active'}")

TIP      = [4, 8,  12, 16, 20]
PIP      = [3, 7,  11, 15, 19]
MCP      = [2, 6,  10, 14, 18]
BASE_IDX = [1, 5,  9,  13, 17]

class EvaluateRequest(BaseModel):
    landmarks:   List[List[float]]
    target_sign: str
    hand:        Optional[str] = "right"

class EvaluateResponse(BaseModel):
    predicted_sign: str
    confidence:     float
    is_correct:     bool
    feedback:       str
    source:         str

def _dist(a, b):
    return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def _is_extended(lm, tip_i, pip_i):
    return _dist(lm[0], lm[tip_i]) > _dist(lm[0], lm[pip_i]) * 1.15

def _geo_predict(lm, target):
    ext = [_is_extended(lm, TIP[i], PIP[i]) for i in range(5)]
    th, idx, mid, rng, pnk = ext
    RULES = {
        "A":  not idx and not mid and not rng and not pnk,
        "B":  not th and idx and mid and rng and pnk,
        "C":  not idx and not mid and not rng and not pnk and not th,
        "D":  idx and not mid and not rng and not pnk,
        "E":  not idx and not mid and not rng and not pnk and not th,
        "F":  not th and not idx and mid and rng and pnk,
        "G":  th and idx and not mid and not rng and not pnk,
        "H":  not th and idx and mid and not rng and not pnk,
        "I":  not th and not idx and not mid and not rng and pnk,
        "J":  not th and not idx and not mid and not rng and pnk,
        "K":  th and idx and mid and not rng and not pnk,
        "L":  th and idx and not mid and not rng and not pnk,
        "M":  not th and not idx and not mid and not rng and not pnk,
        "N":  not th and not idx and not mid and not rng and not pnk,
        "O":  not idx and not mid and not rng and not pnk,
        "R":  not th and idx and mid and not rng and not pnk,
        "S":  not th and not idx and not mid and not rng and not pnk,
        "U":  not th and idx and mid and not rng and not pnk,
        "V":  not th and idx and mid and not rng and not pnk,
        "W":  not th and idx and mid and rng and not pnk,
        "X":  not th and idx and not mid and not rng and not pnk,
        "Y":  th and not idx and not mid and not rng and pnk,
        "HELLO":    idx and mid and rng and pnk,
        "THANK_YOU":idx and mid and rng and pnk,
        "PLEASE":   idx and mid and rng and pnk,
        "YES":      not idx and not mid and not rng and not pnk,
        "NO":       not th and idx and mid and not rng and not pnk,
        "HELP":     th and not idx and not mid and not rng and not pnk,
        "LOVE":     not idx and not mid and not rng and not pnk,
        "SORRY":    not idx and not mid and not rng and not pnk,
        "GOOD":     idx and mid and rng and pnk,
        "STOP":     idx and mid and rng and pnk,
        "WATER":    not th and idx and mid and rng and not pnk,
        "NAMASTE":  idx and mid and rng and pnk,
        "PEACE":    not th and idx and mid and not rng and not pnk,
    }
    matched = RULES.get(target.upper(), False)
    if matched:
        return target.upper(), 83.0
    for sign, rule in RULES.items():
        if rule:
            return sign, 55.0
    return "UNKNOWN", 12.0

def _extract_features(lm_list):
    lm = np.array(lm_list, dtype=np.float32)
    raw = lm.flatten()
    wrist = lm[0]
    extras = []
    for tip_i, pip_i in zip(TIP, PIP):
        d_tip = np.linalg.norm(lm[tip_i]-wrist)+1e-6
        d_pip = np.linalg.norm(lm[pip_i]-wrist)+1e-6
        extras.append(d_tip/d_pip)
    tip_vecs = [lm[t]-lm[b] for t,b in zip(TIP, BASE_IDX)]
    for ai in range(4):
        u,v = tip_vecs[ai], tip_vecs[ai+1]
        cos_a = np.dot(u,v)/(np.linalg.norm(u)*np.linalg.norm(v)+1e-6)
        extras.append(float(np.clip(cos_a,-1.0,1.0)))
    v1 = lm[MCP[1]]-wrist; v2 = lm[MCP[4]]-wrist
    normal = np.cross(v1,v2)
    extras.extend((normal/(np.linalg.norm(normal)+1e-6)).tolist())
    tips = [lm[t] for t in TIP]
    for a in range(5):
        for b in range(a+1,5):
            extras.append(float(np.linalg.norm(tips[a]-tips[b])))
    return np.array(list(raw)+extras, dtype=np.float32).reshape(1,-1)

PASS_MSG = ["Great job! Sign detected correctly.",
            "Excellent! Keep it up.", "Perfect sign shape!"]
FAIL_MSG = ["Try adjusting your finger positions.",
            "Check the finger extension carefully.",
            "Keep your hand steady and retry."]

def _fb(correct, conf):
    msg = random.choice(PASS_MSG if correct else FAIL_MSG)
    if conf < 60:
        msg += " (Low confidence -- ensure good lighting.)"
    return msg

@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_sign(req: EvaluateRequest):
    if len(req.landmarks) != 21:
        raise HTTPException(400, f"Expected 21 landmarks, got {len(req.landmarks)}")
    lm     = req.landmarks
    target = req.target_sign.upper().strip()
    thr    = _CONFIG.get("pass_threshold", 0.75) * 100
    ml_thr = _CONFIG.get("ml_confidence_threshold", 0.60) * 100
    ml_w   = _CONFIG.get("ml_weight", 0.70)
    geo_w  = _CONFIG.get("geometric_weight", 0.30)

    geo_sign, geo_conf = _geo_predict(lm, target)

    if not _ML_AVAILABLE:
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(predicted_sign=geo_sign,
            confidence=round(geo_conf,1), is_correct=ok,
            feedback=_fb(ok, geo_conf), source="geometric")
    try:
        feats  = _extract_features(lm)
        scaled = _BUNDLE["scaler"].transform(feats)
        proba  = _BUNDLE["model"].predict_proba(scaled)[0]
        ci     = int(np.argmax(proba))
        ml_conf = float(proba[ci]) * 100.0
        ml_sign = _BUNDLE["label_encoder"].inverse_transform([ci])[0]

        if ml_conf >= ml_thr:
            ens_conf = ml_w*ml_conf + geo_w*geo_conf
            pred = ml_sign; src = "ensemble"
        else:
            ens_conf = 0.5*ml_conf + 0.5*geo_conf
            pred = geo_sign if geo_conf > ml_conf else ml_sign
            src  = "geometric_tiebreak"

        ok = (pred == target) and ens_conf >= thr
        return EvaluateResponse(predicted_sign=pred,
            confidence=round(ens_conf,1), is_correct=ok,
            feedback=_fb(ok, ens_conf), source=src)
    except Exception:
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(predicted_sign=geo_sign,
            confidence=round(geo_conf,1), is_correct=ok,
            feedback=_fb(ok, geo_conf), source="geometric_fallback")
