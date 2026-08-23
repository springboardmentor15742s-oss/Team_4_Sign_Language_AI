# Chinmayee's Dataset Integration Guide (`team_master/dataset_docs/dataset_guide.md`)

## Datasets Supported

1. **Sign Language MNIST**:
   - Format: 28x28 grayscale pixel CSV (784 features per row).
   - Classes: 24 (A-Z except J & Z).
   - Target: Baseline static gesture classifier.

2. **ASL Alphabet**:
   - Format: 200x200 RGB color images.
   - Classes: 29 (A-Z, space, delete, nothing).
   - Target: High-resolution CNN feature extraction.

3. **WLASL (Word-Level ASL)**:
   - Format: MP4 video clips & landmark JSON annotations.
   - Classes: 100 common words.
   - Target: Dynamic video sequence recognition.
