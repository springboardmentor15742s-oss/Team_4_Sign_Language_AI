# 🤟 SignLearn AI — Master Presentation Deck (14 Slides)
### Team 4 · Infosys Springboard Internship 2026
**Format**: 14 Slides (Exact Match to Mentor Sample Presentation Structure)  
**Use Case**: NotebookLM Source / Gamma / PowerPoint Generation / Team Oral Delivery

---

# Slide 1: Title Slide
### Layout: Dark Blue Modern Tech Theme (#0F172A to #0284C7 Gradient) with 3D Hand / Cap Graphic

* **Main Title**: **SignLearn AI**
* **Subtitle**: AI-POWERED ACCESSIBLE SIGN LANGUAGE LEARNING & REAL-TIME ASSESSMENT PLATFORM
* **Project Metadata**:
  * **Domain**: Computer Vision, Deep Learning & Assistive Technology
  * **Program**: Infosys Springboard Internship 2026
  * **Team**: Team 4
* **Speaker**: **Ankur Biswal**
* **Speaker Script (30s)**:
  > *"Good morning respected Mentor. We are Team 4, and today we present **SignLearn AI** — an intelligent, real-time sign language learning and assessment platform designed to make sign language education interactive, verifiable, and accessible to everyone worldwide."*

---

# Slide 2: Challenges Facing Sign Language Learning
### Layout: 4 Numbered Badge Cards (1, 2, 3, 4) with Deep Slate Contrast

* **Card 1 — Lack of Real-Time Feedback**:
  * Traditional self-learning through static books or recorded videos cannot verify hand posture.
  * Learners develop incorrect muscle memory without immediate correction.
* **Card 2 — Accessibility & Engagement Barriers**:
  * Mainstream educational platforms rely heavily on audio prompts, excluding deaf and hard-of-hearing learners.
  * Lack of gamification and interactive milestones leads to high learner drop-out rates.
* **Card 3 — High Cost & Severe Tutor Shortage**:
  * One-on-one certified ASL instructors are scarce, expensive, and geographically inaccessible.
  * Schools and accessibility organizations lack automated tools to benchmark student progress.
* **Card 4 — Absence of Verifiable Assessment**:
  * No standardized, tamper-proof mechanism to assess and certify gesture mastery digitally without manual human grading.
* **Speaker**: **Ankur Biswal**
* **Speaker Script (35s)**:
  > *"Over 70 million deaf individuals globally rely on sign language, yet learning it presents major hurdles. Static videos provide zero feedback on finger curls or joint angles. Tutors are scarce and expensive, and existing tools rely on audio cues. SignLearn AI solves all four of these pain points with automated computer vision and instant feedback."*

---

# Slide 3: Proposed Solution: Core Features of SignLearn AI Platform
### Layout: 3 Horizontal Feature Cards with Mockup Illustrations

* **Card 1 — AI Real-Time Gesture Tracking & Assessment**:
  * 60 FPS in-browser hand tracking using MediaPipe Hands (21 3D landmarks).
  * Custom 111-dimensional geometric feature classifier achieving **93.38% accuracy** across 60 signs.
* **Card 2 — Interactive Video Courses & Structured Learning**:
  * 6 comprehensive courses ranging from Alphabet Basics to Medical & Workplace ASL.
  * Video-synced lessons with automatic progress persistence and lesson mastery checklists.
* **Card 3 — Automated Course Certification & Gamified Quizzes**:
  * Instant dynamic rendering of high-resolution digital Certificates of Completion via HTML5 Canvas.
  * 20-second Speed Quizzes, weekly podium Leaderboards, and daily streak rewards.
* **Speaker**: **Ankur Biswal**
* **Speaker Script (40s)**:
  > *"SignLearn AI delivers a complete three-pillar solution: First, real-time computer vision that tracks hand landmarks at 60 FPS and grades postures with 93% accuracy. Second, structured video courses from basic alphabet to professional vocabulary. And third, automated digital certification that issues verifiable credentials the instant all lessons are mastered."*

---

# Slide 4: Technology Stack: The Modern AI Web Framework Explained
### Layout: 4 Glassmorphism Technology Cards with Badges

* **Card 1 — MediaPipe Hands & Computer Vision (AI/CV Layer)**:
  * Client-side WebAssembly execution for zero-latency 21 3D landmark extraction.
  * 111-feature mathematical pipeline analyzing joint angles, finger curls, and palm orientation.
* **Card 2 — React 18 & Vite (Presentation Layer)**:
  * Ultra-responsive Single Page Application (SPA) with custom accessible light-theme tokens.
  * HTML5 Canvas API for client-side certificate generation and real-time visual overlays.
* **Card 3 — FastAPI & Python 3.11 (Application Layer)**:
  * High-concurrency asynchronous RESTful backend with 9 modular routers and 30+ endpoints.
  * Pydantic data schemas, automated OpenAPI documentation, and sub-2ms model inference.
* **Card 4 — PostgreSQL & Scikit-Learn (Persistence & ML)**:
  * 12 normalized relational tables (3NF) with foreign key cascades and B-Tree indexing.
  * Trained Multi-Layer Perceptron (MLP) neural network saved with zero external runtime bloat.
* **Speaker**: **Adityakumar Thakur**
* **Speaker Script (45s)**:
  > *"Our technology stack is built for high speed and accessibility. On the frontend, React 18 and MediaPipe execute hand tracking directly on the client GPU. Our backend is powered by asynchronous FastAPI in Python 3.11, connected to a robust PostgreSQL database and an optimized Scikit-Learn MLP classifier for real-time sub-millisecond inference."*

---

# Slide 5: System Architecture Overview
### Layout: Multi-Tier Architectural Block Diagram & Bulleted Specifications

* **Presentation Tier (React 18 SPA)**:
  * MediaPipe landmark extractor + Canvas renderer + SPA state router.
  * Local storage persistence for offline session recovery and instant UI transitions.
* **Application & API Gateway Tier (FastAPI)**:
  * REST API endpoints for Courses, Progress, History, Leaderboard, and AI Evaluation.
  * OAuth2 Password Bearer authentication with HMAC-SHA256 JWT tokens and RBAC middleware.
* **Machine Learning Tier (Feature Extraction & MLP)**:
  * 111-dimensional feature vector extraction: Euclidean distances, pairwise finger ratios, normal vectors.
  * Real-time inference responding in under 2 milliseconds.
* **Data Persistence Tier (PostgreSQL)**:
  * ACID-compliant storage for users, courses, lesson completions, feedback logs, and certificates.
* **Speaker**: **Rishi Kumar**
* **Speaker Script (45s)**:
  > *"Our system architecture follows a decoupled, highly scalable 3-tier model. The presentation layer performs 60 FPS computer vision directly in the browser, eliminating video streaming latency. The FastAPI application layer orchestrates authentication, business logic, and model evaluation, while PostgreSQL maintains strict relational integrity across all learning telemetry."*

---

# Slide 6: Challenges and Technical Solutions in SignLearn AI
### Layout: 4 Numbered Challenge-to-Solution Cards

* **Card 1 — Real-Time Inference Latency (<50ms Round Trip)**:
  * *Challenge*: Streaming raw video frames to a server causes network latency and privacy concerns.
  * *Solution*: Decoupled pipeline where MediaPipe runs in client WebAssembly, extracting 21 landmarks locally and transmitting only lightweight coordinate arrays.
* **Card 2 — Feature Collapse & Ambiguous Gesture Collisions**:
  * *Challenge*: Similar signs (e.g. A, M, N, S, T) collapse to near-identical finger curl values.
  * *Solution*: Expanded feature space from 6 to 111 dimensions, adding pairwise joint angles, inter-fingertip Euclidean distances, and palm normal vectors to achieve 93.38% separation.
* **Card 3 — Scale & Camera Distance Invariance**:
  * *Challenge*: Hand size changes drastically based on distance from the webcam.
  * *Solution*: Normalized all 3D coordinates relative to wrist landmark 0 and scaled by palm bounding span.
* **Card 4 — Tamper-Proof Digital Credentialing**:
  * *Challenge*: Users downloading certificates without finishing course requirements.
  * *Solution*: Client-side verification matrix tied to 100% lesson completion state, dynamically drawing verifiable credentials directly onto HTML5 Canvas.
* **Speaker**: **Ankur Biswal**
* **Speaker Script (45s)**:
  > *"During development, we solved four critical engineering hurdles. To beat network latency, we shifted vision processing to client WebAssembly. To separate identical hand postures like letters A and S, we engineered a 111-dimensional geometric feature vector. We made detection scale-invariant by normalizing against palm length, and we protected certificates with state-verified canvas rendering."*

---

# Slide 7: UI Mock-ups & Production Screen Flow
### Layout: 4 High-Resolution Screen Previews with Descriptions

* **Screen 1 — Learner Dashboard**:
  * Live streak counter, accuracy trends, sign mastery grid, and interactive weekly activity chart.
* **Screen 2 — Live AI Practice Session**:
  * Split-screen layout: live webcam video with 21-landmark skeleton overlay, accuracy gauge, and corrective tips.
* **Screen 3 — Course Catalog & Video Player**:
  * Categorized course modules, lesson checklists, video embed player, and progress rings.
* **Screen 4 — Official Certificate Modal & Leaderboard**:
  * 900x620 Canvas certificate with gold seal and PNG download, plus Olympic podium leaderboard.
* **Speaker**: **Adityakumar Thakur**
* **Speaker Script (45s)**:
  > *"Here are our final production screens translated from our Milestone 1 wireframes. The Learner Dashboard offers clear progress telemetry. The AI Practice interface overlays real-time landmark skeletons directly on the webcam feed. The Course player tracks lesson completion, and our Certificate modal delivers official credentials with instant one-click PNG downloads."*

---

# Slide 8: Relational Database Design & Feedback Workflow
### Layout: Entity-Relationship Diagram Snapshot & Key Table Specifications

* **Normalized Schema (12 Tables in 3NF)**:
  * `Users` & `Roles`: RBAC for Learner, Instructor, Trainer, and Administrator.
  * `Courses`, `Lessons` & `Course_Enrollments`: Curriculum management and completion states.
  * `Practice_Sessions` & `AI_Practice_Feedback`: Detailed landmark coordinates, accuracy scores, and error logs.
  * `Quiz_Scores` & `Course_Certificates`: Assessment records and issued credentials.
* **Optimized Queries & Constraints**:
  * Foreign key cascades to prevent orphaned practice data.
  * Compound B-Tree indexes on `(learner_id, sign_id)` yielding sub-10ms query times.
* **Speaker**: **Pogakula Pragathi**
* **Speaker Script (45s)**:
  > *"Our database is designed in Third Normal Form across 12 relational PostgreSQL tables. Every student interaction is tracked across practice sessions, quiz attempts, and certificates with strict foreign key constraints. Compound indexing ensures that analytical queries for streaks, mastery percentages, and instructor reports execute in under 10 milliseconds."*

---

# Slide 9: Measurable Outcomes and Positive Impact
### Layout: 3 Highlight Metric Cards with Visual Progress Indicators

* **Metric Card 1 — 93.38% Gesture Classification Accuracy**:
  * Evaluated across 60 distinct ASL signs using an 111-feature Multi-Layer Perceptron.
  * Solved finger-curl collapse with zero cross-class collision between similar signs.
* **Metric Card 2 — Sub-25ms Real-Time End-to-End Latency**:
  * 60 FPS MediaPipe WebAssembly landmark detection (~16ms).
  * Feature extraction (~1ms) + Neural network inference (~2ms) = Total loop under 25ms.
* **Metric Card 3 — 100% Automated Verifiable Certification**:
  * Dynamic high-resolution 900x620 Canvas generation.
  * Zero server rendering overhead; instant client-side lossless PNG export.
* **Speaker**: **Chinmayee Badiger**
* **Speaker Script (45s)**:
  > *"Our platform achieves three measurable breakthroughs: First, 93.38% classification accuracy across 60 signs with zero gesture collision. Second, an end-to-end feedback latency of under 25 milliseconds, which is four times faster than human reaction perception. And third, 100% automated course certification rendered dynamically with zero server bottleneck."*

---

# Slide 10: Future Enhancements for SignLearn AI
### Layout: 3 Forward-Looking Feature Cards with Technology Badges

* **Card 1 — Continuous Sentence & Video Translation**:
  * Transition from static sign classification to sequence-to-sequence translation using Spatial-Temporal Graph Convolutional Networks (ST-GCN) and Transformers.
* **Card 2 — Two-Handed Bimanual & Facial Expression Recognition**:
  * Incorporate MediaPipe Holistic to track facial grammar (eyebrows, mouth morphemes) and bimanual signs for complete ASL linguistic fidelity.
* **Card 3 — Multi-Regional Sign Support (ISL, BSL, Auslan)**:
  * Expand the dataset pipeline to support Indian Sign Language (ISL) and British Sign Language (BSL), serving international accessibility mandates.
* **Speaker**: **Sirasana Gnana Prasanna Lakshmi**
* **Speaker Script (40s)**:
  > *"Looking ahead, we have three strategic expansions: First, implementing Transformer-based continuous sign sentence translation. Second, integrating facial expression tracking using MediaPipe Holistic for full grammatical nuance. And third, expanding our dataset pipeline to support Indian and British Sign Languages for global accessibility."*

---

# Slide 11: Team Members & Contributions
### Layout: 6 Member Profile Cards with Roles & Deliverable Tags

* **Ankur Biswal** (Full-Stack Lead & ML Integrator):
  * React 18 Frontend SPA, 111-feature ML model training, MediaPipe CV integration, Canvas certification system, master Word documentation.
* **Chinmayee Badiger** (Dataset & ML Specialist):
  * WLASL & MS-ASL dataset loading pipelines, AI evaluation routers, dataset reference documentation.
* **Pogakula Pragathi** (Database Architect):
  * 12-table PostgreSQL schema, SQLAlchemy models, complex SQL queries, and graphical ER diagrams.
* **Sirasana Gnana Prasanna Lakshmi** (API & Backend Architect):
  * REST API specifications, 30+ endpoints, 9 modular FastAPI routers, JWT RBAC security, and deployment guides.
* **Rishi Kumar** (Workflow & Systems Analyst):
  * 3-tier system architecture, Mermaid learning workflows, practice feedback loops, and milestone reporting.
* **Adityakumar Prabodhkumar Thakur** (UI/UX Designer):
  * 11 high-fidelity wireframe mockups, accessible design system, and component layout guidelines.
* **Speaker**: **Rishi Kumar**
* **Speaker Script (45s)**:
  > *"Our success was driven by clear specialization across all 6 members: Ankur led full-stack engineering and machine learning; Chinmayee managed dataset integration; Pragathi architected our PostgreSQL database; Prasanna built our REST API platform; Aditya designed our UI wireframes; and I structured the system architecture and workflows."*

---

# Slide 12: Live Demonstration & Video Reference
### Layout: Central Video Thumbnail & Drive Link Container

* **Header**: **Live Working Project Demonstration**
* **Repository & Demo Status**:
  * Unified Branch: `ankur/review`
  * Frontend: React 18 + Vite (`http://localhost:5173/`)
  * Backend: FastAPI (`http://localhost:8000/docs`)
* **Presentation Video Link**:
  * [https://drive.google.com/file/d/1GAGHVWyuiXgearCHCusDrzPZBf9mK978/view?usp=sharing](https://drive.google.com/file/d/1GAGHVWyuiXgearCHCusDrzPZBf9mK978/view?usp=sharing)
* **Speaker**: **Ankur Biswal**
* **Speaker Script (20s)**:
  > *"We have recorded a backup demonstration video available on Google Drive. I will now switch to our live running application to showcase the real-time functionality of SignLearn AI."*

---

# Slide 13: Questions & Answers (Q & A)
### Layout: Centered Elegant Dark Blue Q&A Graphic with Key Topic Badges

* **Main Heading**: **Q & A**
* **Subtitle**: We welcome technical questions from our respected Mentor and evaluators.
* **Core Discussion Topics**:
  * `MediaPipe Computer Vision`
  * `111-Feature MLP Neural Network`
  * `FastAPI Microservices`
  * `PostgreSQL 3NF Schema`
  * `OAuth2 / JWT Security`
  * `WCAG AAA UI Accessibility`
* **Speaker**: **All Team Members**
* **Speaker Script (15s)**:
  > *"Respected Mentor, our entire team is now open for the Q&A session. We are happy to answer any questions regarding our architecture, machine learning models, database, or live implementation."*

---

# Slide 14: Thank You
### Layout: Inspiring Closing Slide with Contact & Repository Information

* **Main Heading**: **Thank You!**
* **Project Name**: SignLearn AI — Accessible Sign Language Learning Platform
* **Team**: Team 4 · Infosys Springboard Internship 2026
* **GitHub Repository**:
  * `https://github.com/springboardmentor15742s-oss/Team_4_Sign_Language_AI`
  * Active Review Branch: `ankur/review`
* **Special Thanks**:
  * Our respected Springboard Mentor
  * Infosys Springboard Team & Evaluation Committee
* **Speaker**: **Ankur Biswal**
* **Speaker Script (15s)**:
  > *"Thank you to our respected Mentor and the Infosys Springboard team for their continuous guidance and feedback throughout this internship. Thank you!"*
