"""Pydantic schemas for POST /ai/evaluate (Milestone 2 Task 2)."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class EvaluateRequest(BaseModel):
    """
    Body sent by Ankur's live camera component (Task 1).

    Provide either:
      - `landmarks`: 21 objects `{x,y,z}` or a (21,3) nested list
      - `landmarks_flat`: length-63 float vector
    """

    landmarks: list[Any] | None = None
    landmarks_flat: list[float] | None = Field(
        default=None,
        description="Optional flat 63-float MediaPipe landmark vector",
    )
    expected_sign: str | None = Field(
        default=None,
        description="Target sign for practice/quiz (sets is_correct)",
        max_length=32,
    )
    session_id: str | None = Field(default=None, max_length=64)
    source: Literal["webcam", "upload", "dataset", "test"] = "webcam"

    @field_validator("expected_sign")
    @classmethod
    def normalize_expected(cls, v: str | None) -> str | None:
        return v.strip().upper() if v else v

    @model_validator(mode="after")
    def require_landmarks(self) -> EvaluateRequest:
        if self.landmarks is None and self.landmarks_flat is None:
            raise ValueError("Provide landmarks or landmarks_flat")
        return self


class EvaluateResponse(BaseModel):
    predicted_sign: str
    accuracy_percentage: float
    is_correct: bool
    corrections: list[str]


class EvaluateResponseDetailed(EvaluateResponse):
    """Extended payload for debugging / teammate integration."""

    confidence_top: float | None = None
    model_type: str | None = None
    expected_sign: str | None = None
    session_id: str | None = None
