---
id: "001"
title: "Fix 422 Dashboard Metadata API Calls"
stage: general
date: "2026-02-12"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: shuaibali
command: "Fix 422 error on priorityApi.getPriorities() and tagApi.getTags()"
labels: ["bug-fix", "api", "auth", "vercel-proxy", "422"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/vercel.json
  - frontend/src/utils/api.ts
  - frontend/src/providers/AuthProvider.tsx
  - frontend/src/app/dashboard/page.tsx
tests: []
---

## Prompt

My Next.js dashboard page is throwing a 422 error when calling:

priorityApi.getPriorities()
tagApi.getTags()

Error:
AxiosError: Request failed with status code 422

This happens inside:
src/app/dashboard/page.tsx

Please:

1. Check if the API endpoints require authentication (JWT token)
   - If yes, ensure Authorization: Bearer <token> is correctly attached.

2. Check if the backend requires query parameters like user_id, limit, offset.
   - If required, update frontend API calls to send them.

3. Ensure request structure matches FastAPI Pydantic schema.

4. Add proper error logging to see backend validation details.

5. Fix the dashboard so metadata loads correctly without 422.

Do NOT change backend logic.
Only fix frontend API calls and headers properly.

## Response

### Root Cause Analysis

Three issues identified:

**1. Vercel proxy bypass (primary 422 cause)**
`vercel.json` set `NEXT_PUBLIC_API_URL = 'https://shuaibali-todo-backend.hf.space'` as a build-time env variable. This caused all API calls to go **directly** to HuggingFace Spaces, bypassing the Vercel rewrite proxy. HF Spaces has an extra proxy layer that intercepts/mangles the `Authorization` header, causing the backend to receive invalid auth and potentially returning 422.

Fix: Removed `NEXT_PUBLIC_API_URL` from `vercel.json` env block. In production, `NEXT_PUBLIC_API_URL` is now undefined → `api.ts` uses `''` (relative paths) → Vercel's `/api/:path*` rewrite proxies calls to the HF backend as same-origin. In dev, `.env.local` still provides `http://localhost:8000`.

**2. AuthProvider user unwrapping bug**
The `/api/v1/me` endpoint returns `{ user: { id, email, ... } }` (nested), but `fetchUserData` did `setUser(response.data)` which set `user` to `{ user: {...} }` instead of the actual user object. Fixed to `response.data.user ?? response.data`.

**3. Missing error logging**
The `fetchMetadata` catch block only logged the error object, hiding the FastAPI 422 detail body. Added explicit logging of `error.response?.status` and `error.response?.data` with special 422 handling.

### Files Changed

- `frontend/vercel.json`: Removed `env.NEXT_PUBLIC_API_URL`
- `frontend/src/utils/api.ts`: `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''`; fixed refresh interceptor hardcoded URL
- `frontend/src/providers/AuthProvider.tsx`: `setUser(response.data.user ?? response.data)`
- `frontend/src/app/dashboard/page.tsx`: Added token guard + detailed 422 error logging in `fetchMetadata`
