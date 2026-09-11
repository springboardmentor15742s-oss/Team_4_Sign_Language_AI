"""
SignLearn AI -- AI Evaluate & Real Capture Router (111-Feature Spatial & Kinetic)
POST /api/ai/evaluate
POST /api/ai/record-capture
"""

import os, sys, json, pickle, math, random
from datetime import datetime
import numpy as np
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union

router = APIRouter(prefix="/api/ai", tags=["AI Evaluate"])

BASE      = Path(__file__).parent.parent
REPO_ROOT = BASE.parent
sys.path.insert(0, str(REPO_ROOT))

_cfg_path = BASE / "ml_config.json"
_pkl_path = BASE / "models" / "sign_classifier.pkl"
REAL_CAPTURES_DIR = REPO_ROOT / "ml" / "real_captures"
REAL_CAPTURES_DIR.mkdir(parents=True, exist_ok=True)

try:
    from ml.feature_extractor import extract_features
except ImportError:
    extract_features = None

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
print(f"[ai_evaluate] ML model: {'LOADED (111-feature ' + _BUNDLE.get('best_model', 'MLP') + ')' if _ML_AVAILABLE else 'NOT FOUND - geometric fallback active'}")

TIP      = [4, 8,  12, 16, 20]
PIP      = [3, 7,  11, 15, 19]
MCP      = [2, 6,  10, 14, 18]
BASE_IDX = [1, 5,  9,  13, 17]

class EvaluateRequest(BaseModel):
    landmarks:   Union[List[List[float]], List[List[List[float]]]]
    target_sign: str
    hand:        Optional[str] = "right"

class EvaluateResponse(BaseModel):
    predicted_sign: str
    confidence:     float
    is_correct:     bool
    feedback:       str
    source:         str

class RecordCaptureRequest(BaseModel):
    landmarks:   Union[List[List[float]], List[List[List[float]]]]
    target_sign: str
    subject:     Optional[str] = "Ankur"
    trial:       Optional[int] = None

class RecordCaptureResponse(BaseModel):
    status:      str
    filename:    str
    saved_path:  str
    sign:        str
    subject:     str
    trial:       int
    total_real_captures: int

def _dist(a, b):
    return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def _is_extended(lm, tip_i, pip_i):
    return _dist(lm[0], lm[tip_i]) > _dist(lm[0], lm[pip_i]) * 1.15

def _geo_predict(lm, target):
    if len(lm) != 21:
        return "UNKNOWN", 10.0
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
        return target.upper(), 85.0
    for sign, rule in RULES.items():
        if rule:
            return sign, 58.0
    return "UNKNOWN", 15.0

PASS_MSG = [
    "Great job! Sign detected correctly.",
    "Excellent! Clean hand shape verified.",
    "Perfect execution!",
    "Sign recognized with high confidence."
]
FAIL_MSG = [
    "Check your finger positions carefully.",
    "Ensure your hand is facing the camera with proper lighting.",
    "Hold the sign steady and retry.",
    "Adjust your thumb and finger extension."
]

def _fb(correct, conf):
    msg = random.choice(PASS_MSG if correct else FAIL_MSG)
    if conf < 60:
        msg += " (Confidence is borderline -- check hand framing.)"
    return msg

@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_sign(req: EvaluateRequest):
    lm_data = req.landmarks
    if isinstance(lm_data[0][0], list):
        sample_lm = lm_data[len(lm_data)//2]
    else:
        sample_lm = lm_data

    if len(sample_lm) != 21:
        raise HTTPException(400, f"Expected 21 landmarks per frame, got {len(sample_lm)}")

    target = req.target_sign.upper().strip()
    thr    = _CONFIG.get("pass_threshold", 0.75) * 100
    ml_thr = _CONFIG.get("ml_confidence_threshold", 0.60) * 100
    ml_w   = _CONFIG.get("ml_weight", 0.70)
    geo_w  = _CONFIG.get("geometric_weight", 0.30)

    geo_sign, geo_conf = _geo_predict(sample_lm, target)

    if not _ML_AVAILABLE or extract_features is None:
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(
            predicted_sign=geo_sign,
            confidence=round(geo_conf, 1),
            is_correct=ok,
            feedback=_fb(ok, geo_conf),
            source="geometric"
        )

    try:
        feats = extract_features(lm_data).reshape(1, -1)
        scaled = _BUNDLE["scaler"].transform(feats)
        proba  = _BUNDLE["model"].predict_proba(scaled)[0]
        ci     = int(np.argmax(proba))
        ml_conf = float(proba[ci]) * 100.0
        ml_sign = _BUNDLE["label_encoder"].inverse_transform([ci])[0]

        if ml_conf >= ml_thr:
            ens_conf = ml_w * ml_conf + geo_w * geo_conf
            pred = ml_sign
            src  = "ensemble_ml_lead"
        else:
            ens_conf = 0.4 * ml_conf + 0.6 * geo_conf
            pred = geo_sign if geo_conf > ml_conf else ml_sign
            src  = "geometric_tiebreak"

        ok = (pred == target) and ens_conf >= thr
        return EvaluateResponse(
            predicted_sign=pred,
            confidence=round(ens_conf, 1),
            is_correct=ok,
            feedback=_fb(ok, ens_conf),
            source=src
        )
    except Exception:
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(
            predicted_sign=geo_sign,
            confidence=round(geo_conf, 1),
            is_correct=ok,
            feedback=_fb(ok, geo_conf),
            source="geometric_fallback"
        )

@router.post("/record-capture", response_model=RecordCaptureResponse)
async def record_capture(req: RecordCaptureRequest):
    """
    Saves genuine webcam landmark captures directly from the client.
    Stores files as ml/real_captures/<sign>_<subject>_<trial>.json
    """
    sign = req.target_sign.upper().strip()
    subject = "".join(c for c in req.subject if c.isalnum() or c in ("_", "-")).strip() or "Anonymous"
    
    # Determine trial number
    if req.trial is not None and req.trial > 0:
        trial = req.trial
    else:
        existing = list(REAL_CAPTURES_DIR.glob(f"{sign}_{subject}_*.json"))
        trial = len(existing) + 1

    fname = f"{sign}_{subject}_{trial}.json"
    target_file = REAL_CAPTURES_DIR / fname

    capture_record = {
        "sign": sign,
        "subject": subject,
        "trial": trial,
        "timestamp": datetime.now().isoformat(),
        "source": "webcam_live_mediapipe",
        "landmarks": req.landmarks,
    }

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(capture_record, f, indent=2)

    # Also mirror to team_master if present
    tm_target = REPO_ROOT / "team_master" / "ml" / "real_captures" / fname
    try:
        tm_target.parent.mkdir(parents=True, exist_ok=True)
        with open(tm_target, "w", encoding="utf-8") as f:
            json.dump(capture_record, f, indent=2)
    except Exception:
        pass

    total_count = len(list(REAL_CAPTURES_DIR.glob("*.json")))
    print(f"[record_capture] Saved genuine webcam capture: {fname} (Total real captures: {total_count})")

    return RecordCaptureResponse(
        status="saved",
        filename=fname,
        saved_path=str(target_file),
        sign=sign,
        subject=subject,
        trial=trial,
        total_real_captures=total_count
    )
