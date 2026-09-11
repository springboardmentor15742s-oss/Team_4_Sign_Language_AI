# Day 1 Research Report — Sign Language Learning & Assessment Platform
**Team 4 | Intern: Ankur Biswal | Date: 24 July 2026**

---

## ✅ Task 1 — Project Requirements & Objectives

### Project Purpose
Build an AI-powered Sign Language Learning & Assessment Platform that enables users to learn sign language through:
- Interactive video lessons
- Real-time gesture recognition via webcam
- AI-driven accuracy feedback
- Performance tracking and certification

### Core Technical Objectives
| Objective | Technology |
|-----------|-----------|
| Real-time hand/pose tracking | MediaPipe Hands + Pose |
| Gesture classification | CNN (static) + LSTM/Transformer (dynamic) |
| Accuracy evaluation | Computer vision + scoring engine |
| Personalized learning | XGBoost recommendations |
| Secure multi-role access | JWT + OAuth2 |
| Scalable deployment | Docker + AWS/Azure |

### Performance Score Formula

Learning Performance Score = (Gesture Accuracy × 0.40) + (Assessment Performance × 0.25) + (Lesson Completion × 0.15) + (Practice Consistency × 0.10) + (Skill Improvement Rate × 0.10)

---

## ✅ Task 2 — User Roles

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Learner** | Primary user — students, hearing-impaired individuals | Enroll in courses, practice signs, take assessments, earn certificates |
| **Instructor** | Teachers and trainers | Create courses, manage lessons, view student progress, generate reports |
| **Accessibility Trainer** | Specialized sign language educators | Monitor learner engagement, skill development, certification |
| **Administrator** | Platform manager | User management, content oversight, system monitoring, analytics |

### Role Access Matrix
| Feature | Learner | Instructor | Trainer | Admin |
|---------|---------|-----------|---------|-------|
| Take lessons | ✅ | ✅ | ✅ | ✅ |
| Create courses | ❌ | ✅ | ✅ | ✅ |
| View all students | ❌ | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ❌ | ✅ |
| Earn certificates | ✅ | ❌ | ❌ | ❌ |

---

## ✅ Task 3 — Dataset Research

### Dataset 1: ASL Alphabet Dataset (Kaggle)
- **Type**: Static image classification
- **Size**: ~87,000 images
- **Resolution**: 200×200 pixels, color (RGB)
- **Classes**: 29 (A–Z + `space`, `delete`, `nothing`)
- **Format**: Folder-per-class structure
- **Source**: https://www.kaggle.com/datasets/grassknoted/asl-alphabet
- **License**: Open / CC
- **Use Case**: Train CNN for static letter recognition

### Dataset 2: Sign Language MNIST
- **Type**: Static image classification (MNIST drop-in)
- **Size**: 34,627 images (27,455 train / 7,172 test)
- **Resolution**: 28×28 pixels, grayscale
- **Classes**: 24 (A–Z excluding J and Z — both require motion)
- **Format**: CSV with pixel values
- **Source**: https://www.kaggle.com/datasets/datamunge/sign-language-mnist
- **License**: Open
- **Use Case**: Rapid prototyping, CNN benchmarking, beginner model testing

### Dataset 3: WLASL — Word-Level American Sign Language
- **Type**: Dynamic video dataset (word-level)
- **Size**: ~21,000+ video samples
- **Classes**: Up to 2,000 ASL words (4 subsets: 100 / 300 / 1000 / 2000)
- **Signers**: 100+ different signers (adds variation)
- **Format**: Video files + JSON metadata (`WLASL_v0.3.json`)
- **Source**: https://github.com/dxli94/WLASL
- **License**: C-UDA (academic use only)
- **Use Case**: Dynamic/continuous sign recognition using LSTM or Transformer models

### Dataset 4: RWTH-PHOENIX-Weather 2014
- **Type**: Continuous sign language recognition + translation
- **Language**: German Sign Language (DGS)
- **Frame Size**: 210×260 px at 25 FPS
- **Content**: Weather broadcast signing with German text gloss annotations
- **Source**: https://www-i6.informatik.rwth-aachen.de/~koller/RWTH-PHOENIX/
- **License**: Research use only
- **Use Case**: Sequence recognition, sign-to-text translation (advanced Weeks 3–4)

---

## ✅ Task 4 — Dataset Comparison

| Feature | ASL Alphabet | Sign Language MNIST | WLASL | RWTH-PHOENIX |
|---------|-------------|---------------------|-------|--------------|
| **Sign Type** | Static | Static | Dynamic (video) | Continuous (video) |
| **Language** | American (ASL) | American (ASL) | American (ASL) | German (DGS) |
| **Size** | ~87K images | ~34K images | ~21K videos | ~7K video sequences |
| **Resolution** | 200×200 color | 28×28 grayscale | Variable video | 210×260 px |
| **Classes** | 29 | 24 | 100–2000 words | Continuous sentences |
| **Difficulty** | Medium | Easy | Hard | Expert |
| **Format** | Image folders | CSV | Video + JSON | Image sequences |
| **Use in Project** | Week 1–2 (CNN) | Week 1 (prototype) | Week 3–4 (LSTM) | Week 5–6 (advanced) |
| **Download Size** | ~1 GB | ~1 MB | ~50 GB | ~30 GB |
| **Best For** | Alphabet learning | Quick testing | Word learning | Sentence recognition |

### Recommended Dataset Strategy
1. **Start with**: Sign Language MNIST (fast, small, great for prototyping)
2. **Main model**: ASL Alphabet Dataset (high quality static signs)
3. **Advanced**: WLASL100 subset (100 most common words for dynamic recognition)
4. **Future scope**: RWTH-PHOENIX for translation features

---

## ✅ Task 5 — Sign Language Learning Platforms Research

### Platform 1: SignSchool
- **URL**: signschool.com
- **Key Features**: Large clear video demos, slow-motion playback, category navigation, gamified multiple-choice, "Sign of the Day", no mandatory login
- **Strength**: Beginner-friendly, no friction to start learning
- **Weakness**: No real-time gesture recognition/feedback

### Platform 2: HandSpeak
- **URL**: handspeak.com
- **Key Features**: Step-by-step curriculum, visual-centric design, self-paced review, clean ad-free UI
- **Strength**: Structured learning path, comprehensive dictionary
- **Weakness**: Outdated UI, no AI feedback

### Platform 3: Lingvano
- **Key Features**: Webcam-based real-time hand tracking, gamified lessons, structured courses, progress tracking
- **Strength**: Closest to our project vision — AI feedback loop exists
- **Weakness**: Paid subscription, limited ASL coverage

### Platform 4: ASL Bloom
- **Key Features**: Duolingo-style gamification, streaks, badges, structured learning paths
- **Strength**: High engagement through gamification
- **Weakness**: No gesture recognition feedback

### Key Differentiator for Our Platform
Our platform combines real-time AI gesture recognition + gamification + certification — none of the above competitors have all three together.

---

## ✅ Task 6 — UI Inspirations Collected

| Inspiration Source | What to Borrow |
|-------------------|---------------|
| **Duolingo** | Streak tracking, progress bars, gamification, daily goals |
| **Coursera** | Course cards layout, progress % per course, certificate UI |
| **Khan Academy** | Clean lesson flow, skill mastery badges, side navigation |
| **SignSchool** | Video player layout, slow-motion feature, category tiles |
| **Lingvano** | Real-time webcam integration panel, sign overlay UI |
| **Notion** | Clean dashboard layout, sidebar navigation style |

### UI Color Palette
- **Primary**: Deep purple #6C63FF (trust, intelligence)
- **Accent**: Teal #00BFA6 (accessibility, calm)
- **Background**: Dark #0F172A (modern, easy on eyes)
- **Cards**: #1E293B with glassmorphism effect
- **Success**: Green #22C55E
- **Warning**: Amber #F59E0B

---

## ✅ Task 7 — Learner Dashboard Features

### Must-Have Features
| Feature | Description |
|---------|-------------|
| **Progress Ring** | Visual circular progress for overall course completion |
| **Daily Streak** | Gamified consecutive practice day counter |
| **Recent Signs** | Last 5 signs practiced with accuracy scores |
| **Recommended Lessons** | AI-suggested next lessons based on weak areas |
| **Accuracy Chart** | Line chart showing score improvement over time |
| **Skill Badges** | Earned badges for milestone completions |
| **Practice Timer** | Today's practice duration |
| **Quick Practice Button** | One-click to start camera practice session |

### Dashboard Layout Wireframe
```
+------------------------------------------------------+
|  SignLearn              [Lessons] [Practice] [Profile]|
+------------------------------------------------------+
|  Welcome back, Ankur!   Streak: 5 days               |
+------------------+-----------------------------------+
|  Progress Ring   |  Accuracy Over Time (Line Chart)  |
|  [====75%====]   |  Improving trend over 7 days      |
+------------------+-----------------------------------+
|  Recommended Next:  [Lesson Card]  [Lesson Card]     |
+------------------------------------------------------+
|  Recent Practice:   Sign A - 92%   Sign B - 67%      |
+------------------------------------------------------+
|  Achievements:  Beginner Badge   5-Day Streak        |
+------------------------------------------------------+
```

---

## ✅ Task 8 — Learner Profile Requirements

### Profile Fields
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Email | Email | Yes |
| Profile Photo | Image upload | Optional |
| Learning Level | Dropdown (Beginner / Intermediate / Advanced) | Yes |
| Preferred Language | Dropdown (ASL / BSL / ISL) | Yes |
| Learning Goals | Multi-select checkboxes | Yes |
| Daily Practice Target | Number (mins/day) | Optional |
| Date of Birth | Date | Optional |
| Accessibility Needs | Text | Optional |

### Learning Goals (Multi-select)
- Learn the alphabet (A-Z)
- Learn everyday conversations
- Professional/workplace sign language
- Prepare for certification exam
- Learn for accessibility/communication
- Teach others sign language

### Auto-generated Profile Stats
- Total practice time
- Signs learned count
- Average accuracy score
- Assessment scores history
- Certificates earned
- Practice consistency streak

---

## Main Goals Status

| Goal | Status |
|------|--------|
| Finalize project objectives | Done — See Task 1 |
| Identify suitable datasets | Done — MNIST (prototype) → ASL Alphabet (main) → WLASL100 (dynamic) |

---

*Document prepared by Ankur Biswal — Team 4 | Day 1 Deliverable*
