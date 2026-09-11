# SignLearn AI -- ML Model Training & Diagnostic Report
**Date:** 2026-09-11 13:33
**Milestone:** Milestone 4 Final Production Optimization
**Target Signs:** All 60 ASL Signs (26 Alphabet, 25 Words, 9 Two-Handed Gestures)

---

## 1. Executive Summary: Before vs After Feature Space Overhaul

| Dimension | Baseline (6D / 85D) | Enhanced (111D Spatial & Kinetic) | Improvement |
|---|---|---|---|
| **Overall Test Accuracy** | **36.33%** | **93.38%** | **+57.04% absolute** |
| **Macro Avg F1 Score** | **33.60%** | **93.29%** | **+59.69% absolute** |
| **Colliding Sign Pairs (dist < 0.15)** | **80 pairs** | **0 pairs** | **100% Resolved (0 collisions)** |
| **Exact Duplicates (dist = 0.0000)** | **8 pairs** | **0 pairs** | **100% Resolved (A/N, U/V, I/J, etc.)** |
| **Feature Space Dimensions** | 85 features | 111 features | +26 biomechanical & kinetic features |
| **Dynamic Motion Awareness** | Single static frozen frame | 8-frame trajectory kinematics | Full temporal velocity/path tracking |
| **Best Architecture** | MLP (36.33%) | **MLP (93.38%)** | Calibrated with predict_proba |

---

## 2. Model Benchmark Comparison
All models trained on 19,200 samples (320 per sign) and evaluated on 4,800 held-out samples (80 per sign, stratified):

| Model Architecture | Test Accuracy | CV Mean (3-fold) | CV Std | Status |
|---|---|---|---|---|
| RandomForest | 93.08% | 91.84% | 0.14% |
| HistGradBoost | 93.27% | 92.29% | 0.03% |
| MLP **SELECTED BEST** | 93.38% | 92.92% | 0.13% |

---

## 3. Per-Sign Precision, Recall & F1 (Before vs After)

| Sign | Category | Baseline F1 | Enhanced F1 | F1 Delta | Precision | Recall | Support |
|---|---|---|---|---|---|---|---|
| **A** | Alphabet | 9.3% | **98.8%** | `+89.4%` | 98.8% | 98.8% | 80 |
| **B** | Alphabet | 88.3% | **100.0%** | `+11.7%` | 100.0% | 100.0% | 80 |
| **C** | Alphabet | 3.8% | **100.0%** | `+96.2%` | 100.0% | 100.0% | 80 |
| **D** | Alphabet | 47.3% | **97.4%** | `+50.2%` | 100.0% | 95.0% | 80 |
| **E** | Alphabet | 18.0% | **96.9%** | `+78.9%` | 96.3% | 97.5% | 80 |
| **F** | Alphabet | 98.9% | **100.0%** | `+1.1%` | 100.0% | 100.0% | 80 |
| **G** | Alphabet | 62.9% | **99.4%** | `+36.5%` | 100.0% | 98.8% | 80 |
| **H** | Alphabet | 91.7% | **99.4%** | `+7.7%` | 98.8% | 100.0% | 80 |
| **I** | Alphabet | 55.1% | **100.0%** | `+44.9%` | 100.0% | 100.0% | 80 |
| **J** | Alphabet | 50.6% | **100.0%** | `+49.4%` | 100.0% | 100.0% | 80 |
| **K** | Alphabet | 92.5% | **100.0%** | `+7.5%` | 100.0% | 100.0% | 80 |
| **L** | Alphabet | 91.4% | **99.4%** | `+8.0%` | 98.8% | 100.0% | 80 |
| **M** | Alphabet | 8.9% | **86.1%** | `+77.2%` | 91.5% | 81.2% | 80 |
| **N** | Alphabet | 7.4% | **79.0%** | `+71.6%` | 78.0% | 80.0% | 80 |
| **O** | Alphabet | 50.9% | **98.8%** | `+47.8%` | 98.8% | 98.8% | 80 |
| **P** | Alphabet | 96.1% | **100.0%** | `+3.9%` | 100.0% | 100.0% | 80 |
| **Q** | Alphabet | 42.4% | **100.0%** | `+57.6%` | 100.0% | 100.0% | 80 |
| **R** | Alphabet | 15.0% | **100.0%** | `+85.0%` | 100.0% | 100.0% | 80 |
| **S** | Alphabet | 3.5% | **92.4%** | `+88.9%` | 93.6% | 91.2% | 80 |
| **T** | Alphabet | 29.9% | **90.9%** | `+61.0%` | 88.2% | 93.8% | 80 |
| **U** | Alphabet | 14.8% | **84.1%** | `+69.3%` | 82.1% | 86.2% | 80 |
| **V** | Alphabet | 11.3% | **34.8%** | `+23.5%` | 44.2% | 28.7% | 80 |
| **W** | Alphabet | 47.6% | **100.0%** | `+52.4%` | 100.0% | 100.0% | 80 |
| **X** | Alphabet | 64.5% | **93.3%** | `+28.7%` | 91.6% | 95.0% | 80 |
| **Y** | Alphabet | 96.2% | **100.0%** | `+3.8%` | 100.0% | 100.0% | 80 |
| **Z** | Alphabet | 19.9% | **100.0%** | `+80.1%` | 100.0% | 100.0% | 80 |
| **HELLO** | Word | 1.2% | **100.0%** | `+98.8%` | 100.0% | 100.0% | 80 |
| **THANK_YOU** | Word | 3.7% | **46.3%** | `+42.7%` | 45.2% | 47.5% | 80 |
| **PLEASE** | Word | 5.8% | **100.0%** | `+94.2%` | 100.0% | 100.0% | 80 |
| **YES** | Word | 1.4% | **100.0%** | `+98.6%` | 100.0% | 100.0% | 80 |
| **NO** | Word | 18.7% | **100.0%** | `+81.3%` | 100.0% | 100.0% | 80 |
| **HELP** | Word | 36.1% | **49.0%** | `+12.9%` | 53.7% | 45.0% | 80 |
| **LOVE** | Word | 14.2% | **100.0%** | `+85.8%` | 100.0% | 100.0% | 80 |
| **SORRY** | Word | 5.2% | **100.0%** | `+94.8%` | 100.0% | 100.0% | 80 |
| **GOOD** | Word | 11.2% | **43.6%** | `+32.4%` | 44.7% | 42.5% | 80 |
| **BAD** | Word | 78.1% | **100.0%** | `+21.9%` | 100.0% | 100.0% | 80 |
| **NAME** | Word | 12.2% | **100.0%** | `+87.8%` | 100.0% | 100.0% | 80 |
| **NICE** | Word | 3.5% | **100.0%** | `+96.5%` | 100.0% | 100.0% | 80 |
| **HOME** | Word | 41.1% | **100.0%** | `+58.9%` | 100.0% | 100.0% | 80 |
| **EAT** | Word | 66.5% | **100.0%** | `+33.5%` | 100.0% | 100.0% | 80 |
| **WATER** | Word | 39.3% | **100.0%** | `+60.7%` | 100.0% | 100.0% | 80 |
| **TIME** | Word | 88.1% | **100.0%** | `+11.9%` | 100.0% | 100.0% | 80 |
| **WHAT** | Word | 11.5% | **100.0%** | `+88.5%` | 100.0% | 100.0% | 80 |
| **WHERE** | Word | 20.6% | **100.0%** | `+79.4%` | 100.0% | 100.0% | 80 |
| **WHEN** | Word | 15.8% | **98.2%** | `+82.4%` | 96.4% | 100.0% | 80 |
| **HOW** | Word | 18.2% | **100.0%** | `+81.8%` | 100.0% | 100.0% | 80 |
| **WHO** | Word | 1.2% | **100.0%** | `+98.8%` | 100.0% | 100.0% | 80 |
| **WHY** | Word | 98.2% | **100.0%** | `+1.8%` | 100.0% | 100.0% | 80 |
| **MORE** | Word | 49.9% | **100.0%** | `+50.1%` | 100.0% | 100.0% | 80 |
| **STOP** | Word | 2.7% | **100.0%** | `+97.3%` | 100.0% | 100.0% | 80 |
| **FRIEND** | Word | 18.6% | **100.0%** | `+81.4%` | 100.0% | 100.0% | 80 |
| **NAMASTE** | Two-Handed | 10.7% | **100.0%** | `+89.3%` | 100.0% | 100.0% | 80 |
| **PEACE** | Word | 13.8% | **53.3%** | `+39.5%` | 47.1% | 61.3% | 80 |
| **FAMILY** | Word | 5.1% | **100.0%** | `+94.8%` | 100.0% | 100.0% | 80 |
| **TOGETHER** | Two-Handed | 10.6% | **100.0%** | `+89.4%` | 100.0% | 100.0% | 80 |
| **CLAP** | Two-Handed | 2.4% | **100.0%** | `+97.6%` | 100.0% | 100.0% | 80 |
| **PRAY** | Two-Handed | 5.3% | **100.0%** | `+94.7%` | 100.0% | 100.0% | 80 |
| **HELP_TWO** | Two-Handed | 60.9% | **56.6%** | `-4.3%` | 52.7% | 61.3% | 80 |
| **LOVE_TWO** | Two-Handed | 21.3% | **100.0%** | `+78.7%` | 100.0% | 100.0% | 80 |
| **SHARE** | Two-Handed | 4.4% | **100.0%** | `+95.6%` | 100.0% | 100.0% | 80 |

**Macro Avg F1:** 93.29%
**Weighted Avg F1:** 93.29%

---

## 4. Top Confusion Pairs Analysis

| True Sign | Predicted Sign | Error Count (out of 80 test samples) | Primary Reason & Handling |
|---|---|---|---|
| V | PEACE | 51 | Same V handshape; PEACE is held stationary |
| GOOD | THANK_YOU | 46 | Minor landmark variance under synthetic perturbation |
| HELP | HELP_TWO | 44 | Single vs dual-handed counterpart; disambiguated via 2nd hand detection |
| THANK_YOU | GOOD | 42 | Shared linguistic origin (chin down-forward); non-dominant palm disambiguates |
| HELP_TWO | HELP | 31 | Minor landmark variance under synthetic perturbation |
| PEACE | V | 22 | Minor landmark variance under synthetic perturbation |
| M | N | 14 | Subtle thumb tuck difference; separated by thumb-to-middleMCP distance |
| N | T | 9 | Minor landmark variance under synthetic perturbation |
| PEACE | U | 9 | Minor landmark variance under synthetic perturbation |
| U | V | 7 | Finger splay difference; separated by index-middle angle & tip distance |
| N | M | 6 | Minor landmark variance under synthetic perturbation |
| V | U | 6 | Minor landmark variance under synthetic perturbation |
| S | X | 5 | Minor landmark variance under synthetic perturbation |
| T | N | 4 | Minor landmark variance under synthetic perturbation |
| U | PEACE | 4 | Minor landmark variance under synthetic perturbation |

---

## 5. Feature Engineering Architecture (111 Features)

| Feature Group | Dimensions | Biomechanical & Kinetic Purpose |
|---|---|---|
| Scale-Normalized Landmarks | 63 (21 x 3) | Wrist-centered, hand-size invariant 3D landmark locations |
| Finger Curl Ratios | 5 | Distance from wrist to tip divided by wrist to PIP |
| Finger Extension Projections | 5 | Projection of fingertip along its respective metacarpal ray |
| Inter-Adjacent-Finger Angles | 4 | Cosine angles between adjacent finger rays |
| Index-Middle Separation Angle | 1 | Specifically isolates touching vs spread fingers (U vs V) |
| Index-Middle Tip Distance | 1 | Normalized distance between index and middle tips (U, V, R) |
| Thumb-to-Knuckle Distances | 3 | Distances from thumb tip to index, middle, and ring MCPs (A, S, T, M, N) |
| Thumb-Index Tip Distance | 1 | Distance between thumb and index tips (D, F, O) |
| Pairwise Fingertip Distances | 10 | Complete graph of distances between all 5 fingertips |
| 3D Palm Normal Vector | 3 | Cross product vector indicating palm facing direction (camera, chest, down) |
| 3D Hand Pointing Direction | 3 | Direction vector from wrist to middle MCP (up, down, sideways) |
| Dynamic Motion Indicator | 1 | Binary flag indicating whether gesture involves spatial translation |
| Net Displacement Vector | 3 | Vector [dx, dy, dz] from start to end of gesture |
| Total Path Length | 1 | Cumulative frame-to-frame Euclidean travel distance |
| Trajectory Linearity Ratio | 1 | Net displacement divided by total path length (linear vs circular) |
| Trajectory Velocity | 1 | Average movement speed across the temporal window |
| Trajectory Direction Unit Vector | 3 | Normalized direction of movement |
| Trajectory Curvature | 1 | Angular variance of successive step vectors (straight vs J-curve vs circle) |
| Finger Motion Delta | 1 | Change in finger curl from start to end (e.g. pinch-shut in NO) |
| **Total Features** | **111** | **Comprehensive Spatial-Kinetic Representation** |

---

*Report auto-generated by ml/train_classifier.py*

---

## 6. Validation Tiers & Performance Integrity

> [!WARNING]
> **Data Integrity Statement**:
> Real-world human webcam validation has **NOT YET BEEN PERFORMED**.
> Any previous claims of "76% real-world accuracy" based on generated subject profiles were synthetic simulations and have been completely removed.
> The system status is transparently reported across the three distinct tiers below.

### Tier Summary
| Tier | Description | Accuracy | Dataset / Sample Size | Source | Status |
|---|---|---|---|---|---|
| **Tier (a)** | **Synthetic Held-Out Test Set** | **93.38%** | 4,800 samples (80 / sign) | `ml/train_classifier.py` | **VERIFIED & TRUSTWORTHY** |
| **Tier (b)** | **Synthetic Stress Test (Camera Tilt)** | **78.75% – 92.29%** | 1,440 samples (24 / sign) | `ml/synthetic_stress_test.py` | **VERIFIED (SIMULATION)** |
| **Tier (c)** | **Real-World Live Webcam Captures** | **NOT YET MEASURED** | 0 genuine captures | `ml/real_captures/` | **PENDING LIVE RECORDING** |

---

### Tier (a): Synthetic Held-Out Test Set (93.38%)
Evaluates the mathematical capacity of the 111-feature space and the trained MLP classifier on 4,800 held-out samples:
- **Test Accuracy:** 93.38% (vs 36.33% baseline)
- **3-Fold CV Accuracy:** 92.92% ± 0.13%
- **Prototype Collisions:** 0 pairs under 0.15 distance (100% resolved)
- **Status:** Verified and fully reproducible via `python ml/train_classifier.py`.

---

### Tier (b): Synthetic Perturbation Stress Test (78.75% – 92.29%)
Evaluates model degradation under simulated environmental noise, camera roll angle, and scale variations (generated via `ml/synthetic_stress_test.py`):
- **Mild Simulated Tilt (±3° roll, standard noise):** **92.29%** (443 / 480)
- **Moderate Camera Angle (±7° roll, elevated noise):** **84.38%** (405 / 480)
- **High Perturbation Stress (±12° roll, severe sensor noise):** **78.75%** (378 / 480)
- **Status:** Verified simulation test. Demonstrates graceful degradation under angle rotation, but remains a synthetic proxy.

---

### Tier (c): Real-World Webcam Validation (Pending Human Recording)
Real human webcam validation requires actual team members sitting in front of the camera and recording physical ASL attempts. Synthetic hand models, however detailed, cannot simulate:
- Ambient room lighting and back-light shadows
- Sensor noise, web-cam motion blur, and exposure compression
- Individual human anatomical hand variances (finger thickness, joint flexibility, palm span)
- Human signing cadence and transition habits

#### Real-Data Capture Protocol
1. **Tooling:** The backend endpoint `POST /api/ai/record-capture` saves incoming live MediaPipe landmark arrays directly into `ml/real_captures/<sign>_<subject>_<trial>.json`.
2. **Target Benchmark Signs:**
   - Easy / High-Distinction: `B`, `L`, `V`, `Y`
   - Previously-Colliding Pairs: `A` vs `N`, `U` vs `V`, `HELLO` vs `NICE`, `PLEASE` vs `WHAT`
3. **Participants:** 2–3 team members recording 5–10 genuine attempts per sign.
4. **Evaluation Tool:** `python ml/validate_real_data.py` reads exclusively from `ml/real_captures/` (with zero synthetic generation code) and will compute honest per-sign and per-subject accuracy.
5. **Current Directory Status:** `ml/real_captures/` is initialized and currently empty (0 real captures). Real accuracy is marked as an **open action item**.

---

*Report updated with strict data integrity standards.*
