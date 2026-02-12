---
id: "002"
title: "Localhost Only + UUID 422 Route Fix"
stage: general
date: "2026-02-12"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: shuaibali
command: "Switch to localhost, fix UUID 422 route ordering"
labels: ["bug-fix", "localhost", "fastapi", "route-ordering", "422", "pydantic"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/vercel.json (DELETED)
  - frontend/src/utils/api.ts
  - frontend/.env.local
  - frontend/.env.example
  - backend/src/api/v1/tasks.py
tests: []
---

## Prompt

Switch project to localhost only. Remove all Vercel config. Hardcode
http://localhost:8000 in api.ts. Fix UUID 422 error where dynamic route
/{task_id} catches static sub-paths.

## Response

### Changes Made

**Frontend:**
- Deleted `frontend/vercel.json` entirely
- `api.ts`: replaced env-var/proxy logic with hardcoded `const API_BASE_URL = 'http://localhost:8000'`
- `.env.local` / `.env.example`: cleared NEXT_PUBLIC_API_URL (no longer needed)

**Backend — two fixes in `tasks.py`:**

1. **Route ordering**: Moved `PATCH /{task_id}/complete` BEFORE `DELETE /{task_id}`
   so the more-specific sub-path is registered first. FastAPI/Starlette matches
   routes in definition order; having `/{task_id}` before `/{task_id}/complete`
   for the same method would cause the sub-path segment "complete" to be treated
   as a `task_id` UUID → 422 uuid_parsing error.

2. **`is_completed` body vs query param bug (root 422 cause)**: The PATCH endpoint
   had `is_completed: bool` declared as a bare function param — FastAPI treats this
   as a query parameter. But the frontend sends `{ is_completed: true }` as a JSON
   body. Added `ToggleCompleteRequest(BaseModel)` and changed the signature to
   `body: ToggleCompleteRequest` so FastAPI reads it from the request body, matching
   what the frontend sends.

### Final route order in tasks.py
```
GET  /           — list tasks
POST /           — create task
GET  /{task_id}  — get specific task
PUT  /{task_id}  — update task
PATCH /{task_id}/complete  ← MORE SPECIFIC, before DELETE
DELETE /{task_id}
```
