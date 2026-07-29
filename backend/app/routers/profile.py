from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models.user import LearnerProfile, User, UserRole
from app.schemas.user import ApiResponse, LearnerProfileResponse, LearnerProfileUpdate

router = APIRouter(prefix="/profile", tags=["Learner Profile"])


def _to_response(profile: LearnerProfile) -> LearnerProfileResponse:
    return LearnerProfileResponse(
        learner_id=profile.id,
        user_id=profile.user_id,
        learning_level=profile.learning_level,
        learning_goal=profile.learning_goal,
        preferred_language=profile.preferred_language,
        daily_target_mins=profile.daily_target_mins,
        practice_history=profile.practice_history,
        assessment_history=profile.assessment_history,
        progress_status=profile.progress_status,
        updated_at=profile.updated_at,
    )


@router.get("/me", response_model=ApiResponse[LearnerProfileResponse])
def get_my_profile(
    current_user: User = Depends(require_roles(UserRole.LEARNER, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    if profile is None:
        if current_user.role != UserRole.LEARNER.value:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learner profile not found")
        profile = LearnerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return ApiResponse(success=True, message="Learner profile retrieved", data=_to_response(profile))


@router.put("/me", response_model=ApiResponse[LearnerProfileResponse])
def update_my_profile(
    payload: LearnerProfileUpdate,
    current_user: User = Depends(require_roles(UserRole.LEARNER, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    if profile is None:
        profile = LearnerProfile(user_id=current_user.id)
        db.add(profile)
        db.flush()

    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if hasattr(value, "value"):
            value = value.value
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return ApiResponse(success=True, message="Learner profile updated", data=_to_response(profile))


@router.get("/health-check")
def profile_module_health(current_user: User = Depends(get_current_user)):
    return {"status": "ok", "module": "learner-profile", "user_id": current_user.id}
