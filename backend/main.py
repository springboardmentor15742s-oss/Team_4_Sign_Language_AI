from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, profile

app = FastAPI(
    title="Sign Language Learning & Assessment Platform API",
    description="Backend microservices API supporting User Auth, RBAC, Learner Profile Management, and Gesture Recognition",
    version="1.0.0"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Sign Language Learning & Assessment Platform API",
        "team": "Team 4 - Infosys Internship",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
