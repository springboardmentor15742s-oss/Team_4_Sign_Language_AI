from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import init_db
from app.routers import ai_evaluate, auth, profile

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "Backend API for the Sign Language Learning & Assessment Platform. "
        "Supports authentication, RBAC, learner profiles, and AI gesture evaluation."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(ai_evaluate.router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    # Eager-load / bootstrap gesture classifier so first /ai/evaluate is fast
    from app.ml.classifier import get_gesture_classifier

    get_gesture_classifier()


@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.app_name,
        "team": "Team 4 - Infosys Springboard Internship",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy", "environment": settings.app_env}
