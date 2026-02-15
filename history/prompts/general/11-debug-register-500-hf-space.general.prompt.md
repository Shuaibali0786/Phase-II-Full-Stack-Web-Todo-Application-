---
id: 11
title: Debug Register 500 HF Space
stage: general
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: Shuaibali0786
command: inline debug task
labels: ["debug","backend","500-error","database","connection-pool","hf-space"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/utils/api.ts
  - backend/src/core/database.py
  - backend/src/api/v1/auth.py
tests:
  - curl POST https://shuaibali-todo-backend.hf.space/api/v1/register → 500
  - curl GET https://shuaibali-todo-backend.hf.space/health → {"status":"healthy","service":"todo-api"} (missing database field)
---

## Prompt

Frontend is running on localhost:3000 using npm run dev.
Backend deployed on Hugging Face: https://shuaibali-todo-backend.hf.space

When I try to register a user, AxiosError 500 from AuthProvider.tsx register function.

1. Verify frontend uses correct backend URL from env vars
2. Check axios baseURL
3. Add console logging to confirm exact request URL
4. Test backend endpoint directly
5. Identify if: missing env vars / DB connection issue / validation error / CORS issue
6. Update request payload if needed

## Response snapshot

**Investigation findings:**
- CORS: ✅ fine — response headers show `access-control-allow-origin: http://localhost:3000`
- Frontend payload: ✅ correct — RegisterForm sends `{email, password, first_name, last_name}` matching backend `RegisterRequest`
- Env var URL: ✅ NEXT_PUBLIC_API_URL resolves to HF Space URL
- Backend health: `{"status":"healthy","service":"todo-api"}` — MISSING `database` field
  → Confirmed HF Space is running **outdated backend code** (old health endpoint had no DB field)
  → Old startup code likely never called `create_tables()` → `user` table may not exist → every DB query 500s
- Connection pool: `pool_size=20 + max_overflow=10 = 30` exceeds Neon free tier limit of 20 → exhaustion risk
- `backend/.env` is tracked in git → HF Space picks up DATABASE_URL from repo

**Changes made:**
1. `frontend/src/utils/api.ts` — added console.log in module scope to log resolved baseURL on load
2. `backend/src/core/database.py` — reduced pool_size 20→5, max_overflow 10→5, pool_recycle 3600→1800
3. `backend/src/api/v1/auth.py` — changed register 500 detail from opaque message to `f"Registration failed: {str(e)}"` for debugging

**Backend redeployment required** to apply fixes 2 & 3 to HF Space.

## Outcome

- ✅ Impact: Frontend URL confirmed via console.log; backend pool conserved; 500 errors now expose root cause
- 🧪 Tests: curl POST /api/v1/register returns 500 (pre-fix); after redeploy should succeed
- 📁 Files: frontend/src/utils/api.ts, backend/src/core/database.py, backend/src/api/v1/auth.py
- 🔁 Next prompts: Redeploy backend to HF Space; once redeploy is done, retry registration
- 🧠 Reflection: Deployed code != local code — always verify health endpoints for version drift

## Evaluation notes (flywheel)

- Failure modes observed: Deployed HF Space running old code; pool_size exceeding Neon free tier limit
- Graders run and results (PASS/FAIL): curl test → 500 FAIL (pre-fix)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): redeploy backend and retest register endpoint
