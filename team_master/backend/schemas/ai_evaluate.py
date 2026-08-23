from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field

class LandmarkPoint(BaseModel):
    x: float = Field(..., description="Normalized X coordinate (0.0 to 1.0)")
    y: float = Field(..., description="Normalized Y coordinate (0.0 to 1.0)")
    z: float = Field(default=0.0, description="Normalized Z depth coordinate")

class EvaluateRequest(BaseModel):
    target_sign: Optional[str] = Field(default=None, description="Expected sign letter or word being practiced (e.g. 'A')")
    expected_sign: Optional[str] = Field(default=None, description="Alias for target_sign")
    sign_name: Optional[str] = Field(default=None, description="Alias for target_sign")
    landmarks: Optional[List[LandmarkPoint]] = Field(default=None, description="List of 21 MediaPipe hand landmarks")
    landmarks_flat: Optional[List[float]] = Field(default=None, description="63 flattened landmark float coordinates")
    session_id: Optional[str] = Field(default=None, description="Unique session tracking ID")

class EvaluateResponse(BaseModel):
    predicted_sign: str = Field(..., description="Predicted ASL sign gesture")
    accuracy_percentage: float = Field(..., description="Prediction confidence accuracy percentage (0.0 - 100.0)")
    is_correct: bool = Field(..., description="Whether prediction matches target/expected sign")
    corrections: List[str] = Field(default_factory=list, description="Coaching tips and anatomical hand landmark feedback")

class EvaluateResponseDetailed(EvaluateResponse):
    confidence_top: Optional[float] = Field(default=None)
    model_type: Optional[str] = Field(default="Heuristic & Rule-Based Model")
    sign_name: Optional[str] = Field(default=None)
    expected_sign: Optional[str] = Field(default=None)
    session_id: Optional[str] = Field(default=None)
