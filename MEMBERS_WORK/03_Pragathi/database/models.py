"""
SQLAlchemy Models — SignLearn AI
Connect to PostgreSQL: postgresql://user:pass@localhost:5432/signlearn
Set DATABASE_URL environment variable or edit below.
"""
import os
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime
import uuid

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/signlearn")

try:
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    DB_AVAILABLE = True
except Exception as e:
    print(f"Warning: DB not connected ({e}) — using mock data")
    DB_AVAILABLE = False
    engine = None
    SessionLocal = None

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name    = Column(String, nullable=False)
    email        = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role         = Column(String, default="LEARNER")
    avatar_url   = Column(String)
    learning_level = Column(String, default="Beginner")
    xp           = Column(Integer, default=0)
    streak_days  = Column(Integer, default=0)
    created_at   = Column(DateTime, default=datetime.utcnow)
    sessions     = relationship("PracticeSession", back_populates="user")

class PracticeSession(Base):
    __tablename__ = "practice_sessions"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    sign_name    = Column(String, nullable=False)
    accuracy     = Column(Float)
    duration_sec = Column(Integer, default=0)
    passed       = Column(Boolean, default=False)
    hand_count   = Column(Integer, default=1)
    is_dynamic   = Column(Boolean, default=False)
    created_at   = Column(DateTime, default=datetime.utcnow)
    user         = relationship("User", back_populates="sessions")

class SignMastery(Base):
    __tablename__ = "sign_mastery"
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    sign_name    = Column(String, primary_key=True)
    mastery_pct  = Column(Integer, default=0)
    attempts     = Column(Integer, default=0)

def get_db():
    """Dependency for FastAPI routes."""
    if not DB_AVAILABLE:
        return None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
