---
id: 11
title: Password Reset Test and Fix
stage: green
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: fix/register-password-reset-router
user: Shuaibali
command: "now test the password reset feature"
labels: ["testing", "password-reset", "bug-fix", "router"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/main.py
tests:
  - "Test 1: forgot-password valid email → 200 ambiguous message ✅"
  - "Test 2: forgot-password non-existent email → same 200 (no enumeration) ✅"
  - "Test 3: forgot-password missing field → 422 ✅"
  - "Test 4: reset-password valid token + strong password → 200 ✅"
  - "Test 5: Login with new password → 200 tokens issued ✅"
  - "Test 6: Login with old password → 401 ✅"
  - "Test 7: Reuse used token → 400 ✅"
  - "Test 8: Invalid/fake token → 400 ✅"
  - "Test 9: Weak password → 400 strength error ✅"
  - "Test 10: Missing fields → 422 ✅"
---

## Prompt

now test the password reset feature

## Response

### Bug Found and Fixed

**`password_reset` router was never registered in `main.py`.**
`POST /api/v1/forgot-password` and `POST /api/v1/reset-password` returned 404.

Fix: Added import and `include_router` call in `backend/src/main.py`:
```python
from src.api.v1.password_reset import router as password_reset_router
# ...
app.include_router(password_reset_router, prefix="/api/v1", tags=["auth"])
```

Deployed to HF Space. Verified end-to-end by fetching the reset token directly
from Neon DB via psycopg2 (table: `password_reset_tokens`).

### Password Reset Test Results: 10/10 PASS

| Test | Description | Status |
|------|-------------|--------|
| 1 | forgot-password valid email | ✅ PASS |
| 2 | forgot-password non-existent email (no enumeration) | ✅ PASS |
| 3 | forgot-password missing email → 422 | ✅ PASS |
| 4 | reset-password valid token | ✅ PASS |
| 5 | Login with new password | ✅ PASS |
| 6 | Login with old password fails | ✅ PASS |
| 7 | Used token rejected | ✅ PASS |
| 8 | Fake token rejected | ✅ PASS |
| 9 | Weak password rejected | ✅ PASS |
| 10 | Missing fields → 422 | ✅ PASS |

### Notes

- No email service — tokens are stored in DB only; real emails not sent.
- Frontend pages exist: `/auth/forgot-password` and `/auth/reset-password?token=<token>`.
- Token table name is `password_reset_tokens` (SQLModel auto-snake-cases class name).
- Merged to main as `73f3af8`.
