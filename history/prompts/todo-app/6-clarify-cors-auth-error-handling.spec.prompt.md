---
id: 6
title: Clarify CORS Auth Error Handling
stage: spec
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: todo-app
branch: master
user: user
command: /sp.clarify
labels:
  - clarification
  - cors
  - authentication
  - error-handling
  - registration
links:
  spec: specs/master/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/master/spec.md
tests: []
---

## Prompt

I have a full-stack Todo app:

- Frontend: React on localhost:3000
- Backend: FastAPI on localhost:8001
- Database: PostgreSQL on localhost:5432

Current issues:

1. When a new user registers, the backend returns a 500 Internal Server Error:
 , This indicates that PostgreSQL is not running or not accepting connections. As a result, registration fails and the dashboard never opens.

2. Even when the backend is running, the frontend shows CORS errors:
,  This prevents Axios requests from reaching the backend.

Tasks for Claude:

- Fix backend so that registration works and connects to PostgreSQL correctly.
- Add CORS middleware to FastAPI backend to allow requests from localhost:3000.
- Ensure frontend Axios baseURL points to http://localhost:8001.
- After successful registration, the user should be automatically redirected to /dashboard.
- Provide exact code snippets for FastAPI CORS setup, Axios configuration, and registration redirect logic.

## Response

Executed `/sp.clarify` workflow to identify and resolve spec ambiguities related to the reported issues.

### Questions Asked (5 of 5)

1. **Database error handling**: Return generic 500 error with "Internal Server Error" message
2. **Post-registration flow**: Redirect to login page with success message, require manual login
3. **CORS policy**: Allow all origins (*) for maximum flexibility
4. **JWT token storage**: localStorage - simple access, persists across tabs/sessions
5. **Frontend error display**: Inline error messages below the form/component

### Spec Updates Made

- Added backend error handling policy to User Experience & Error Handling section
- Added frontend error display strategy (inline messages)
- Added registration flow (redirect to login, no auto-login)
- Added CORS policy to Constraints section (allow all origins)
- Added JWT token storage policy to Constraints section (localStorage)
- Created Session 2026-01-17 in Clarifications with all 5 Q&A entries

### Coverage Summary

All taxonomy categories now marked as Clear or Resolved:
- Functional Scope & Behavior: Clear
- Domain & Data Model: Clear
- Interaction & UX Flow: Resolved
- Non-Functional Requirements: Clear
- Integration & External Dependencies: Resolved
- Edge Cases & Failure Handling: Resolved
- Constraints & Tradeoffs: Resolved
- Terminology & Consistency: Clear
- Completion Signals: Clear

### Outcome

Spec updated at `specs/master/spec.md`. Ready to proceed with `/sp.plan` or direct implementation of the fixes.
