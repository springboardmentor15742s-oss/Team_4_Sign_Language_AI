from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import LearnerProfile, User, UserRole
from app.schemas.user import (
    ApiResponse,
    TokenData,
    UserLoginRequest,
    UserPublic,
    UserRegisterRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])


def _to_public(user: User) -> UserPublic:
    return UserPublic(
        user_id=user.id,
        name=user.full_name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )


@router.post("/register", response_model=ApiResponse[UserPublic], status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    if len(payload.password) < 8 or not any(c.isalpha() for c in payload.password) or not any(
        c.isdigit() for c in payload.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters and include a letter and a number",
        )

    user = User(
        full_name=payload.name.strip(),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
    )
    db.add(user)
    db.flush()

    if payload.role == UserRole.LEARNER:
        db.add(LearnerProfile(user_id=user.id))

    db.commit()
    db.refresh(user)

    return ApiResponse(success=True, message="User registered successfully", data=_to_public(user))


@router.post("/login", response_model=ApiResponse[TokenData])
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password credentials")

    token = create_access_token(subject=str(user.id), role=user.role)
    return ApiResponse(
        success=True,
        message="Login successful",
        data=TokenData(access_token=token, user=_to_public(user)),
    )


@router.get("/me", response_model=ApiResponse[UserPublic])
def get_me(current_user: User = Depends(get_current_user)):
    return ApiResponse(success=True, message="Current user", data=_to_public(current_user))
