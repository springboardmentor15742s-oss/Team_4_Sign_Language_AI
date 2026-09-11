"""
SignLearn AI -- Sign Prototype Duplicate & Collision Auditor
============================================================
Audits the feature space of all 60 ASL signs to detect pairs with
Euclidean distance below a threshold (default 0.15).
Identifies signs that collapse to identical or near-identical coordinates.
"""

import numpy as np
from itertools import combinations
from pathlib import Path

# Original 6D representation for comparison
BASELINE_SIGN_FINGER_STATES = {
    "A": ([0.3, 0.0, 0.0, 0.0, 0.0], 0.3),
    "B": ([0.0, 1.0, 1.0, 1.0, 1.0], 0.8),
    "C": ([0.5, 0.5, 0.5, 0.5, 0.5], 0.5),
    "D": ([0.3, 1.0, 0.0, 0.0, 0.0], 0.8),
    "E": ([0.2, 0.1, 0.1, 0.1, 0.1], 0.2),
    "F": ([0.0, 0.0, 1.0, 1.0, 1.0], 0.7),
    "G": ([0.8, 1.0, 0.0, 0.0, 0.0], 0.1),
    "H": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.1),
    "I": ([0.0, 0.0, 0.0, 0.0, 1.0], 0.8),
    "J": ([0.0, 0.0, 0.0, 0.0, 1.0], 0.8),
    "K": ([0.8, 1.0, 1.0, 0.0, 0.0], 0.8),
    "L": ([1.0, 1.0, 0.0, 0.0, 0.0], 0.8),
    "M": ([0.3, 0.0, 0.0, 0.0, 0.0], 0.2),
    "N": ([0.3, 0.0, 0.0, 0.0, 0.0], 0.3),
    "O": ([0.4, 0.4, 0.4, 0.4, 0.4], 0.6),
    "P": ([0.7, 1.0, 1.0, 0.0, 0.0], 0.0),
    "Q": ([0.7, 1.0, 0.0, 0.0, 0.0], 0.0),
    "R": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.75),
    "S": ([0.2, 0.0, 0.0, 0.0, 0.0], 0.3),
    "T": ([0.4, 0.0, 0.0, 0.0, 0.0], 0.3),
    "U": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.85),
    "V": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.85),
    "W": ([0.0, 1.0, 1.0, 1.0, 0.0], 0.85),
    "X": ([0.0, 0.5, 0.0, 0.0, 0.0], 0.7),
    "Y": ([1.0, 0.0, 0.0, 0.0, 1.0], 0.7),
    "Z": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.8),
    "HELLO": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.9),
    "THANK_YOU": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.85),
    "PLEASE": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.8),
    "YES": ([0.2, 0.0, 0.0, 0.0, 0.0], 0.35),
    "NO": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.7),
    "HELP": ([0.9, 0.0, 0.0, 0.0, 0.0], 0.9),
    "LOVE": ([0.0, 0.0, 0.0, 0.0, 0.0], 0.2),
    "SORRY": ([0.1, 0.0, 0.0, 0.0, 0.0], 0.3),
    "GOOD": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.7),
    "BAD": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.2),
    "NAME": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.6),
    "NICE": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.9),
    "HOME": ([0.5, 1.0, 1.0, 1.0, 1.0], 0.7),
    "EAT": ([0.5, 0.5, 0.5, 0.5, 0.5], 0.4),
    "WATER": ([0.0, 1.0, 1.0, 1.0, 0.0], 0.8),
    "TIME": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.3),
    "WHAT": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.8),
    "WHERE": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.7),
    "WHEN": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.65),
    "HOW": ([0.1, 0.1, 0.1, 0.1, 0.1], 0.3),
    "WHO": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.6),
    "WHY": ([0.0, 1.0, 1.0, 1.0, 0.0], 0.2),
    "MORE": ([0.5, 0.5, 0.5, 0.5, 0.5], 0.7),
    "STOP": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.5),
    "FRIEND": ([0.0, 1.0, 0.0, 0.0, 0.0], 0.65),
    "NAMASTE": ([1.0, 1.0, 1.0, 1.0, 1.0], 1.0),
    "PEACE": ([0.0, 1.0, 1.0, 0.0, 0.0], 0.9),
    "FAMILY": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.85),
    "TOGETHER": ([0.1, 0.1, 0.1, 0.1, 0.1], 0.4),
    "CLAP": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.95),
    "PRAY": ([1.0, 1.0, 1.0, 1.0, 1.0], 1.0),
    "HELP_TWO": ([0.9, 0.0, 0.0, 0.0, 0.0], 0.95),
    "LOVE_TWO": ([0.0, 0.0, 0.0, 0.0, 0.0], 0.15),
    "SHARE": ([1.0, 1.0, 1.0, 1.0, 1.0], 0.75),
}

def audit_vector_dict(vector_dict, threshold=0.15):
    pairs = []
    for (k1, v1), (k2, v2) in combinations(vector_dict.items(), 2):
        arr1 = np.array(v1, dtype=np.float32)
        arr2 = np.array(v2, dtype=np.float32)
        dist = float(np.linalg.norm(arr1 - arr2))
        pairs.append((dist, k1, k2))
    pairs.sort(key=lambda x: x[0])
    colliding = [p for p in pairs if p[0] < threshold]
    return pairs, colliding

def run_baseline_audit():
    vecs = {k: v[0] + [v[1]] for k, v in BASELINE_SIGN_FINGER_STATES.items()}
    all_pairs, collisions = audit_vector_dict(vecs, threshold=0.15)
    
    docs_dir = Path(__file__).parent.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    report_file = docs_dir / "audit_duplicates_baseline.md"
    
    lines = [
        "# Audit Report: Baseline Prototype Collisions (6D Feature Space)",
        f"Analyzed {len(vecs)} signs | {len(all_pairs)} total pairs",
        f"**Critical Collisions (Euclidean Distance < 0.15): {len(collisions)} pairs**",
        "",
        "## Summary of Exact Duplicates (Distance = 0.0000)",
        "These sign pairs have literally IDENTICAL 6D coordinates in the baseline generator:",
        "",
        "| Pair # | Sign A | Sign B | Distance | Real-World ASL Difference |",
        "|---|---|---|---|---|",
        "| 1 | A | N | 0.0000 | A has thumb on side; N has thumb tucked under index/middle |",
        "| 2 | U | V | 0.0000 | U fingers held together; V fingers spread apart |",
        "| 3 | I | J | 0.0000 | I is static pinky; J traces a dynamic J-curve motion |",
        "| 4 | HELLO | NICE | 0.0000 | HELLO waves outward from temple; NICE slides flat palm |",
        "| 5 | NAMASTE | PRAY | 0.0000 | Flat palms pressed together |",
        "| 6 | PLEASE | WHAT | 0.0000 | PLEASE circles chest; WHAT shakes palms up horizontally |",
        "| 7 | THANK_YOU | FAMILY | 0.0000 | THANK_YOU moves from chin forward; FAMILY circles F-hands |",
        "| 8 | WHEN | FRIEND | 0.0000 | WHEN circles index; FRIEND hooks index fingers |",
        "",
        "## All Colliding Pairs (Distance < 0.15)",
        "| Rank | Sign A | Sign B | Distance | Collision Severity |",
        "|---|---|---|---|---|",
    ]
    
    for idx, (dist, k1, k2) in enumerate(collisions, 1):
        if dist == 0.0:
            sev = "CRITICAL: EXACT DUPLICATE (0.0000)"
        elif dist <= 0.05:
            sev = "HIGH: Near-Identical (<=0.05)"
        elif dist <= 0.10:
            sev = "MEDIUM: Indistinguishable under noise (<=0.10)"
        else:
            sev = "LOW: High Confusion Risk (<0.15)"
        lines.append(f"| {idx} | {k1} | {k2} | {dist:.4f} | {sev} |")
        
    report_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"[audit] Baseline report saved to: {report_file}")
    print(f"[audit] Found {len(collisions)} colliding pairs out of {len(all_pairs)} total pairs.")
    return collisions

if __name__ == "__main__":
    run_baseline_audit()
