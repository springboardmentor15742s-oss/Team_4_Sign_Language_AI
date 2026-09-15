"""
Auth Router — SignLearn AI
Handles user registration, login (returns JWT), and token verification.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth.jwt_handler import create_access_token, decode_token, get_password_hash, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory user store (replace with PostgreSQL in M5)
_USERS: dict = {
    "ankur@signlearn.ai": {
        "id": "user-001",
        "fullName": "Ankur Biswal",
        "email": "ankur@signlearn.ai",
        "password_hash": get_password_hash("password123"),
        "role": "LEARNER",
        "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankur",
        "learningLevel": "Intermediate",
        "preferredLanguage": "ASL",
    }
}

class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    role: str = "LEARNER"
    learningLevel: str = "Beginner"
    preferredLanguage: str = "ASL"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    if req.email in _USERS:
        raise HTTPException(status_code=409, detail="Email already registered")
    import uuid, time
    user_id = f"user-{str(uuid.uuid4())[:8]}"
    user = {
        "id": user_id,
        "fullName": req.fullName,
        "email": req.email,
        "password_hash": get_password_hash(req.password),
        "role": req.role.upper(),
        "avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={req.fullName.replace(' ','')}",
        "learningLevel": req.learningLevel,
        "preferredLanguage": req.preferredLanguage,
        "joinDate": time.strftime("%Y-%m-%d"),
        "xp": 0, "streak": 0, "totalSessions": 0,
    }
    _USERS[req.email] = user
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    token = create_access_token({"sub": user_id, "email": req.email, "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": safe_user}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = _USERS.get(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    token = create_access_token({"sub": user["id"], "email": req.email, "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": safe_user}

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    user = _USERS.get(payload.get("email"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {k: v for k, v in user.items() if k != "password_hash"}

@router.post("/verify")
def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"valid": False}
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    return {"valid": payload is not None, "payload": payload}
