from fastapi import APIRouter, HTTPException, status
from schemas.user_schema import UserRegisterRequest, UserLoginRequest, TokenResponse, UserRole

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest):
    """
    Register a new user with Role-Based Access Control (RBAC).
    Supported Roles: LEARNER, INSTRUCTOR, TRAINER, ADMIN
    """
    return TokenResponse(
        access_token="mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        token_type="bearer",
        role=payload.role,
        user_id="usr_001"
    )

@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest):
    """
    Authenticate user and return JWT access token + Role metadata.
    """
    if payload.email == "invalid@example.com":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials"
        )
    return TokenResponse(
        access_token="mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        token_type="bearer",
        role=UserRole.LEARNER,
        user_id="usr_001"
    )
