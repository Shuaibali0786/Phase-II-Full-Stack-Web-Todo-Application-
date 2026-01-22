---
id: 8
title: Tasks CORS Registration Fix
stage: tasks
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: todo-app
branch: master
user: user
command: /sp.tasks
labels:
  - tasks
  - cors
  - registration
  - error-handling
  - implementation
links:
  spec: specs/master/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/master/tasks.md
tests: []
---

## Prompt

/sp.tasks

(Executed after /sp.plan which created the implementation plan for fixing CORS and registration issues)

## Response

Executed `/sp.tasks` workflow to generate implementation tasks for the CORS and registration fix.

### Tasks Generated

Added 13 new fix tasks (TFIX01-TFIX13) organized into 5 phases:

**Phase FIX1: Verification (Pre-Fix Checks)**
- TFIX01: Verify PostgreSQL running
- TFIX02: Verify backend .env
- TFIX03: Verify frontend .env.local

**Phase FIX2: [USFIX1] CORS Configuration Fix (P1 MVP)**
- TFIX04: Update CORS middleware to allow all origins

**Phase FIX3: [USFIX2] Registration Flow Fix (P2)**
- TFIX05: Modify AuthProvider.register() - don't store tokens
- TFIX06: Update RegisterForm redirect to /auth/login?registered=true
- TFIX07: Add success message to LoginForm

**Phase FIX4: [USFIX3] Database Error Handling (P3)**
- TFIX08: Add database exception handler to auth router

**Phase FIX5: Verification & Testing**
- TFIX09-13: Restart servers, test complete flow, verify no CORS errors

### Task Summary

| Metric | Value |
|--------|-------|
| Total New Tasks | 13 |
| MVP Scope | 4 tasks (TFIX01-04) |
| Full Scope | 13 tasks |
| Parallel Opportunities | 4 (TFIX04, TFIX05-07, TFIX08 can run parallel) |

### Files to Modify

1. `backend/src/api/main.py` - CORS configuration
2. `frontend/src/providers/AuthProvider.tsx` - Register function
3. `frontend/src/app/components/Auth/RegisterForm.tsx` - Redirect logic
4. `frontend/src/app/components/Auth/LoginForm.tsx` - Success message
5. `backend/src/api/v1/auth.py` - Error handling

### Independent Test Criteria

- **USFIX1 (CORS)**: Frontend can make API requests without CORS errors
- **USFIX2 (Registration)**: New user redirected to login with success message
- **USFIX3 (Error Handling)**: Database errors return generic 500 message

### Outcome

Tasks added to `specs/master/tasks.md`. Ready to begin implementation with `/sp.implement` or manual execution.

### Suggested Next Command

Run `/sp.implement` to execute the fix tasks, or manually work through TFIX01-TFIX13.
