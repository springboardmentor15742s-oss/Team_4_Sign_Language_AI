# Practice → Skill Mastery → AI Feedback: Integration Flow

## Overview
This document explains the database write sequence that happens every time a
learner completes one AI gesture practice attempt on the AI Practice screen.
It builds on the schema and queries defined in `schema.sql` and `queries.sql`
(Milestone 2, branch `pragathi/week2-milestone2`).

## Trigger
A learner selects a sign, practices it in front of the webcam, and the
frontend sends the captured hand landmarks to Chinmayee's backend endpoint:

```
POST /api/ai/evaluate
```

The response returns:
- `predicted_sign`
- `accuracy_percentage`
- `is_correct`
- `corrections` (list of coaching tips)

As soon as this response reaches the frontend, three database writes happen
in sequence.

## Write Sequence

**Step 1 — Insert into `Practice_History`**
A new row is logged for this one practice attempt: the target sign, the
predicted sign, accuracy score, correctness, duration, and session id.
This must happen first because `AI_Practice_Feedback` references this row's
`practice_id` as a foreign key — without it, there is nothing to link the
feedback to.

**Step 2 — Update `Skill_Mastery`**
The learner's mastery percentage for that specific sign is recalculated as
the average of all their `accuracy_score` values in `Practice_History` for
that learner + sign combination. Status is then set based on that average:

| mastery_percentage | status         |
|---------------------|----------------|
| >= 80                | Mastered       |
| 50–79                 | In Progress    |
| < 50                   | Needs Practice |

Unlike Practice_History, this table does not grow with every attempt — it
holds one row per learner per sign, updated in place each time, so it always
reflects the learner's current skill level rather than a single attempt.

**Step 3 — Insert into `AI_Practice_Feedback`**
The AI's correction messages (e.g. "Hand angle optimal", "Good thumb
position") are saved, linked back to the exact practice attempt via
`practice_id`. This is stored separately from the `Feedback` table, which is
unrelated — that table holds a learner's course review, not AI-generated
gesture corrections.

## Why this order matters
Practice_History is inserted first because both later steps depend on data
it either creates (`practice_id`, for AI_Practice_Feedback) or updates from
(`accuracy_score` history, for Skill_Mastery). Running these out of order
would either break the foreign key link or use stale accuracy data.

## Volume expectation
There is no batching or limit — every single practice attempt produces
exactly one new row in `Practice_History` and one new row in
`AI_Practice_Feedback`. `Skill_Mastery` does not grow per attempt; it holds
a fixed one row per learner/sign pair that is simply updated.

## Related files
- `schema.sql` — table definitions and foreign keys
- `queries.sql` — the actual SQL for each of the three steps above
