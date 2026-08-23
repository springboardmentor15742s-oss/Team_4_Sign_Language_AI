# Deployment Guide — SignLearn AI
## How to Run the Full Stack Locally

---

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

---

## Step 1: Clone & Setup
\\\ash
git clone <repo-url>
cd Team_4_Sign_Language_AI
\\\

## Step 2: Backend Setup
\\\ash
cd backend
pip install fastapi uvicorn python-multipart pydantic
pip install -r requirements.txt
\\\

## Step 3: Run Backend
\\\ash
# From project root:
uvicorn backend.main:app --reload --port 8000
# OR from backend/ directory:
python main.py

# API docs available at: http://localhost:8000/docs
# Health check: http://localhost:8000/
\\\

## Step 4: Frontend Setup
\\\ash
cd frontend
npm install
\\\

## Step 5: Run Frontend
\\\ash
npm run dev
# Open: http://localhost:5173
\\\

## Step 6 (Optional): Train ML Model
\\\ash
cd ..  # back to project root
pip install scikit-learn numpy pandas
python ml/train_classifier.py
# Model saved to: ml/model/sign_classifier.pkl
\\\

---

## Environment Notes
- Frontend → Backend: http://localhost:8000/api (auto-configured)
- CORS: Allowed for all origins in development (change for production)
- Camera: Required for AI Practice Studio (grant browser permission)
- MediaPipe: Loaded via CDN (internet required for first load)

---

## Demo Accounts (Role Switcher)
Use the ⚡ RBAC Simulator button in the top navbar:
| Role | Features Unlocked |
|---|---|
| LEARNER | Dashboard, Practice, Quiz, Profile, History, Courses, Leaderboard |
| INSTRUCTOR | + Instructor Dashboard (view all learners, add courses) |
| ADMIN | All features + Auth & RBAC management |
