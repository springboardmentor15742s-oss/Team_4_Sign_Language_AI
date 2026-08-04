# Dataset Processing — Implementation Explanation

**Project:** Sign Language Learning & Assessment Platform  
**Owner:** Chinmayee Badiger  
**Branch:** `chinmayee-week1`  
**Related doc:** [`Dataset_Integration_Guide.md`](./Dataset_Integration_Guide.md)

---

## 1. What is already done (Week 1)

These items are complete on `chinmayee-week1` and do **not** need to be re-done:

| Item | Location |
|------|----------|
| Dataset research & comparison (4 datasets) | `docs/Dataset_Integration_Guide.md` |
| Download sources, sizes, class structures | Same guide, sections 4–7 |
| Local folder layout under `datasets/raw/` | `datasets/raw/<dataset>/` placeholders |
| Gitignore rules so raw media is not committed | `.gitignore` + guide §3 |
| Pointer README for teammates | `datasets/README.md` |

**Out of scope of the Week 1 guide:** actual download of large files, training code, and full preprocessing scripts. Those are the changes described below.

---

## 2. Goal of the next changes

Turn **raw** downloads into **model-ready** data:

```text
datasets/raw/   →   preprocess scripts   →   datasets/processed/
```

Downstream ML (gesture recognition, assessment) should read from `datasets/processed/` (or loaders that call the same transforms), never assume absolute paths on one machine.

---

## 3. Changes you need to implement

### 3.1 Prerequisites (before any code)

- [ ] Set up Kaggle API (`~/.kaggle/kaggle.json`) — see guide §8  
- [ ] Download **Sign Language MNIST** into `datasets/raw/sign_language_mnist/`  
- [ ] Confirm `sign_mnist_train.csv` and `sign_mnist_test.csv` exist  
- [ ] Confirm `git status` does **not** list thousands of dataset files as staged  

Optional later: download ASL Alphabet (~1 GB), then WLASL-100, then Phoenix.

---

### 3.2 Project layout to add

Create an ML / preprocessing area (suggested; adjust if the team agrees on another path):

```text
ml/
├── __init__.py
├── config.py                 # paths from env / defaults
├── preprocess_mnist.py       # Sign Language MNIST loader + save
├── preprocess_asl.py         # ASL Alphabet (after MNIST works)
├── preprocess_wlasl.py       # WLASL-100 frame/landmark pipeline (later)
└── requirements-ml.txt       # pandas, numpy, pillow, etc.
```

Processed outputs (gitignored contents; keep folder via `.gitkeep`):

```text
datasets/processed/
├── sign_language_mnist/
│   └── mnist.npz             # or train/ / test/ tensors
├── asl_alphabet/             # resized / split images or npz
└── wlasl/                    # sequences / landmarks (later)
```

---

### 3.3 Config / environment

Add env vars (e.g. in `backend/.env.example` or a root `.env.example`) so paths are not hard-coded:

```env
DATASETS_ROOT=./datasets/raw
DATASET_MNIST_DIR=./datasets/raw/sign_language_mnist
DATASET_ASL_DIR=./datasets/raw/asl_alphabet
DATASET_WLASL_DIR=./datasets/raw/wlasl
DATASET_PHOENIX_DIR=./datasets/raw/rwth_phoenix
PROCESSED_ROOT=./datasets/processed
```

`ml/config.py` should resolve these paths relative to the repo root.

---

### 3.4 Sign Language MNIST preprocessing (implement first)

**Input:** CSV rows — `label` + 784 pixels.  
**Output:** arrays ready for a CNN.

Required steps in `preprocess_mnist.py`:

1. Read `sign_mnist_train.csv` and `sign_mnist_test.csv`.  
2. Split labels vs pixels.  
3. Reshape pixels to `(N, 28, 28, 1)`.  
4. Normalize to `[0, 1]` (divide by `255`).  
5. Map labels carefully (24 classes; **J and Z excluded** — indices are not plain A–Z).  
6. Save under `datasets/processed/sign_language_mnist/` (e.g. `mnist.npz`).  
7. Provide a small CLI or `if __name__ == "__main__"` entry point:

```bash
python -m ml.preprocess_mnist
```

**Acceptance check:** script runs locally; processed file loads; shapes look like `(27455, 28, 28, 1)` train and `(7172, 28, 28, 1)` test (approx.).

---

### 3.5 ASL Alphabet preprocessing (implement second)

**Input:** folder-per-class images under `datasets/raw/asl_alphabet/`.  
**Output:** resized, normalized, train/val split.

Required steps in `preprocess_asl.py`:

1. Walk class folders (`A`–`Z`, `space`, `del`/`delete`, `nothing` — 29 classes).  
2. Resize all images to one size (team choice: e.g. `64×64` or `128×128`).  
3. Normalize to `[0, 1]`.  
4. Stratified train/val split.  
5. Augmentation policy: brightness/scale OK; **avoid random horizontal flip** (ASL is orientation-sensitive).  
6. Write results to `datasets/processed/asl_alphabet/`.  

**Acceptance check:** class count = 29; no raw ~1 GB tree committed to git.

---

### 3.6 WLASL preprocessing (later — Milestone 2)

**Input:** `WLASL_v0.3.json` + videos under `datasets/raw/wlasl/`. Prefer **WLASL100**.

Required steps (high level) in `preprocess_wlasl.py`:

1. Filter metadata to the 100-word subset.  
2. For each clip: sample a fixed number of frames **or** extract MediaPipe hand landmarks over time.  
3. Pad / truncate sequences to a fixed length.  
4. Save sequences + labels under `datasets/processed/wlasl/`.  
5. Document which subset was used (100 / 300 / …) in a short note or model card.

---

### 3.7 RWTH-PHOENIX (stretch / advanced)

- Obtain data only after license/access on the official RWTH page.  
- Keep vendor folder layout under `datasets/raw/rwth_phoenix/`.  
- Preprocess using Phoenix train/dev/test protocols if reporting benchmark numbers.  
- Remember: this is **German Sign Language (DGS)**, not ASL — do not use it as the primary alphabet dataset.

---

### 3.8 Optional: wire into backend / existing stub

Teammate branch `ankur/week1-frontend` has a stub:

- `ml/dataset_pipeline.py` — metadata + `preprocess_mnist_sample()` for a single vector  
- `backend/routers/dataset.py` — REST metadata listing only  

If the team merges that work, your changes should:

- [ ] Replace / extend the stub with real loaders that read `datasets/raw/` and write `datasets/processed/`  
- [ ] Keep API routes returning **metadata** (and maybe “processed ready: yes/no”), not uploading raw datasets  
- [ ] Avoid duplicating conflicting pipeline files — one shared `ml/` package

---

### 3.9 Documentation updates (small follow-ups)

- [ ] Link this file from `datasets/README.md` (“How to process”).  
- [ ] Add a short “Preprocessing” subsection to `Dataset_Integration_Guide.md` pointing here.  
- [ ] In the PR description: list which datasets were downloaded locally and which preprocess scripts were added.  
- [ ] Never document or commit Kaggle tokens / raw zip contents.

---

## 4. Suggested implementation order

| Step | Work | Priority |
|------|------|----------|
| 1 | Kaggle setup + download MNIST | Must |
| 2 | `ml/config.py` + `preprocess_mnist.py` + save to `processed/` | Must |
| 3 | Smoke-test: load `mnist.npz` in a notebook or tiny train script | Must |
| 4 | Download ASL Alphabet + `preprocess_asl.py` | Should |
| 5 | Align with Ankur’s `dataset_pipeline` / API after merge | Should |
| 6 | WLASL-100 frame or landmark pipeline | Milestone 2 |
| 7 | Phoenix continuous pipeline | Stretch |

---

## 5. What not to implement / commit

- Do **not** `git add` contents of `datasets/raw/` or large blobs under `datasets/processed/` (npz checkpoints, video dumps, full image trees).  
- Do **not** push `kaggle.json` or `.env` secrets.  
- Do **not** block Week 1–2 on full WLASL (~50 GB) or Phoenix (~30 GB).  
- Do **not** treat MNIST as production webcam quality — it is for baseline / CI-friendly experiments only.

---

## 6. Definition of done (for your processing work)

You can consider the processing slice done when:

1. MNIST (and ideally ASL) can be preprocessed via a documented command from the repo root.  
2. Outputs land under `datasets/processed/` and are gitignored.  
3. Paths come from config/env, not hard-coded absolute paths.  
4. Teammates can follow this file + the Integration Guide without asking for your machine-specific setup.  
5. A PR on `chinmayee-week1` (or a follow-up branch) includes the **scripts + docs**, not the raw datasets.

---

## 7. Quick reference — preprocess rules by dataset

| Dataset | Core preprocess |
|---------|-----------------|
| Sign Language MNIST | Reshape `(28,28,1)`, `/255`, keep train/test CSVs |
| ASL Alphabet | Resize, normalize, stratified split, careful augmentation |
| WLASL | Frame sample or MediaPipe landmarks; fixed-length sequences |
| RWTH-PHOENIX | Follow official splits; DGS continuous / translation use only |

---

*This document explains the remaining implementation work for dataset processing. Download locations and storage rules stay in [`Dataset_Integration_Guide.md`](./Dataset_Integration_Guide.md).*
