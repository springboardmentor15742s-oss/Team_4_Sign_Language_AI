# Datasets

Raw sign language datasets for Team 4 live under `raw/`.

**Do not commit downloaded media or CSV dumps.** See the full guide:

→ [`docs/Dataset_Integration_Guide.md`](../docs/Dataset_Integration_Guide.md)

## Layout

```text
datasets/
├── raw/
│   ├── sign_language_mnist/   # ~1 MB CSV
│   ├── asl_alphabet/          # ~1 GB images
│   ├── wlasl/                 # ~50 GB videos (use WLASL100 first)
│   └── rwth_phoenix/          # ~30 GB continuous DGS
└── processed/                 # optional derived files (also gitignored)
```
