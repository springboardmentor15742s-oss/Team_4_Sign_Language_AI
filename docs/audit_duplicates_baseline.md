# Audit Report: Baseline Prototype Collisions (6D Feature Space)
Analyzed 60 signs | 1770 total pairs
**Critical Collisions (Euclidean Distance < 0.15): 80 pairs**

## Summary of Exact Duplicates (Distance = 0.0000)
These sign pairs have literally IDENTICAL 6D coordinates in the baseline generator:

| Pair # | Sign A | Sign B | Distance | Real-World ASL Difference |
|---|---|---|---|---|
| 1 | A | N | 0.0000 | A has thumb on side; N has thumb tucked under index/middle |
| 2 | U | V | 0.0000 | U fingers held together; V fingers spread apart |
| 3 | I | J | 0.0000 | I is static pinky; J traces a dynamic J-curve motion |
| 4 | HELLO | NICE | 0.0000 | HELLO waves outward from temple; NICE slides flat palm |
| 5 | NAMASTE | PRAY | 0.0000 | Flat palms pressed together |
| 6 | PLEASE | WHAT | 0.0000 | PLEASE circles chest; WHAT shakes palms up horizontally |
| 7 | THANK_YOU | FAMILY | 0.0000 | THANK_YOU moves from chin forward; FAMILY circles F-hands |
| 8 | WHEN | FRIEND | 0.0000 | WHEN circles index; FRIEND hooks index fingers |

## All Colliding Pairs (Distance < 0.15)
| Rank | Sign A | Sign B | Distance | Collision Severity |
|---|---|---|---|---|
| 1 | A | N | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 2 | I | J | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 3 | U | V | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 4 | HELLO | NICE | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 5 | THANK_YOU | FAMILY | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 6 | PLEASE | WHAT | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 7 | WHEN | FRIEND | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 8 | NAMASTE | PRAY | 0.0000 | CRITICAL: EXACT DUPLICATE (0.0000) |
| 9 | U | PEACE | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 10 | V | PEACE | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 11 | HELLO | THANK_YOU | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 12 | HELLO | FAMILY | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 13 | THANK_YOU | NICE | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 14 | NICE | FAMILY | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 15 | WHEN | WHO | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 16 | WHO | FRIEND | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 17 | S | YES | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 18 | LOVE | LOVE_TWO | 0.0500 | HIGH: Near-Identical (<=0.05) |
| 19 | R | NO | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 20 | W | WATER | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 21 | HELLO | CLAP | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 22 | THANK_YOU | PLEASE | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 23 | THANK_YOU | WHAT | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 24 | PLEASE | FAMILY | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 25 | PLEASE | SHARE | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 26 | HELP | HELP_TWO | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 27 | GOOD | SHARE | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 28 | NICE | CLAP | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 29 | WHAT | FAMILY | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 30 | WHAT | SHARE | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 31 | WHERE | WHEN | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 32 | WHERE | FRIEND | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 33 | NAMASTE | CLAP | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 34 | CLAP | PRAY | 0.0500 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 35 | HELLO | PLEASE | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 36 | HELLO | WHAT | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 37 | THANK_YOU | CLAP | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 38 | PLEASE | NICE | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 39 | NO | NAME | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 40 | NICE | WHAT | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 41 | WHERE | WHO | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 42 | FAMILY | CLAP | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 43 | A | T | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 44 | C | EAT | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 45 | N | T | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 46 | HOW | TOGETHER | 0.1000 | MEDIUM: Indistinguishable under noise (<=0.10) |
| 47 | S | SORRY | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 48 | A | M | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 49 | A | S | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 50 | M | N | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 51 | N | S | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 52 | R | U | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 53 | R | V | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 54 | Z | WHERE | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 55 | HELLO | NAMASTE | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 56 | HELLO | PRAY | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 57 | THANK_YOU | SHARE | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 58 | PLEASE | GOOD | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 59 | GOOD | WHAT | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 60 | NICE | NAMASTE | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 61 | NICE | PRAY | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 62 | FAMILY | SHARE | 0.1000 | LOW: High Confusion Risk (<0.15) |
| 63 | A | YES | 0.1118 | LOW: High Confusion Risk (<0.15) |
| 64 | N | YES | 0.1118 | LOW: High Confusion Risk (<0.15) |
| 65 | YES | SORRY | 0.1118 | LOW: High Confusion Risk (<0.15) |
| 66 | M | T | 0.1414 | LOW: High Confusion Risk (<0.15) |
| 67 | E | HOW | 0.1414 | LOW: High Confusion Risk (<0.15) |
| 68 | M | S | 0.1414 | LOW: High Confusion Risk (<0.15) |
| 69 | LOVE | SORRY | 0.1414 | LOW: High Confusion Risk (<0.15) |
| 70 | G | Q | 0.1414 | LOW: High Confusion Risk (<0.15) |
| 71 | R | NAME | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 72 | R | PEACE | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 73 | HELLO | SHARE | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 74 | THANK_YOU | NAMASTE | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 75 | THANK_YOU | PRAY | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 76 | PLEASE | CLAP | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 77 | NICE | SHARE | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 78 | WHAT | CLAP | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 79 | NAMASTE | FAMILY | 0.1500 | LOW: High Confusion Risk (<0.15) |
| 80 | FAMILY | PRAY | 0.1500 | LOW: High Confusion Risk (<0.15) |