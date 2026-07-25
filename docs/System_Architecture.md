# System Architecture — Sign Language Learning & Assessment Platform
**Team 4 | Intern: Ankur Biswal | Date: 25 July 2026**

---

## 1. Architecture Overview

The platform follows a **Microservices Architecture** with a clear separation between:
- Frontend (React.js)
- API Gateway (FastAPI)
- Backend Microservices
- AI/ML Intelligence Layer
- Data Layer
- External Services

---

## 2. Full System Architecture Diagram

```
+------------------------------------------------------------------+
|                        CLIENT LAYER                              |
|   Web Browser | Mobile App (Android/iOS) | Instructor Portal    |
|               | Admin Dashboard | Reports & Analytics           |
+------------------------------------------------------------------+
                              |
                    HTTPS / WebSocket
                              |
+------------------------------------------------------------------+
|                   API GATEWAY (FastAPI)                          |
|   Routing | Authentication | Rate Limiting | Request Validation  |
|           | Load Balancing | CORS | Logging                     |
+------------------------------------------------------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
+-------+--------+  +---------+-------+  +----------+------+
| User & Profile |  | Course & Content|  | Video Management|
|    Service     |  |    Service      |  |    Service      |
| - User Mgmt    |  | - Course Mgmt   |  | - Video Upload  |
| - Role Mgmt    |  | - Lesson Mgmt   |  | - Encoding      |
| - Profile Mgmt |  | - Module Org    |  | - Streaming     |
| - Preferences  |  | - Learning Paths|  | - CDN Integration|
+----------------+  +-----------------+  +-----------------+

+-------+--------+  +---------+-------+  +----------+------+
| Pose & Hand    |  | Gesture         |  | Accuracy        |
| Tracking Svc   |  | Recognition Svc |  | Assessment Svc  |
| - Hand Detect  |  | - Sign Classify |  | - Gesture Comp  |
| - Landmarks    |  | - CNN/LSTM      |  | - Accuracy Score|
| - Pose Estim   |  | - Seq Recogn    |  | - Timing Anal   |
| - Joint Track  |  | - Confidence    |  | - Correctness   |
+----------------+  +-----------------+  +-----------------+

+-------+--------+  +---------+-------+  +----------+------+
| AI Feedback &  |  | Learning        |  | Assessment &    |
| Correction Svc |  | Intelligence Svc|  | Quiz Service    |
| - Realtime FB  |  | - Analytics     |  | - Quiz Gen      |
| - Mistake Det  |  | - Weak Areas    |  | - Auto Evaluate |
| - Correction   |  | - Predictions   |  | - Reports       |
| - Visual FB    |  | - Personalized  |  | - Results       |
+----------------+  +-----------------+  +-----------------+

+-------+--------+  +---------+-------+  +----------+------+
| Risk & Perf    |  | Certification   |  | Notification    |
| Scoring Svc    |  |    Service      |  |    Service      |
| - Accuracy Sc  |  | - Cert Generate |  | - Email Notif   |
| - Mastery Sc   |  | - Verification  |  | - Push Notif    |
| - Overall Sc   |  | - Badges        |  | - Reminders     |
+----------------+  +-----------------+  +-----------------+
                              |
+------------------------------------------------------------------+
|                  AI / ML INTELLIGENCE LAYER                      |
|                                                                  |
|  [Hand Landmark]  [Gesture CNN/LSTM]  [Sequence Transformer]    |
|  [Accuracy Model] [Mistake Detection] [Learning Analytics]      |
|  [Recommendation Engine]                                        |
|                                                                  |
|  Deep Learning | Computer Vision | NLP | Reinforcement Learning |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|              DATA PROCESSING & STREAMING LAYER                   |
|                                                                  |
| Video Input -> Frame Extract -> Preprocess -> WebSocket Stream  |
|            -> Feature Extract -> Inference -> Results Cache     |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|                        DATA LAYER                                |
|                                                                  |
| PostgreSQL    | MongoDB       | Redis         | AWS S3/Azure     |
| (Relational)  | (Document)    | (Cache/Queue) | (Object Store)   |
| Users         | Video Meta    | Sessions      | Videos           |
| Profiles      | Gesture Data  | Leaderboard   | Thumbnails       |
| Courses       | Feedback Logs | Rate Limit    | Certificates     |
| Assessments   | Session Data  | Inference     | Learning Mats    |
|               |               |               |                  |
| Data Warehouse| Vector DB     |               |                  |
| (Analytics)   | (Embeddings)  |               |                  |
| Trends        | Sign Embed    |               |                  |
| Reports       | Similarity    |               |                  |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|                     EXTERNAL SERVICES                            |
|                                                                  |
| Cloud Storage   | CDN Service  | AI/ML Models  | Email Service   |
| AWS S3/Azure    | CloudFront   | TensorFlow/   | SES/SendGrid    |
|                 | Azure CDN    | PyTorch       |                 |
|                                                                  |
| Push Notif      | Auth Provider| Payment GW    |                 |
| Firebase/FCM    | Azure AD /   | Stripe /      |                 |
|                 | OAuth2       | Razorpay      |                 |
+------------------------------------------------------------------+
```

---

## 3. Layer-by-Layer Explanation

### Layer 1 — Client Layer
Users access the platform through multiple channels:
| Channel | Users | Purpose |
|---------|-------|---------|
| Web Browser | Learners, Instructors | Main learning interface |
| Mobile App (Android/iOS) | Learners | On-the-go practice |
| Instructor Portal | Instructors, Trainers | Course & student management |
| Admin Dashboard | Administrators | Platform management |
| Reports & Analytics | All roles | Performance insights |

---

### Layer 2 — API Gateway (FastAPI)
Single entry point for all requests. Handles:
- **Routing** — directs requests to correct microservice
- **Authentication** — verifies JWT tokens on every request
- **Rate Limiting** — prevents API abuse (via Redis)
- **Request Validation** — validates request format before processing
- **Load Balancing** — distributes traffic across service instances
- **CORS** — allows frontend to communicate with backend
- **Logging** — records all API activity for monitoring

---

### Layer 3 — Microservices Layer (12 Services)

| # | Service | Responsibility |
|---|---------|---------------|
| 1 | User & Profile Service | Registration, login, profile CRUD, role management |
| 2 | Course & Content Service | Course creation, lesson management, learning paths |
| 3 | Video Management Service | Upload, encode, stream videos via CDN |
| 4 | Pose & Hand Tracking Service | MediaPipe hand detection, landmark extraction |
| 5 | Gesture Recognition Service | CNN/LSTM classification, confidence scoring |
| 6 | Accuracy Assessment Service | Compare gesture vs reference, generate score |
| 7 | AI Feedback & Correction Service | Real-time mistake detection, correction hints |
| 8 | Learning Intelligence Service | Analytics, weak area detection, predictions |
| 9 | Assessment & Quiz Service | Quiz generation, auto-evaluation, reports |
| 10 | Risk & Performance Scoring Service | Multi-metric scoring, mastery tracking |
| 11 | Certification Service | Certificate generation, badge issuance |
| 12 | Notification Service | Email, push, in-app alerts and reminders |

---

### Layer 4 — AI/ML Intelligence Layer

| Model | Input | Output | Technology |
|-------|-------|--------|-----------|
| Hand Landmark Detection | Video frame | 21 keypoints | MediaPipe |
| Gesture Classification (Static) | Hand landmarks | Sign label + confidence | CNN (TensorFlow) |
| Gesture Classification (Dynamic) | Sequence of landmarks | Word/phrase label | LSTM/Transformer (PyTorch) |
| Accuracy Evaluation | Predicted vs Reference | Score (0-100%) | Custom scoring |
| Mistake Detection | Gesture comparison | Error type + location | Rule engine + ML |
| Learning Analytics | Practice history | Skill trends, weak areas | XGBoost + Pandas |
| Recommendation Engine | User performance | Next lesson suggestion | Reinforcement Learning |

---

### Layer 5 — Data Processing & Streaming Layer

```
Step 1: User opens camera → Video captured in browser
Step 2: FFmpeg extracts frames at 25 FPS
Step 3: Frames preprocessed (resize, normalize, denoise)
Step 4: WebSocket streams frames to backend in real-time
Step 5: MediaPipe extracts hand/pose keypoints (landmarks)
Step 6: CNN/LSTM classifies the gesture
Step 7: Accuracy model scores against reference gesture
Step 8: Score + feedback stored and sent back to UI
Step 9: Results cached in Redis for fast retrieval
```

---

### Layer 6 — Data Layer (6 Databases)

| Database | Type | What It Stores |
|----------|------|---------------|
| **PostgreSQL** | Relational (SQL) | Users, profiles, roles, courses, lessons, enrollments, assessments, scores |
| **MongoDB** | Document (NoSQL) | Video metadata, gesture data, feedback logs, session data, logs |
| **Redis** | Cache + Queue | Session tokens, leaderboard, inference cache, rate limit counters, message queue |
| **AWS S3 / Azure Blob** | Object Storage | Video files, thumbnails, certificates, learning materials, exports |
| **Data Warehouse** | Analytics DB | Learning analytics, performance trends, aggregated reports |
| **Vector DB** | Embedding Store | Sign embeddings, lesson embeddings, similarity search for recommendations |

---

### Layer 7 — External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Cloud Storage | AWS S3 / Azure Blob | Store videos and files |
| CDN | CloudFront / Azure CDN | Fast video delivery globally |
| AI/ML Models | TensorFlow / PyTorch | Run gesture classification models |
| Email | AWS SES / SendGrid | Send notification emails |
| Push Notifications | Firebase FCM | Mobile push alerts |
| Authentication | Azure AD / OAuth2 | Google/social login |
| Payments | Stripe / Razorpay | Certification exam fees |

---

## 4. Communication Protocols

| Communication Type | Protocol | Used Between |
|-------------------|----------|-------------|
| Regular API calls | HTTPS (REST) | Frontend ↔ API Gateway |
| Real-time gesture stream | WebSocket | Browser Camera ↔ Backend |
| Service-to-service | HTTP (internal) | Microservice ↔ Microservice |
| Message queue | Redis Queue | Async tasks (video processing) |
| File delivery | CDN (HTTPS) | Object Storage ↔ User |
| External auth | OAuth2 | App ↔ Google/Azure AD |

---

## 5. Security Architecture

| Security Aspect | Implementation |
|----------------|---------------|
| **Authentication** | JWT access tokens (15 min expiry) + Refresh tokens (7 days) |
| **Authorization** | Role-Based Access Control (RBAC) — 4 roles |
| **Password Security** | bcrypt hashing (cost factor 12) |
| **API Security** | Rate limiting via Redis, request validation, CORS policy |
| **Data Encryption** | TLS 1.3 in transit, AES-256 at rest |
| **Audit Logs** | All user actions logged to MongoDB |
| **OAuth2** | Google login via Azure AD / OAuth2 provider |

---

## 6. Deployment Architecture

```
+---------------------------+
|     GitHub Repository     |
|  (Source Code + CI/CD)    |
+---------------------------+
            |
    GitHub Actions (CI/CD)
            |
+---------------------------+
|    Docker Containers       |
|  - frontend (React)        |
|  - api (FastAPI)           |
|  - postgres                |
|  - mongodb                 |
|  - redis                   |
|  - nginx (reverse proxy)   |
+---------------------------+
            |
+---------------------------+
|   Cloud Platform           |
|   AWS / Azure              |
|   - ECS / ACI (containers) |
|   - S3 / Blob (storage)    |
|   - RDS (PostgreSQL)       |
|   - CloudWatch (monitoring)|
+---------------------------+
```

---

## 7. Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React.js | 18.x |
| Styling | Tailwind CSS | 3.x |
| Charts | Chart.js / Plotly | Latest |
| Backend | FastAPI (Python) | 0.100+ |
| ORM | SQLAlchemy + Alembic | 2.x |
| Primary DB | PostgreSQL | 15.x |
| Document DB | MongoDB | 6.x |
| Cache | Redis | 7.x |
| Computer Vision | MediaPipe | 0.10+ |
| Video Processing | OpenCV + FFmpeg | Latest |
| ML Framework | TensorFlow / PyTorch | 2.x |
| Analytics | Pandas + NumPy + XGBoost | Latest |
| Auth | JWT (python-jose) + OAuth2 | Latest |
| Containerization | Docker + Docker Compose | Latest |
| CI/CD | GitHub Actions | Latest |
| Cloud | AWS / Azure | Latest |

---

*Document prepared by Ankur Biswal — Team 4 | System Architecture*
