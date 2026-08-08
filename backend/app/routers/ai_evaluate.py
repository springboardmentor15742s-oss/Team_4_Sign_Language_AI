"""
Milestone 2 Task 2 — AI Gesture Recognition endpoint.

POST /api/ai/evaluate
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.ml.classifier import get_gesture_classifier
from app.ml.corrections import generate_corrections
from app.ml.dataset_loader import dataset_status
from app.ml.features import landmarks_from_payload
from app.schemas.ai_evaluate import EvaluateRequest, EvaluateResponse, EvaluateResponseDetailed

router = APIRouter(prefix="/ai", tags=["AI Gesture Recognition"])

ALPHABET_SIGNS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
DYNAMIC_SIGNS = ["HELLO", "THANK YOU", "YES", "NO", "PLEASE", "SORRY"]


def _resolve_landmarks(payload: EvaluateRequest):
    if payload.landmarks_flat is not None:
        return landmarks_from_payload(payload.landmarks_flat)
    assert payload.landmarks is not None
    return landmarks_from_payload(payload.landmarks)


@router.post(
    "/evaluate",
    response_model=EvaluateResponse,
    summary="Evaluate hand landmarks and predict sign gesture",
)
def evaluate_gesture(payload: EvaluateRequest) -> EvaluateResponse:
    """
    Accept MediaPipe Hands landmarks from the live camera (Task 1),
    run landmark feature extraction + classifier inference, and return
    predicted sign, accuracy %, correctness, and coaching corrections.
    """
    try:
        landmarks = _resolve_landmarks(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    try:
        clf = get_gesture_classifier()
        result = clf.predict_from_landmarks(landmarks, expected_sign=payload.expected_sign)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Gesture model unavailable: {exc}",
        ) from exc

    corrections = generate_corrections(
        landmarks,
        predicted_sign=result["predicted_sign"],
        expected_sign=payload.expected_sign,
        accuracy_percentage=result["accuracy_percentage"],
        is_correct=result["is_correct"],
    )

    return EvaluateResponse(
        predicted_sign=result["predicted_sign"],
        accuracy_percentage=result["accuracy_percentage"],
        is_correct=result["is_correct"],
        corrections=corrections,
    )


@router.post(
    "/evaluate/detailed",
    response_model=EvaluateResponseDetailed,
    summary="Evaluate gesture (detailed debug payload)",
)
def evaluate_gesture_detailed(payload: EvaluateRequest) -> EvaluateResponseDetailed:
    base = evaluate_gesture(payload)
    clf = get_gesture_classifier()
    landmarks = _resolve_landmarks(payload)
    result = clf.predict_from_landmarks(landmarks, expected_sign=payload.expected_sign)
    return EvaluateResponseDetailed(
        **base.model_dump(),
        confidence_top=result.get("confidence_top"),
        model_type=result.get("model_type"),
        sign_name=payload.sign_name,
        expected_sign=payload.expected_sign,
        session_id=payload.session_id,
    )


@router.get("/supported-signs", summary="List signs supported by the practice API")
def supported_signs():
    return {
        "alphabet": ALPHABET_SIGNS,
        "dynamic_words": DYNAMIC_SIGNS,
        "all": ALPHABET_SIGNS + DYNAMIC_SIGNS,
        "note": "The current landmark classifier is optimized for alphabet signs; dynamic words are exposed for UI planning and later sequence-model integration.",
    }


@router.get("/health", summary="AI module + dataset availability")
def ai_module_health():
    clf = get_gesture_classifier()
    return {
        "status": "ok",
        "module": "ai-evaluate",
        "model_loaded": clf.pipeline is not None,
        "model_type": clf.model_type,
        "model_path": str(clf.model_path),
        "datasets": dataset_status(),
    }
