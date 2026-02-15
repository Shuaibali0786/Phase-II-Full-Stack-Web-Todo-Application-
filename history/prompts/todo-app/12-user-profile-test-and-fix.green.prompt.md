---
id: 12
title: User Profile Test and Fix
stage: green
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: fix/put-me-hashed-password-leak
user: Shuaibali
command: "now test the user profile feature"
labels: ["testing", "profile", "security", "bug-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/api/v1/users.py
tests:
  - "Test 1: GET /me unauthenticated → 401 ✅"
  - "Test 2: GET /me authenticated → no hashed_password ✅"
  - "Test 3: PUT /me update name → no hashed_password in response ✅"
  - "Test 4: Name update persisted on GET /me ✅"
  - "Test 5: PUT /me update email → normalized to lowercase ✅"
  - "Test 6: Login with new email after change ✅"
  - "Test 7: PUT /me email conflict → 409 ✅"
  - "Test 8: PUT /me uppercase case variant of taken email → 409 ✅"
  - "Test 9: Partial update (only first_name) → last_name unchanged ✅"
  - "Test 10: PUT /me unauthenticated → 401 ✅"
---

## Prompt

now test the user profile feature

## Response

### Bugs Found and Fixed

**Bug 1 (Security): `hashed_password` leaked in `PUT /me` response**
`update_current_user_profile` returned raw `User` SQLModel including `hashed_password`.
Fix: Return the same safe `{"user": {...}}` dict as `GET /me` in `auth.py`.

**Bug 2 (Security): Email conflict check bypassable via case variants**
Registration normalizes emails to lowercase but `PUT /me` did not.
Querying `User.email == "ProFB@..."` would miss `"profb@..."` in DB,
allowing one user to steal another's email address via uppercase variant.
Fix: Normalize with `.strip().lower()` before both the conflict check and assignment.

**Note: JWT invalidation on email change**
`get_current_user` looks up users by JWT `sub` (email). After changing email,
the old token is invalid. Frontend should re-login to get a fresh token after
profile email change. This is a known architectural limitation of email-as-sub JWTs.

### User Profile Test Results: 10/10 PASS

| Test | Description | Status |
|------|-------------|--------|
| 1 | GET /me unauthenticated → 401 | ✅ PASS |
| 2 | GET /me authenticated, no hashed_password | ✅ PASS |
| 3 | PUT /me update name, no hashed_password | ✅ PASS |
| 4 | Name update persisted | ✅ PASS |
| 5 | PUT /me update email (normalized to lowercase) | ✅ PASS |
| 6 | Login with new email after change | ✅ PASS |
| 7 | Email conflict same case → 409 | ✅ PASS |
| 8 | Email conflict uppercase variant → 409 | ✅ PASS |
| 9 | Partial update (first_name only) | ✅ PASS |
| 10 | PUT /me unauthenticated → 401 | ✅ PASS |

Merged to main as `65eb597`.
