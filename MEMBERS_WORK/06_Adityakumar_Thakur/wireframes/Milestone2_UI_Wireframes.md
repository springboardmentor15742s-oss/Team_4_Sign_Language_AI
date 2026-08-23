# Milestone 2 — Low-Fidelity UI Wireframes & Layout Specification
**Author**: Adityakumar Thakur (UI/UX Lead) | **Team 4 — Infosys Springboard Internship 2026**

---

## 🎨 Overview & Design Tokens

Milestone 2 expands the platform with 3 new core screens designed with clean, accessible low-fidelity wireframe principles:
- **Color Palette**: Neutral slate background (`#F8FAFC`), crisp white cards (`#FFFFFF`), primary blue highlight (`#0284C7`), success green (`#16A34A`), warning red (`#E11D48`).
- **Typography**: Plus Jakarta Sans (Accessible high-legibility font).
- **Accessibility**: High-contrast borders (`#E2E8F0`), ARIA labels, keyboard navigability.

---

## 🖥️ Screen 1: AI Practice Studio (Camera & Feedback Overlay)

```
+-----------------------------------------------------------------------------------+
|  [Logo] SignLearn AI                                [Auth]  [Profile]  [Dashboard]|
|  [AI Practice]  [Speed Quiz]  [Datasets]                                          |
+-----------------------------------------------------------------------------------+
|  [Header Banner: Interactive AI Sign Gesture Studio]                              |
|  Sessions Done: 3                                          Current Sign: A        |
+--------------------------------------------------+--------------------------------+
|  AI Gesture Recognition Camera                   |  Select Sign to Practice       |
|  [MediaPipe 21-Landmark Badge]                   |                                |
|  +--------------------------------------------+  |  [ A ]   [ B ]                 |
|  |                                            |  |  [ C ]   [ D ]                 |
|  |       [ WebCam Live Video Feed ]           |  |  [ E ]   [ F ]                 |
|  |                                            |  |  [HELLO] [THANK YOU]           |
|  |     [ Start Gesture Recognition ]          |  |                                |
|  +--------------------------------------------+  +--------------------------------+
|                                                  |  ✦ API & Database Pipeline     |
|  +--------------------------------------------+  |  1. POST /ai/evaluate          |
|  |  (✓) Gesture Recognized!            94.2%  |  |  2. Log Practice_History       |
|  |  • Hand position matches sign 'A'.         |  |  3. Update Skill_Mastery       |
|  |  • Wrist angle optimal.                    |  |  4. Log AI_Practice_Feedback   |
|  +--------------------------------------------+  +--------------------------------+
```

### Key Component Coordinates & Layout Rules:
1. **Left Container (2/3 width)**:
   - Header with camera icon and MediaPipe badge.
   - 16:9 Aspect ratio dark canvas viewport (`#0F172A`).
   - Live bounding box overlay displaying landmark tracking points.
   - Dynamic Feedback Result Card appearing conditionally after evaluation.
2. **Right Container (1/3 width)**:
   - 2-column grid of sign selection buttons with blue hover/active states.
   - Technical pipeline summary card explaining backend write triggers.

---

## ⏱️ Screen 2: 60-Second Timed Speed Quiz

```
+-----------------------------------------------------------------------------------+
|  [Header Banner: 60-Second Sign Language Speed Quiz]            [Timer: 60s]      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                           [ START SPEED CHALLENGE ]                               |
|                           Identify 5 signs in 60s                                 |
|                                                                                   |
|  -------------------------- (When Active) --------------------------------------  |
|  Question 1 of 5                                                Score: 20 pts     |
|                                                                                   |
|                               +------------------+                                |
|                               |                  |                                |
|                               |     [  A  ]      |  <-- Sign Display Box          |
|                               |                  |                                |
|                               +------------------+                                |
|                                                                                   |
|           [ Option 1: Letter A ]          [ Option 2: Letter B ]                  |
|           [ Option 3: Letter C ]          [ Option 4: Letter D ]                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Key Component Coordinates & Layout Rules:
1. **Timer Pill (Top Right)**: Prominent countdown timer changing color dynamically (Green >30s, Amber 10-30s, Red <10s).
2. **Center Sign Display Box**: High-contrast dark box (`#0F172A`) with 52px bold font displaying the target sign.
3. **2x2 Answer Grid**: 4 full-width accessible button tiles with arrow indicators and immediate green/red selection feedback.

---

## 🗂️ Screen 3: Dataset Library & Metadata Explorer

```
+-----------------------------------------------------------------------------------+
|  [Header Banner: Sign Language Datasets Library]          Total: 3 Datasets       |
+-----------------------------------------------------------------------------------+
|  Filter by Category: [ ALL ]  [ ALPHABET DATASETS ]  [ DYNAMIC WORD DATASETS ]    |
+-----------------------------+-----------------------------+-----------------------+
|  [ALPHABET]         Kaggle  |  [ALPHABET]         Kaggle  |  [DYNAMIC]      WLASL |
|  Sign Language MNIST        |  ASL Alphabet Dataset       |  WLASL Repository     |
|  CSV (28x28 Grayscale)      |  RGB Images (200x200 Color) |  Video Files (MP4)    |
|  27,455 Training Images     |  87,000 RGB Images          |  21,083 Video Clips   |
|  24 Static Classes          |  29 Classes                 |  2,000 Words          |
|                             |                             |                       |
|  (✓) Integrated in Pipeline |  (✓) Integrated in Pipeline |  (✓) Integrated       |
+-----------------------------+-----------------------------+-----------------------+
```

### Key Component Coordinates & Layout Rules:
1. **Filter Button Bar**: Horizontal segmented control bar filtering dataset cards by model architecture relevance.
2. **3-Column Responsive Card Grid**:
   - Distinct colored tag pills for ALPHABET (`#0284C7`) vs DYNAMIC (`#D97706`).
   - Structured metadata list (Format, Volume, Class Count).
   - Footer badge confirming live integration status.
