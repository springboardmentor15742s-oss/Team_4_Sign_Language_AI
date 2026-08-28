"""
Sign Learn AI — Backend FastAPI Application
Infosys Springboard Internship 2026 • Team 4
Milestone 3 & 4 — Full Feature Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def _import(mod):
    try:
        return __import__(f"backend.routers.{mod}", fromlist=["router"]).router
    except ImportError:
        return __import__(f"routers.{mod}", fromlist=["router"]).router

app = FastAPI(
    title="SignLearn AI — Platform API",
    description="Sign Language Learning & AI Gesture Recognition — Milestones 1-4",
    version="4.0.0",
)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

for mod in ["ai_evaluate","progress","courses","instructor","goals","leaderboard","history","notifications"]:
    try:
        app.include_router(_import(mod), prefix="/api")
    except Exception as e:
        print(f"Warning: could not load router {mod}: {e}")

@app.get("/")
def root():
    return {"status":"online","service":"SignLearn AI API","version":"4.0.0","team":"Infosys Team 4",
            "docs":"/docs","milestones":["M1-Auth","M2-AI-Gesture","M3-Progress-Courses","M4-ML-Leaderboard"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
