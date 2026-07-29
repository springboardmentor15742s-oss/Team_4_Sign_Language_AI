# Dataset Integration Guide

**Project:** Sign Language Learning & Assessment Platform  
**Module:** Dataset Research & Setup Guide  
**Team:** Team 4 — Infosys Springboard Internship 2026  
**Owner:** Chinmayee Badiger  
**Branch:** `chinmayee-week1` (assignment name `chinmayee/week1` — see note below)

---

## 1. Purpose

This document tells every developer on Team 4:

1. **Where** to download each of the four recommended sign language datasets  
2. **What** each dataset contains (size, format, classes, static vs dynamic)  
3. **How** to store raw files locally under `datasets/raw/` without committing them to Git  

Gesture recognition, assessment, and feedback modules depend on these datasets. Do **not** push raw media or CSV dumps to GitHub.

> **Branch naming note:** Git cannot create a branch named `chinmayee/week1` while a branch named `chinmayee` already exists (nested ref conflict). Work for this deliverable lives on **`chinmayee-week1`**.

---

## 2. Quick comparison

| Dataset | Approx. size | Type | Classes / vocabulary | Format | Best use in this project |
|---------|--------------|------|----------------------|--------|---------------------------|
| Sign Language MNIST | ~1 MB | Static | 24 letters | CSV | Rapid prototyping, baseline CNN |
| ASL Alphabet | ~1 GB | Static | 29 classes | RGB image folders | Main alphabet / hand-shape CNN |
| WLASL | ~50 GB | Dynamic video | 100 / 300 / 1000 / 2000 words | Video + JSON | Word-level / sequence models |
| RWTH-PHOENIX Weather | ~30 GB | Continuous video | Gloss sequences (DGS) | Frame sequences + annotations | Continuous recognition / translation (advanced) |

**Recommended order for the team**

1. Start with **Sign Language MNIST** (small, fast)  
2. Train production-quality static models on **ASL Alphabet**  
3. Add dynamic signs with **WLASL-100** first (not the full 2000-word set)  
4. Use **RWTH-PHOENIX** only for advanced continuous / translation experiments  

---

## 3. Local storage rules (required)

### 3.1 Why `datasets/raw/` is gitignored

Raw datasets are large (MB → tens of GB). Committing them would:

- Blow past GitHub file-size limits  
- Slow every clone for the whole team  
- Risk license violations if redistribution is restricted  

The repo `.gitignore` ignores contents of `datasets/raw/` and `datasets/processed/` while allowing placeholder `.gitkeep` files and this guide’s folder layout to stay in git.

### 3.2 Required directory layout

After cloning the repo, create / download into this structure (placeholders are already present):

```text
Team_4_Sign_Language_AI/
├── datasets/
│   ├── README.md                 # Short pointer to this guide
│   ├── raw/                      # RAW downloads only (gitignored contents)
│   │   ├── README.md
│   │   ├── sign_language_mnist/
│   │   ├── asl_alphabet/
│   │   ├── wlasl/
│   │   └── rwth_phoenix/
│   └── processed/                # Optional cleaned / resized outputs (gitignored)
└── docs/
    └── Dataset_Integration_Guide.md   # This file
```

### 3.3 Developer checklist

1. Clone the repo.  
2. Confirm `datasets/raw/<dataset_name>/` folders exist.  
3. Download each dataset using the links / CLI commands below.  
4. Extract archives **into** the matching `datasets/raw/...` folder (not into the repo root).  
5. Never `git add` zip/csv/video blobs from these folders — they should stay untracked.  
6. Put derived tensors, resized images, or train/val splits under `datasets/processed/` if needed.  
7. Document any extra preprocessing steps in your PR description or a short note under `docs/`.

### 3.4 Disk space planning

| What you download | Approx. free space needed |
|-------------------|---------------------------|
| MNIST only | < 50 MB |
| MNIST + ASL Alphabet | ~2 GB |
| + WLASL-100 subset | ~5–15 GB (varies by video source) |
| Full WLASL + PHOENIX | 80 GB+ recommended |

---

## 4. Dataset 1 — Sign Language MNIST

### Overview

| Field | Detail |
|-------|--------|
| **Name** | Sign Language MNIST |
| **Type** | Static image classification |
| **Approx. size** | ~1 MB (CSV) |
| **Resolution** | 28×28 grayscale |
| **Classes** | **24** (A–Z **excluding J and Z**, which require motion) |
| **Samples** | 27,455 train + 7,172 test ≈ **34,627** images |
| **Format** | CSV rows: `label` + 784 pixel columns |
| **Language** | American Sign Language (ASL) letters |
| **Project fit** | Week 1–2 prototyping; unit-test the training pipeline quickly |

### Download sources

| Source | URL |
|--------|-----|
| **Kaggle** | https://www.kaggle.com/datasets/datamunge/sign-language-mnist |
| **Kaggle CLI id** | `datamunge/sign-language-mnist` |

### Download & store locally

```bash
# From repo root (requires Kaggle API token in ~/.kaggle/kaggle.json)
mkdir -p datasets/raw/sign_language_mnist
cd datasets/raw/sign_language_mnist

# Option A — Kaggle CLI
kaggle datasets download -d datamunge/sign-language-mnist
unzip -o sign-language-mnist.zip
rm -f sign-language-mnist.zip   # optional cleanup

# Option B — Manual
# 1. Open the Kaggle URL above → Download
# 2. Move/extract CSVs into datasets/raw/sign_language_mnist/
```

### Expected class structure / files

Typical files after extract:

```text
datasets/raw/sign_language_mnist/
├── sign_mnist_train.csv
└── sign_mnist_test.csv
```

- Each row: integer `label` (0–24 mapping to letters without J/Z) + pixel values `pixel1` … `pixel784`.  
- Labels are **not** continuous A–Z indices; map carefully when decoding predictions.

### Usage guidelines

- **License:** Open / usable for education and research (confirm current Kaggle terms).  
- **Do:** Use for smoke tests, baseline CNNs, CI-friendly tiny experiments.  
- **Don’t:** Treat as production-quality webcam data (low resolution, grayscale only).  
- **Preprocess:** Reshape to `(28, 28, 1)`, normalize to `[0, 1]`, one-hot or sparse labels.

---

## 5. Dataset 2 — ASL Alphabet Dataset

### Overview

| Field | Detail |
|-------|--------|
| **Name** | ASL Alphabet Dataset |
| **Type** | Static RGB hand images |
| **Approx. size** | ~**1 GB** |
| **Resolution** | 200×200 color |
| **Classes** | **29** — A–Z + `space` + `delete` + `nothing` |
| **Samples** | ~**87,000** images |
| **Format** | Folder-per-class JPEG/PNG |
| **Language** | ASL alphabet / control gestures |
| **Project fit** | Primary static gesture / alphabet recognition model |

### Download sources

| Source | URL |
|--------|-----|
| **Kaggle** | https://www.kaggle.com/datasets/grassknoted/asl-alphabet |
| **Kaggle CLI id** | `grassknoted/asl-alphabet` |

### Download & store locally

```bash
mkdir -p datasets/raw/asl_alphabet
cd datasets/raw/asl_alphabet

kaggle datasets download -d grassknoted/asl-alphabet
unzip -o asl-alphabet.zip
rm -f asl-alphabet.zip
```

### Expected class structure

```text
datasets/raw/asl_alphabet/
├── asl_alphabet_train/
│   ├── A/
│   ├── B/
│   ├── ...
│   ├── Z/
│   ├── space/
│   ├── del/          # sometimes named "delete"
│   └── nothing/
└── asl_alphabet_test/
    └── ...           # test images (layout may differ by version)
```

**29 class folders (train):** `A`–`Z`, `space`, `del` / `delete`, `nothing`.

### Usage guidelines

- **License:** Check Kaggle dataset page; typically fine for academic / internship use.  
- **Do:** Train CNNs for letter-level accuracy scoring in the learning platform.  
- **Don’t:** Commit the unzipped tree (~1 GB) to git.  
- **Preprocess:** Resize consistently, augment (flip carefully — ASL is often orientation-sensitive), stratified train/val split.  
- **Note:** Real webcam frames will differ from studio-like dataset images; plan domain adaptation later.

---

## 6. Dataset 3 — WLASL (Word-Level American Sign Language)

### Overview

| Field | Detail |
|-------|--------|
| **Name** | WLASL — Word-Level American Sign Language |
| **Type** | Dynamic video (isolated words) |
| **Approx. size** | ~**50 GB** (full video corpus; depends on how videos are fetched) |
| **Vocabulary subsets** | **100 / 300 / 1000 / 2000** words |
| **Samples** | ~21,000+ video clips; 100+ signers |
| **Format** | Videos + JSON metadata (`WLASL_v0.3.json`) |
| **Language** | ASL words |
| **Project fit** | Dynamic gesture recognition (LSTM / Transformer); lessons beyond alphabet |

### Download sources

| Source | URL |
|--------|-----|
| **Official GitHub** | https://github.com/dxli94/WLASL |
| **Paper / project page** | Linked from the GitHub README |
| **Metadata** | JSON gloss list + YouTube / video IDs (follow repo scripts) |

WLASL often distributes **metadata + download scripts** rather than a single Kaggle zip. Follow the official repository instructions to obtain videos for the subset you need.

### Download & store locally

```bash
mkdir -p datasets/raw/wlasl
cd datasets/raw/wlasl

# Clone or download release assets / metadata from the official repo
# Example pattern (adjust to current WLASL README commands):
# git clone https://github.com/dxli94/WLASL.git temp_wlasl
# cp temp_wlasl/start_kit/WLASL_v0.3.json .
# Then run their downloader for the subset you need (prefer WLASL100 first)

# Suggested layout after download:
# datasets/raw/wlasl/
#   WLASL_v0.3.json
#   videos/
#     <video_id>.mp4
```

**Start with WLASL100** unless you have disk + GPU budget for larger subsets.

### Expected class / vocabulary structure

| Subset | Approx. word classes | When to use |
|--------|----------------------|-------------|
| WLASL100 | 100 | Default for Week 3–4 dynamic models |
| WLASL300 | 300 | Expanded vocabulary |
| WLASL1000 | 1000 | Large-scale experiments |
| WLASL2000 | 2000 | Full benchmark (heavy) |

Metadata JSON typically maps: gloss (word) → list of video IDs, signer IDs, split (train/val/test).

### Usage guidelines

- **License:** Often **C-UDA / academic research** — read the WLASL license; **do not** redistribute videos publicly if forbidden.  
- **Do:** Keep only the subset you train on; document which subset in model cards.  
- **Don’t:** Force-push videos into GitHub LFS unless the mentor explicitly requires it (prefer local / shared drive).  
- **Preprocess:** Sample frames or use MediaPipe landmarks over time; pad/truncate sequences to fixed length.  
- **Ethics:** Respect YouTube / source video terms when downloading.

---

## 7. Dataset 4 — RWTH-PHOENIX Weather (2014)

### Overview

| Field | Detail |
|-------|--------|
| **Name** | RWTH-PHOENIX-Weather 2014 |
| **Type** | Continuous sign language (sentence-level) |
| **Approx. size** | ~**30 GB** |
| **Language** | **German Sign Language (DGS)** — not ASL |
| **Content** | Weather-forecast signing with gloss / German annotations |
| **Typical frame size** | ~210×260 at ~25 FPS |
| **Format** | Video frame sequences + annotation files |
| **Project fit** | Advanced continuous recognition / translation (later milestones) |

### Download sources

| Source | URL |
|--------|-----|
| **Official page** | https://www-i6.informatik.rwth-aachen.de/~koller/RWTH-PHOENIX/ |
| **Related 2014T (translation)** | Linked from the same RWTH I6 pages |

Registration or academic request may be required — follow the instructions on the official page.

### Download & store locally

```bash
mkdir -p datasets/raw/rwth_phoenix
cd datasets/raw/rwth_phoenix

# 1. Visit the official RWTH-PHOENIX page
# 2. Accept license / request access as required
# 3. Download the release archives they provide
# 4. Extract into this folder, for example:
#
# datasets/raw/rwth_phoenix/
#   phoenix-2014.*/
#     annotations/
#     features/          # if pre-extracted features are provided
#     ...
```

Exact subfolder names depend on the package version you receive; keep the vendor layout and note it in your team chat.

### Expected structure (conceptual)

- Continuous **video / frame sequences** per weather sentence  
- **Gloss** annotations aligned to signing  
- Optional **German text** translations (Phoenix-2014T)  
- Train / dev / test splits defined by the benchmark  

### Usage guidelines

- **License:** Research / academic use — **do not** publish the raw corpus in a public repo.  
- **Language caveat:** This is **DGS**, not ASL. Use it for sequence-model learning and translation experiments, not as the primary ASL alphabet dataset.  
- **Do:** Treat as Milestone 3–4+ stretch work after MNIST / ASL Alphabet / WLASL100.  
- **Don’t:** Block Week 1–2 progress on obtaining the full 30 GB dump.  
- **Preprocess:** Follow Phoenix evaluation protocols if reporting benchmark numbers.

---

## 8. Kaggle API setup (MNIST & ASL Alphabet)

```bash
pip install kaggle

# 1. Kaggle → Account → Create New API Token
# 2. Save kaggle.json to:
#    macOS/Linux: ~/.kaggle/kaggle.json
#    Windows: C:\Users\<you>\.kaggle\kaggle.json
chmod 600 ~/.kaggle/kaggle.json   # macOS/Linux
```

Never commit `kaggle.json` or API keys.

---

## 9. Integration notes for backend / ML teammates

| Dataset key (suggested) | Local path | Status for Week 1 |
|-------------------------|------------|-------------------|
| `sign_language_mnist` | `datasets/raw/sign_language_mnist/` | Download first |
| `asl_alphabet` | `datasets/raw/asl_alphabet/` | Main static corpus |
| `wlasl` | `datasets/raw/wlasl/` | Metadata + WLASL100 videos |
| `rwth_phoenix` | `datasets/raw/rwth_phoenix/` | Optional / advanced |

Future code (training scripts, FastAPI dataset metadata routes) should **read paths from config** pointing at these folders — not hard-code absolute machine paths.

Example env / config idea:

```env
DATASETS_ROOT=./datasets/raw
DATASET_MNIST_DIR=./datasets/raw/sign_language_mnist
DATASET_ASL_DIR=./datasets/raw/asl_alphabet
DATASET_WLASL_DIR=./datasets/raw/wlasl
DATASET_PHOENIX_DIR=./datasets/raw/rwth_phoenix
```

---

## 10. Verification checklist

After setup, each developer should be able to answer **yes**:

- [ ] `docs/Dataset_Integration_Guide.md` is present in the clone  
- [ ] `datasets/raw/` exists with four dataset subfolders  
- [ ] MNIST CSVs are present locally (if working on static models)  
- [ ] `git status` does **not** show thousands of image/video files as staged  
- [ ] Team knows which subset of WLASL is being used (100 / 300 / …)  
- [ ] Phoenix license / access is acknowledged before download  

---

## 11. References

1. Sign Language MNIST — https://www.kaggle.com/datasets/datamunge/sign-language-mnist  
2. ASL Alphabet — https://www.kaggle.com/datasets/grassknoted/asl-alphabet  
3. WLASL — https://github.com/dxli94/WLASL  
4. RWTH-PHOENIX — https://www-i6.informatik.rwth-aachen.de/~koller/RWTH-PHOENIX/  
5. Project brief — `context.md` (Milestone 1: integrate sign language datasets)

---

## 12. Deliverable summary

| Item | Status |
|------|--------|
| Document download sources & Kaggle URLs | Done (sections 4–7) |
| File sizes & class structures for all 4 datasets | Done |
| Local storage under `datasets/raw/` + gitignore guidance | Done (section 3) |
| Branch for this work | `chinmayee-week1` |

**Out of scope for this document:** training code, model weights, uploading raw datasets to GitHub.
