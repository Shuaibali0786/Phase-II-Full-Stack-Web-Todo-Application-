# Tasks: Evolution of Todo - Full-Stack Web Application

**Feature**: Evolution of Todo - Full-Stack Web Application
**Date**: 2026-01-11 (Updated: 2026-01-17 - CORS & Registration Fix)
**Input**: Implementation plan from `specs/master/plan.md`

## Implementation Strategy

This project implements a full-stack Todo web application with Next.js frontend, FastAPI backend, Neon Serverless PostgreSQL database, Better Auth JWT authentication, and OpenAI GPT-4 integration. The application progresses through Basic (CRUD operations), Intermediate (priorities/tags/search), and Advanced (recurring tasks, due dates, AI chatbot) features.

---

## CRITICAL FIX: CORS & REGISTRATION ISSUES (2026-01-17) 🔥

**Goal**: Fix blocking issues preventing user registration and frontend-backend communication

**Issues Being Fixed**:
1. CORS errors blocking frontend requests to backend
2. Registration auto-login behavior (should redirect to login page instead)
3. Database connection error handling (return generic 500)

---

## Phase FIX1: Verification (Pre-Fix Checks)

**Purpose**: Verify current state and ensure prerequisites are met

- [X] TFIX01 Verify PostgreSQL is running on localhost:5432 (run: docker ps or pg_isready -h localhost -p 5432)
- [X] TFIX02 Verify backend .env has correct DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_app in backend/.env
- [X] TFIX03 Verify frontend .env.local has NEXT_PUBLIC_API_URL=http://localhost:8001 in frontend/.env.local

**Checkpoint**: Prerequisites verified - proceed to fixes

---

## Phase FIX2: [USFIX1] CORS Configuration Fix (Priority: P1) 🎯 MVP

**Goal**: Fix CORS errors preventing frontend requests from reaching backend

**Independent Test**: Frontend can make API requests to backend without CORS errors in browser console

- [X] TFIX04 [USFIX1] Update CORS middleware to allow all origins in backend/src/api/main.py
  - Change `allow_origins` from specific list `["http://localhost:3000", ...]` to `["*"]`
  - Keep `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`

**Checkpoint**: CORS errors resolved - test by making any API call from frontend

---

## Phase FIX3: [USFIX2] Registration Flow Fix (Priority: P2)

**Goal**: After successful registration, redirect to login page with success message (no auto-login)

**Independent Test**:
1. Register new user
2. Verify redirect to /auth/login?registered=true
3. Verify success message displays on login page
4. Verify user must manually login

- [X] TFIX05 [USFIX2] Modify register function in frontend/src/providers/AuthProvider.tsx
  - Remove localStorage.setItem calls for access_token and refresh_token after registration
  - Keep the API call, but don't store tokens
  - Return { success: true } on successful registration instead of setting user state

- [X] TFIX06 [USFIX2] Update RegisterForm redirect logic in frontend/src/app/components/Auth/RegisterForm.tsx
  - On success, change `router.push(redirectTo)` to `router.push('/auth/login?registered=true')`
  - Remove the auto-login behavior

- [X] TFIX07 [P] [USFIX2] Add success message display to LoginForm in frontend/src/app/components/Auth/LoginForm.tsx
  - Import `useSearchParams` from `next/navigation`
  - Check for `registered=true` query parameter
  - Display success message: "Account created successfully! Please log in."
  - Style with success color (green) matching app theme

**Checkpoint**: Registration flow complete - new users redirected to login with success message

---

## Phase FIX4: [USFIX3] Database Error Handling (Priority: P3)

**Goal**: Backend returns generic 500 error on database connection failures (no internal details exposed)

**Independent Test**:
1. Stop PostgreSQL
2. Attempt registration
3. Verify 500 error with generic message (not connection details)

- [X] TFIX08 [USFIX3] Add database exception handler to auth router in backend/src/api/v1/auth.py
  - Add try/except around the register endpoint DB operations
  - Import `SQLAlchemyError` from `sqlalchemy.exc` (or catch generic Exception)
  - On database error: log actual error server-side with logging.error()
  - Return HTTPException(status_code=500, detail="Internal Server Error")

**Checkpoint**: Database errors handled gracefully - no internal details exposed to frontend

---

## Phase FIX5: Verification & Testing

**Purpose**: Final verification that all fixes work together

- [ ] TFIX09 Restart backend server: cd backend && uvicorn src.api.main:app --reload --port 8001
- [ ] TFIX10 Restart frontend server: cd frontend && npm run dev
- [ ] TFIX11 Test complete flow: Register new user → Verify redirect to login with success message → Login → Dashboard
- [ ] TFIX12 Verify no CORS errors in browser console during entire flow
- [ ] TFIX13 [P] Update specs/master/quickstart.md verification steps if needed

**Checkpoint**: All fixes verified working end-to-end

---

## Fix Task Summary

| Phase | Tasks | Description | Files |
|-------|-------|-------------|-------|
| FIX1: Verify | TFIX01-03 | Pre-fix checks | .env files |
| FIX2: CORS | TFIX04 | Allow all origins | backend/src/api/main.py |
| FIX3: Registration | TFIX05-07 | Redirect to login | frontend/src/providers/AuthProvider.tsx, RegisterForm.tsx, LoginForm.tsx |
| FIX4: Error Handling | TFIX08 | Generic 500 errors | backend/src/api/v1/auth.py |
| FIX5: Verify | TFIX09-13 | End-to-end testing | - |
| **Total** | **13** | CORS & Registration Fix | |

**MVP Scope**: TFIX01-04 (just CORS fix may unblock everything if DB is running)
**Full Scope**: All TFIX tasks for complete registration flow fix

**Parallel Opportunities**:
- TFIX04 (backend CORS), TFIX05-07 (frontend registration), TFIX08 (backend error handling) can all run in parallel (different files)
- TFIX07 (LoginForm) can run parallel to TFIX05-06 (different file)

---

## FRONTEND UI TRANSFORMATION (2026-01-15)

**Goal**: Transform existing basic frontend into jaw-dropping, premium SaaS-quality dashboard

**New Dependencies**: framer-motion, lucide-react
**Design Theme**: Dark theme with orange/yellow accents, glassmorphism, Framer Motion animations

---

## Phase F1: Frontend Setup (UI Transformation)

**Purpose**: Install dependencies and create foundational utilities for premium UI

- [X] TF01 Install new dependencies (framer-motion, lucide-react) in frontend/package.json
- [X] TF02 [P] Extend Tailwind theme with dark colors in frontend/tailwind.config.ts
- [X] TF03 [P] Create global dark theme styles in frontend/src/app/globals.css
- [X] TF04 [P] Create class name utility in frontend/src/lib/cn.ts
- [X] TF05 [P] Create animation variants in frontend/src/lib/animations.ts

---

## Phase F2: UI Primitives (Foundational Components)

**Purpose**: Create shared UI components that ALL frontend features depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] TF06 [P] Create Button component with variants in frontend/src/app/components/ui/Button.tsx
- [X] TF07 [P] Create Card component with glassmorphism in frontend/src/app/components/ui/Card.tsx
- [X] TF08 [P] Create Input component with dark theme in frontend/src/app/components/ui/Input.tsx
- [X] TF09 [P] Create Badge component with status variants in frontend/src/app/components/ui/Badge.tsx
- [X] TF10 Create Modal component with Framer Motion in frontend/src/app/components/ui/Modal.tsx
- [X] TF11 Create useModal hook in frontend/src/hooks/useModal.ts

**Checkpoint**: UI primitives ready - user story implementation can begin

---

## Phase F3: [USF1] Premium Auth Pages (Priority: P1) MVP

**Goal**: Transform login/register pages with dark theme, TaskFlow branding, animations, and live password validation

**Independent Test**: Navigate to /auth/login and /auth/register - should display dark themed, animated forms with TaskFlow logo

- [X] TF12 [P] [USF1] Create Logo component with gradient styling in frontend/src/app/components/Auth/Logo.tsx
- [X] TF13 [P] [USF1] Create PasswordStrength component with live validation in frontend/src/app/components/Auth/PasswordStrength.tsx
- [X] TF14 [USF1] Redesign LoginForm with dark theme and animations in frontend/src/app/components/Auth/LoginForm.tsx
- [X] TF15 [USF1] Redesign RegisterForm with dark theme, animations, and PasswordStrength in frontend/src/app/components/Auth/RegisterForm.tsx
- [X] TF16 [USF1] Update login page with centered layout in frontend/src/app/auth/login/page.tsx
- [X] TF17 [USF1] Update register page with centered layout in frontend/src/app/auth/register/page.tsx

**Checkpoint**: Auth pages display with premium dark theme, TaskFlow branding, and working authentication

---

## Phase F4: [USF2] Dashboard Stats (Priority: P1) MVP

**Goal**: Add four animated stat cards (Total Tasks, Completed, In Progress, Overdue) to dashboard

**Independent Test**: Navigate to /dashboard - should display four stat cards with correct counts and animations

- [ ] TF18 [P] [USF2] Create useTaskStats hook with overdue logic in frontend/src/hooks/useTaskStats.ts
- [ ] TF19 [P] [USF2] Create useAnimatedCounter hook in frontend/src/hooks/useAnimatedCounter.ts
- [ ] TF20 [USF2] Create StatCard component with animated counter in frontend/src/app/components/Dashboard/StatCard.tsx
- [ ] TF21 [USF2] Create StatsGrid component with responsive layout in frontend/src/app/components/Dashboard/StatsGrid.tsx

**Checkpoint**: Dashboard displays four stat cards with animated counters and correct task statistics

---

## Phase F5: [USF3] Premium Task Cards (Priority: P1) MVP

**Goal**: Redesign task cards with dark theme, glassmorphism, hover animations, and icon-based actions

**Independent Test**: Dashboard should display tasks as animated cards with hover effects and action buttons

- [ ] TF22 [USF3] Redesign TaskCard with dark theme and animations in frontend/src/app/components/TaskCard/TaskCard.tsx
- [ ] TF23 [USF3] Redesign TaskList with grid layout and stagger animations in frontend/src/app/components/TaskList/TaskList.tsx
- [ ] TF24 [USF3] Add empty state and loading skeleton to TaskList in frontend/src/app/components/TaskList/TaskList.tsx

**Checkpoint**: Tasks display as premium dark-themed cards with animations and icon actions

---

## Phase F6: [USF4] Task Form Modal (Priority: P2)

**Goal**: Convert inline TaskForm to animated modal with dark theme

**Independent Test**: Click "Add Task" - should open animated modal for task creation/editing

- [ ] TF25 [USF4] Convert TaskForm to modal-based component in frontend/src/app/components/TaskForm/TaskForm.tsx
- [ ] TF26 [USF4] Add form validation and error states to TaskForm in frontend/src/app/components/TaskForm/TaskForm.tsx

**Checkpoint**: Task creation/editing works via animated modal

---

## Phase F7: [USF5] Delete Confirmation Modal (Priority: P2)

**Goal**: Replace browser confirm() with custom animated confirmation modal

**Independent Test**: Click delete on task - should show animated confirmation modal with cancel/confirm

- [ ] TF27 [USF5] Create ConfirmModal component in frontend/src/app/components/common/ConfirmModal.tsx
- [ ] TF28 [USF5] Integrate ConfirmModal for delete actions in frontend/src/app/dashboard/page.tsx

**Checkpoint**: Delete actions show custom animated confirmation modal

---

## Phase F8: Frontend Integration & Polish

**Purpose**: Connect all components, update layout, final polish

- [ ] TF29 Update root layout with dark theme body in frontend/src/app/layout.tsx
- [ ] TF30 Integrate StatsGrid into dashboard page in frontend/src/app/dashboard/page.tsx
- [ ] TF31 Add page transitions with AnimatePresence in frontend/src/app/dashboard/page.tsx
- [ ] TF32 Final responsive design validation across all breakpoints
- [ ] TF33 Performance optimization - ensure 60fps animations
- [ ] TF34 Run quickstart.md validation - verify npm run dev works

---

## Frontend UI Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| F1: Setup | 5 | Dependencies and utilities |
| F2: UI Primitives | 6 | Shared components (Button, Card, Modal, etc.) |
| F3: USF1 Auth | 6 | Premium login/register pages |
| F4: USF2 Stats | 4 | Dashboard stat cards |
| F5: USF3 Cards | 3 | Premium task cards |
| F6: USF4 Form | 2 | Modal-based task form |
| F7: USF5 Delete | 2 | Delete confirmation modal |
| F8: Polish | 6 | Integration and optimization |
| **Total** | **34** | Frontend UI transformation |

**MVP Scope (24 tasks)**: Phases F1-F5 - delivers premium auth, stats, and task cards
**Full Scope (34 tasks)**: All phases - adds modal forms and polish

---

## EXISTING BACKEND TASKS (Already Implemented)

## Dependencies

- **Phase 2 (Foundational)** must complete before any user story phases
- Each user story builds upon the foundational components
- **User Story 1 (Basic Tasks)** is prerequisite for User Story 2 and beyond

## Parallel Execution Examples

- **User Story 2**: Priority and Tag model/service development can run in parallel
- **User Story 3**: Frontend components for priorities and tags can be developed in parallel
- **User Story 4**: AI service implementation can run in parallel with notification service

---

## Phase 1: Setup

**Goal**: Initialize project structure and foundational infrastructure

- [X] T001 Create project root directory structure (backend/, frontend/, docker/, scripts/)
- [X] T002 [P] Initialize backend directory with src/, tests/, requirements.txt
- [X] T003 [P] Initialize frontend directory with src/, public/, package.json
- [X] T004 [P] Create docker directory with Dockerfiles and docker-compose.yml
- [X] T005 [P] Create scripts directory with setup-db.sh, migrate.sh, deploy.sh
- [X] T006 [P] Set up initial git repository with .gitignore for Python and Node.js
- [ ] T007 Configure development environment variables for backend and frontend

---

## Phase 2: Foundational Components

**Goal**: Establish core infrastructure and authentication system

- [X] T010 [P] Set up backend dependencies in requirements.txt (FastAPI, SQLModel, Neon, Better Auth, OpenAI SDK)
- [X] T011 [P] Set up frontend dependencies in package.json (Next.js, React, axios, react-query)
- [X] T012 Create backend/src/core/config.py with database and API configuration
- [X] T013 Create backend/src/core/database.py with database connection and session setup
- [X] T014 Create backend/src/core/security.py with JWT token handling and password hashing
- [X] T015 Create backend/src/models/base.py with SQLModel base class
- [X] T016 Create backend/src/api/deps.py with authentication dependency functions
- [X] T017 Create backend/src/api/main.py with main FastAPI application and CORS setup
- [X] T018 Create backend/src/utils/validators.py with input validation functions
- [X] T019 Create frontend/src/types/index.ts with shared TypeScript interfaces
- [X] T020 Create frontend/src/utils/api.ts with API client configuration
- [X] T021 Create frontend/src/providers/AuthProvider.tsx with authentication context
- [X] T022 Implement authentication middleware in backend/src/middleware/auth.py
- [X] T023 Set up database models inheritance and base configuration

---

## Phase 3: [US1] Basic Task Management

**Goal**: Implement core task management functionality (Add, View, Update, Delete, Complete)

**Independent Test Criteria**: User can create, view, update, delete, and mark tasks as complete with proper authentication

- [X] T030 [P] [US1] Create User model in backend/src/models/user.py with all specified fields and constraints
- [X] T031 [P] [US1] Create Task model in backend/src/models/task.py with all specified fields and relationships
- [X] T032 [P] [US1] Create TaskTag junction model in backend/src/models/task_tag.py
- [X] T033 [US1] Create UserService in backend/src/services/user_service.py with CRUD operations
- [X] T034 [US1] Create TaskService in backend/src/services/task_service.py with CRUD operations and validation
- [X] T035 [US1] Create auth_service.py with registration, login, and token management
- [X] T036 [US1] Implement /auth/login endpoint in backend/src/api/v1/auth.py
- [X] T037 [US1] Implement /auth/register endpoint in backend/src/api/v1/auth.py
- [X] T038 [US1] Implement /auth/logout endpoint in backend/src/api/v1/auth.py
- [X] T039 [US1] Implement /users/me endpoint in backend/src/api/v1/users.py
- [X] T040 [US1] Implement /tasks GET endpoint in backend/src/api/v1/tasks.py
- [X] T041 [US1] Implement /tasks POST endpoint in backend/src/api/v1/tasks.py
- [X] T042 [US1] Implement /tasks/{id} GET endpoint in backend/src/api/v1/tasks.py
- [X] T043 [US1] Implement /tasks/{id} PUT endpoint in backend/src/api/v1/tasks.py
- [X] T044 [US1] Implement /tasks/{id} DELETE endpoint in backend/src/api/v1/tasks.py
- [X] T045 [US1] Implement /tasks/{id}/complete PATCH endpoint in backend/src/api/v1/tasks.py
- [X] T046 [US1] Create TaskCard component in frontend/src/app/components/TaskCard/TaskCard.tsx
- [X] T047 [US1] Create TaskList component in frontend/src/app/components/TaskList/TaskList.tsx
- [X] T048 [US1] Create TaskForm component in frontend/src/app/components/TaskForm/TaskForm.tsx
- [X] T049 [US1] Create Auth components (Login, Register) in frontend/src/app/components/Auth/
- [X] T050 [US1] Implement dashboard page in frontend/src/app/pages/dashboard/page.tsx
- [X] T051 [US1] Implement tasks page in frontend/src/app/pages/tasks/page.tsx
- [X] T052 [US1] Implement auth pages in frontend/src/app/pages/auth/
- [ ] T053 [US1] Connect frontend API calls to backend endpoints for task operations
- [ ] T054 [US1] Implement loading, empty, and error states as specified in spec
- [ ] T055 [US1] Add proper validation and error handling to frontend forms

---

## Phase 4: [US2] Task Organization & Usability

**Goal**: Implement priorities, tags, search, filter, and sort functionality

**Independent Test Criteria**: User can assign priorities and tags to tasks, and search/filter/sort tasks effectively

- [X] T060 [P] [US2] Create Priority model in backend/src/models/priority.py with all specified fields
- [X] T061 [P] [US2] Create Tag model in backend/src/models/tag.py with all specified fields and user relationship
- [X] T062 [US2] Create PriorityService in backend/src/services/priority_service.py
- [X] T063 [US2] Create TagService in backend/src/services/tag_service.py with user-specific operations
- [X] T064 [US2] Implement /priorities endpoints in backend/src/api/v1/priorities.py
- [X] T065 [US2] Implement /tags endpoints in backend/src/api/v1/tags.py
- [X] T066 [US2] Update TaskService to handle priority and tag associations
- [X] T067 [US2] Update Task model relationships to connect with Priority and Tag models
- [ ] T068 [US2] Enhance /tasks endpoints with query parameters for filtering and sorting
- [ ] T069 [US2] Create PrioritySelector component in frontend/src/app/components/common/PrioritySelector.tsx
- [ ] T070 [US2] Create TagSelector component in frontend/src/app/components/common/TagSelector.tsx
- [ ] T071 [US2] Create SearchFilterBar component in frontend/src/app/components/common/SearchFilterBar.tsx
- [ ] T072 [US2] Enhance TaskCard component with priority and tag display
- [ ] T073 [US2] Update TaskForm component with priority and tag selection
- [ ] T074 [US2] Implement search and filter functionality in TaskList component
- [ ] T075 [US2] Add sorting controls to the task list interface
- [ ] T076 [US2] Connect frontend to new priority and tag API endpoints

---

## Phase 5: [US3] Advanced Task Features

**Goal**: Implement recurring tasks, due dates, and time reminders with notifications

**Independent Test Criteria**: User can create recurring tasks with due dates and receive time-based reminders

- [ ] T080 [P] [US3] Create RecurringTask model in backend/src/models/recurring_task.py
- [ ] T081 [P] [US3] Create TaskInstance model in backend/src/models/task_instance.py
- [ ] T082 [US3] Create RecurringTaskService in backend/src/services/recurring_task_service.py
- [ ] T083 [US3] Create NotificationService in backend/src/services/notification_service.py
- [ ] T084 [US3] Update Task model to support due dates and reminder times
- [ ] T085 [US3] Implement recurring task creation logic with validation rules
- [ ] T086 [US3] Implement recurring task scheduling mechanism
- [ ] T087 [US3] Create notification system with time-based triggers
- [ ] T088 [US3] Add recurring task endpoints to backend API
- [ ] T089 [US3] Create RecurringTaskForm component in frontend/src/app/components/common/RecurringTaskForm.tsx
- [ ] T090 [US3] Create DatePicker component in frontend/src/app/components/common/DatePicker.tsx
- [ ] T091 [US3] Create TimePicker component in frontend/src/app/components/common/TimePicker.tsx
- [ ] T092 [US3] Enhance TaskForm with due date, reminder, and recurrence options
- [ ] T093 [US3] Update TaskCard to display due dates and recurrence indicators
- [ ] T094 [US3] Implement notification display in frontend
- [ ] T095 [US3] Connect frontend to recurring task and notification endpoints

---

## Phase 6: [US4] AI Integration

**Goal**: Implement conversational AI for natural language task management

**Independent Test Criteria**: User can interact with AI chatbot to create, update, or manage tasks using natural language

- [ ] T100 [US4] Create AIIntegrationService in backend/src/services/ai_integration_service.py
- [ ] T101 [US4] Implement OpenAI API integration with GPT-4 for task management
- [ ] T102 [US4] Create AI message parsing and command recognition logic
- [ ] T103 [US4] Implement AI response formatting for frontend consumption
- [ ] T104 [US4] Add /ai/chat endpoint in backend/src/api/v1/ai_chat.py
- [ ] T105 [US4] Create AIChatBot component in frontend/src/app/components/AIChatBot/AIChatBot.tsx
- [ ] T106 [US4] Create MessageBubble component in frontend/src/app/components/AIChatBot/MessageBubble.tsx
- [ ] T107 [US4] Implement chat history functionality in frontend
- [ ] T108 [US4] Connect frontend AI chat interface to backend endpoint
- [ ] T109 [US4] Add AI response processing to update task interface

---

## Phase 7: [US5] Deployment & Production Readiness

**Goal**: Prepare application for deployment with proper observability and rate limiting

**Independent Test Criteria**: Application can be deployed to local Kubernetes (Minikube) and cloud (DOKS) with proper monitoring

- [ ] T110 [P] [US5] Create backend Dockerfile with proper multi-stage build
- [ ] T111 [P] [US5] Create frontend Dockerfile with proper multi-stage build
- [ ] T112 [P] [US5] Create docker-compose.yml for local development
- [ ] T113 [US5] Create Kubernetes deployment manifests in docker/k8s/
- [ ] T114 [US5] Implement structured logging in backend with log levels
- [ ] T115 [US5] Add metrics collection for API performance monitoring
- [ ] T116 [US5] Implement error tracking and reporting system
- [ ] T117 [US5] Add rate limiting middleware at API gateway level
- [ ] T118 [US5] Create deployment scripts in scripts/deploy.sh
- [ ] T119 [US5] Set up CI/CD pipeline configuration files
- [ ] T120 [US5] Test deployment on Minikube locally
- [ ] T121 [US5] Test deployment on DigitalOcean Kubernetes (DOKS)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Complete the application with accessibility, responsive design, and final touches

- [ ] T130 Add WCAG-compliant accessibility features to all frontend components
- [ ] T131 Implement responsive design for mobile and tablet devices
- [ ] T132 Add comprehensive error boundary handling in React components
- [ ] T133 Implement proper loading states with skeleton screens
- [ ] T134 Add proper empty state illustrations and messaging
- [ ] T135 Create reusable UI components and design system
- [ ] T136 Optimize frontend performance with code splitting and lazy loading
- [ ] T137 Add proper SEO meta tags and structured data
- [ ] T138 Conduct end-to-end testing of all user flows
- [ ] T139 Perform security audit and penetration testing
- [ ] T140 Document the API with comprehensive examples
- [ ] T141 Create user documentation and help guides
