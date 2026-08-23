from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class UserRole(str, Enum):
    LEARNER = "LEARNER"
    INSTRUCTOR = "INSTRUCTOR"
    TRAINER = "TRAINER"
    ADMIN = "ADMIN"

class UserRegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: UserRole = UserRole.LEARNER
    learning_level: Optional[str] = "Beginner"
    preferred_language: Optional[str] = "ASL (American Sign Language)"
    learning_goals: Optional[List[str]] = []

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: str

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: UserRole
    learning_level: str
    preferred_language: str
    daily_target_mins: int
    accessibility_needs: Optional[str]
    learning_goals: List[str]
