---
id: 10
title: Env Vars and API URL Migration
stage: general
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: Shuaibali0786
command: inline task
labels: ["env-vars","config","api-url","deployment","security"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/utils/api.ts
  - frontend/.env.local
tests:
  - none
---

## Prompt

I have a full-stack project with a frontend (Next.js/React) and a backend already deployed on Hugging Face Spaces.

Backend Production URL:
https://shuaibali-todo-backend.hf.space

I want to move all configuration and secrets into environment variables.

Please do the following:

1. Create a `.env.local` file in the frontend root with:
   NEXT_PUBLIC_API_URL=https://shuaibali-todo-backend.hf.space
   + secret placeholders

2. Update all frontend API calls to use process.env.NEXT_PUBLIC_API_URL instead of localhost URLs.

3. Ensure I can run the frontend with only `npm run dev` without starting backend locally.

4. Add `.env.local` and `.env` to `.gitignore` so secrets are never committed.

5. If any secrets or URLs are currently hardcoded, move them into `.env.local`.

6. Do not change UI or business logic.

## Response snapshot

- Only ONE hardcoded URL existed: `api.ts:3` — `const API_BASE_URL = 'http://localhost:8000'`
- Changed to: `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';`
- Rewrote `frontend/.env.local` with `NEXT_PUBLIC_API_URL=https://shuaibali-todo-backend.hf.space` and placeholder secrets.
- Root `.gitignore` already covers `.env`, `.env.local`, `.env*.local` — no change needed.
- No UI or business logic was touched.

## Outcome

- ✅ Impact: Frontend now points to production HF Space backend; local fallback preserved for dev
- 🧪 Tests: No automated tests run; change is a single-line config swap
- 📁 Files: frontend/src/utils/api.ts (line 3), frontend/.env.local (rewritten)
- 🔁 Next prompts: Set NEXT_PUBLIC_API_URL in Vercel/Netlify dashboard for production deploy
- 🧠 Reflection: All API calls routed through single apiClient — one-line change was sufficient

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): verify `npm run dev` hits HF Space instead of localhost
