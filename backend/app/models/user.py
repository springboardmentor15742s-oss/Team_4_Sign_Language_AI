from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(str, Enum):
    LEARNER = "Learner"
    INSTRUCTOR = "Instructor"
    TRAINER = "Accessibility Trainer"
    ADMIN = "Administrator"


class LearningLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default=UserRole.LEARNER.value)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    learner_profile: Mapped["LearnerProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    learning_level: Mapped[str] = mapped_column(String(50), default=LearningLevel.BEGINNER.value)
    learning_goal: Mapped[str | None] = mapped_column(String(255), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(50), default="ASL")
    daily_target_mins: Mapped[int] = mapped_column(Integer, default=15)
    practice_history: Mapped[str | None] = mapped_column(Text, nullable=True)
    assessment_history: Mapped[str | None] = mapped_column(Text, nullable=True)
    progress_status: Mapped[str] = mapped_column(String(50), default="Not Started")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped[User] = relationship(back_populates="learner_profile")
