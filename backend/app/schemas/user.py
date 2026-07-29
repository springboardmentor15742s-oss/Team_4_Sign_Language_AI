from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import LearningLevel, UserRole

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: T | None = None


class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.LEARNER


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime


class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class LearnerProfileBase(BaseModel):
    learning_level: LearningLevel = LearningLevel.BEGINNER
    learning_goal: str | None = Field(default=None, max_length=255)
    preferred_language: str = Field(default="ASL", max_length=50)
    daily_target_mins: int = Field(default=15, ge=5, le=240)
    progress_status: str = Field(default="Not Started", max_length=50)


class LearnerProfileUpdate(BaseModel):
    learning_level: LearningLevel | None = None
    learning_goal: str | None = Field(default=None, max_length=255)
    preferred_language: str | None = Field(default=None, max_length=50)
    daily_target_mins: int | None = Field(default=None, ge=5, le=240)
    progress_status: str | None = Field(default=None, max_length=50)


class LearnerProfileResponse(LearnerProfileBase):
    model_config = ConfigDict(from_attributes=True)

    learner_id: int
    user_id: int
    practice_history: str | None = None
    assessment_history: str | None = None
    updated_at: datetime | None = None
