"""
SignLearn AI -- AI Evaluate Router (111-Feature Spatial & Kinetic Ensemble)
POST /api/ai/evaluate
"""

import os, sys, json, pickle, math, random
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

try:
    from ml.feature_extractor import extract_features
except ImportError:
    # Standalone fallback if ml package not in path
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
    landmarks:   Union[List[List[float]], List[List[List[float]]]] # (21, 3) or (N_frames, 21, 3)
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
    """Deterministic geometric rule engine fallback."""
    # Ensure 21 landmarks
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
    # Handle single frame vs multi-frame
    if isinstance(lm_data[0][0], list):
        # Multi-frame trajectory: (N_frames, 21, 3)
        sample_lm = lm_data[len(lm_data)//2]
    else:
        # Single frame: (21, 3)
        sample_lm = lm_data

    if len(sample_lm) != 21:
        raise HTTPException(400, f"Expected 21 landmarks per frame, got {len(sample_lm)}")

    target = req.target_sign.upper().strip()
    thr    = _CONFIG.get("pass_threshold", 0.75) * 100
    ml_thr = _CONFIG.get("ml_confidence_threshold", 0.60) * 100
    ml_w   = _CONFIG.get("ml_weight", 0.70)
    geo_w  = _CONFIG.get("geometric_weight", 0.30)

    # 1. Geometric evaluation
    geo_sign, geo_conf = _geo_predict(sample_lm, target)

    # 2. If ML unavailable, return geometric result
    if not _ML_AVAILABLE or extract_features is None:
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(
            predicted_sign=geo_sign,
            confidence=round(geo_conf, 1),
            is_correct=ok,
            feedback=_fb(ok, geo_conf),
            source="geometric"
        )

    # 3. Enhanced 111-Feature ML Prediction with Calibrated Confidence
    try:
        feats = extract_features(lm_data).reshape(1, -1)  # (1, 111)
        scaled = _BUNDLE["scaler"].transform(feats)
        proba  = _BUNDLE["model"].predict_proba(scaled)[0]
        ci     = int(np.argmax(proba))
        ml_conf = float(proba[ci]) * 100.0
        ml_sign = _BUNDLE["label_encoder"].inverse_transform([ci])[0]

        # 4. Ensemble Fusion
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
    except Exception as e:
        # Graceful fallback to geometric
        ok = (geo_sign == target) and geo_conf >= thr
        return EvaluateResponse(
            predicted_sign=geo_sign,
            confidence=round(geo_conf, 1),
            is_correct=ok,
            feedback=_fb(ok, geo_conf),
            source="geometric_fallback"
        )
