from fastapi import APIRouter
from schemas.user_schema import ProfileResponse, UserRole

router = APIRouter(prefix="/profile", tags=["Learner Profile Management"])

@router.get("/{user_id}", response_model=ProfileResponse)
def get_learner_profile(user_id: str):
    return ProfileResponse(
        id=user_id,
        full_name="Ankur Biswal",
        email="ankurbiswal1968@gmail.com",
        role=UserRole.LEARNER,
        learning_level="Beginner",
        preferred_language="ASL (American Sign Language)",
        daily_target_mins=15,
        accessibility_needs="High contrast visual feedback preferred",
        learning_goals=[
            "Learn ASL Alphabet (A-Z)",
            "Master Everyday Conversation Signs",
            "Prepare for Certification Assessment"
        ]
    )

@router.put("/{user_id}", response_model=ProfileResponse)
def update_learner_profile(user_id: str, payload: ProfileResponse):
    return payload
