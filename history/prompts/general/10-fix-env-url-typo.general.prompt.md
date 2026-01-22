---
id: 10
title: Fix API URL Typo in env.local
stage: general
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: user
command: /sp.clarify
labels: ["frontend", "bugfix", "env", "api-url", "configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/.env.local (modified)
tests:
  - Manual verification of env file content
---

## Prompt

The backend is healthy and running on http://localhost:8001.

However, registration fails with:
TypeError: Failed to construct 'URL': Invalid URL

This indicates that the frontend API base URL is undefined or invalid.

Please:
1. Check all frontend API configuration files (.env, .env.local).
2. Ensure NEXT_PUBLIC_API_URL is defined and equals:
   http://localhost:8001
3. Check Axios configuration (baseURL) in AuthProvider.tsx or any shared axios instance.
4. Remove any usage of new URL() with an undefined base.
5. Ensure all register/login requests hit:
   POST http://localhost:8001/api/v1/register
6. After successful registration, redirect the user to /dashboard.

Fix the issue so that a newly registered user is automatically redirected to the dashboard.

## Response snapshot

### Root Cause

The `.env.local` file contained an invalid URL with a typo:
```
NEXT_PUBLIC_API_URL=http://localhost:8001s
```
The extra `s` at the end (`8001s` instead of `8001`) caused the URL to be invalid, triggering the `TypeError: Failed to construct 'URL': Invalid URL` error.

### Fix Applied

Corrected the URL in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Verification

1. **Axios configuration** (`frontend/src/utils/api.ts:5`): Uses `process.env.NEXT_PUBLIC_API_URL` with fallback to `http://localhost:8000`. Configuration is correct.

2. **Registration redirect** (`frontend/src/app/components/Auth/RegisterForm.tsx:54`): Already implements `router.push(redirectTo)` where `redirectTo` defaults to `'/dashboard'`. No changes needed.

3. **No `new URL()` calls** found in frontend source code - the error was from axios/fetch attempting to parse the invalid URL.

### Next Step

Restart the Next.js development server for the environment variable change to take effect:
```bash
cd frontend && npm run dev
```

## Outcome

- Impact: Fixed registration failure caused by invalid API URL
- Tests: Env file verified, no new URL() calls in source
- Files: 1 file modified (frontend/.env.local)
- Next prompts: Test registration flow end-to-end after server restart
- Reflection: Always validate .env files for typos when URL parsing errors occur

## Evaluation notes (flywheel)

- Failure modes observed: Typo in env file causing invalid URL
- Graders run and results (PASS/FAIL): Env file content PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add .env.example with correct values as reference
