# Tasks: Dashboard Card Functionality Fix

**Input**: Design documents from `/specs/master/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Tests are deferred - implementation focus first, Vitest + RTL setup documented in research.md

**Organization**: Tasks organized by component type to enable efficient parallel development

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]**: User Story 1 - Make dashboard cards functional with navigation
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `backend/src/`
- This feature: Frontend-only changes in `frontend/src/`
- No backend modifications required

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for new components and routes

- [X] T001 Create route directory structure frontend/src/app/tasks/{view,edit,delete,complete}
- [X] T002 [P] Create TaskSearch component directory frontend/src/components/TaskSearch
- [X] T003 [P] Verify existing dependencies (Framer Motion, Lucide React, Next.js Router)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create reusable TaskSearchInput component that all 4 action pages depend on

**⚠️ CRITICAL**: No action page implementation can begin until this component is complete

- [X] T004 [US1] Create TaskSearchInput component interface in frontend/src/components/TaskSearch/TaskSearchInput.tsx
- [X] T005 [US1] Implement search input UI with autocomplete dropdown in TaskSearchInput.tsx
- [X] T006 [US1] Implement manual task ID input functionality in TaskSearchInput.tsx
- [X] T007 [US1] Add keyboard navigation (arrow keys, enter, escape) to TaskSearchInput.tsx
- [X] T008 [US1] Integrate with task API (GET /tasks) for autocomplete in TaskSearchInput.tsx
- [X] T009 [US1] Add loading and error states to TaskSearchInput.tsx
- [X] T010 [US1] Style TaskSearchInput with dark theme, orange accents, glassmorphism effects

**Checkpoint**: TaskSearchInput component ready - action pages can now be implemented in parallel

---

## Phase 3: User Story 1 - Functional Dashboard Cards (Priority: P1) 🎯 MVP

**Goal**: Make all dashboard action cards navigate to dedicated routes with functional task selection and actions

**Independent Test**:
1. Navigate to http://localhost:3000/dashboard
2. Click each action card (View, Edit, Delete, Complete)
3. Verify navigation to correct route (/tasks/view, /tasks/edit, /tasks/delete, /tasks/complete)
4. Verify TaskSearchInput renders and functions on each page
5. Verify task selection triggers appropriate action
6. Verify browser back button returns to dashboard

### Implementation - ActionGrid Navigation Update

- [X] T011 [US1] Update ActionGrid to import useRouter from next/navigation in frontend/src/app/components/Dashboard/ActionGrid.tsx
- [X] T012 [US1] Add navigation handlers (handleViewTasks, handleUpdateTask, handleDeleteTask, handleCompleteTask) to ActionGrid.tsx
- [X] T013 [US1] Wire navigation handlers to ActionCard onClick props in ActionGrid.tsx

### Implementation - View Tasks Page

- [X] T014 [P] [US1] Create page.tsx in frontend/src/app/tasks/view/ with Next.js page structure
- [X] T015 [US1] Add auth protection with useAuth hook in tasks/view/page.tsx
- [X] T016 [US1] Implement Framer Motion page animations (fadeInUp, staggerContainer) in tasks/view/page.tsx
- [X] T017 [US1] Add TaskSearchInput with onTaskSelected handler in tasks/view/page.tsx
- [X] T018 [US1] Implement task display UI showing title, status, actions in tasks/view/page.tsx
- [X] T019 [US1] Add Edit, Delete, Complete action buttons for selected task in tasks/view/page.tsx
- [X] T020 [US1] Style page with dark theme, orange accents, responsive layout in tasks/view/page.tsx

### Implementation - Edit Task Page

- [X] T021 [P] [US1] Create page.tsx in frontend/src/app/tasks/edit/ with Next.js page structure
- [X] T022 [US1] Add auth protection with useAuth hook in tasks/edit/page.tsx
- [X] T023 [US1] Implement Framer Motion page animations in tasks/edit/page.tsx
- [X] T024 [US1] Add TaskSearchInput with onTaskSelected handler in tasks/edit/page.tsx
- [X] T025 [US1] Fetch task details after selection (GET /tasks/{id}) in tasks/edit/page.tsx
- [X] T026 [US1] Render TaskFormModal or inline edit form in tasks/edit/page.tsx
- [X] T027 [US1] Implement task update handler (PUT /tasks/{id}) in tasks/edit/page.tsx
- [X] T028 [US1] Add success/error feedback and redirect to dashboard in tasks/edit/page.tsx
- [X] T029 [US1] Style page with dark theme, orange accents in tasks/edit/page.tsx

### Implementation - Delete Task Page

- [X] T030 [P] [US1] Create page.tsx in frontend/src/app/tasks/delete/ with Next.js page structure
- [X] T031 [US1] Add auth protection with useAuth hook in tasks/delete/page.tsx
- [X] T032 [US1] Implement Framer Motion page animations in tasks/delete/page.tsx
- [X] T033 [US1] Add TaskSearchInput with onTaskSelected handler in tasks/delete/page.tsx
- [X] T034 [US1] Fetch task details after selection (GET /tasks/{id}) in tasks/delete/page.tsx
- [X] T035 [US1] Render DeleteConfirmationModal or inline confirmation UI in tasks/delete/page.tsx
- [X] T036 [US1] Implement task delete handler (DELETE /tasks/{id}) in tasks/delete/page.tsx
- [X] T037 [US1] Add success/error feedback and redirect to dashboard in tasks/delete/page.tsx
- [X] T038 [US1] Style page with dark theme, orange accents in tasks/delete/page.tsx

### Implementation - Complete Task Page

- [X] T039 [P] [US1] Create page.tsx in frontend/src/app/tasks/complete/ with Next.js page structure
- [X] T040 [US1] Add auth protection with useAuth hook in tasks/complete/page.tsx
- [X] T041 [US1] Implement Framer Motion page animations in tasks/complete/page.tsx
- [X] T042 [US1] Add TaskSearchInput with onTaskSelected handler in tasks/complete/page.tsx
- [X] T043 [US1] Fetch task details after selection (GET /tasks/{id}) in tasks/complete/page.tsx
- [X] T044 [US1] Display task with current completion status in tasks/complete/page.tsx
- [X] T045 [US1] Implement toggle completion handler (PATCH /tasks/{id}/complete) in tasks/complete/page.tsx
- [X] T046 [US1] Add instant UI update and success feedback in tasks/complete/page.tsx
- [X] T047 [US1] Add option to complete another task or return to dashboard in tasks/complete/page.tsx
- [X] T048 [US1] Style page with dark theme, orange accents in tasks/complete/page.tsx

**Checkpoint**: All dashboard cards now functional - user can navigate to all action pages, search/select tasks, and perform actions

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [X] T049 [P] Add proper TypeScript types for all new components and pages
- [X] T050 [P] Ensure consistent error handling across all 4 action pages
- [X] T051 [P] Verify responsive design on mobile, tablet, desktop for all pages
- [X] T052 [P] Add loading spinners during API calls on all pages
- [X] T053 [P] Verify all pages follow existing design system (colors, fonts, spacing)
- [X] T054 [P] Test keyboard navigation and accessibility (WCAG compliance)
- [ ] T055 Run quickstart.md verification checklist for all 9 items [MANUAL VALIDATION REQUIRED]
- [ ] T056 Test browser back/forward navigation from all pages [MANUAL VALIDATION REQUIRED]
- [ ] T057 Verify existing /tasks page remains unchanged and functional [MANUAL VALIDATION REQUIRED]
- [X] T058 [P] Add JSDoc comments to TaskSearchInput component
- [X] T059 [P] Update quickstart.md with any discovered edge cases or gotchas

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all action pages
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
  - ActionGrid update: Can start immediately after Foundational
  - Action pages: Can proceed in parallel after ActionGrid update and Foundational
- **Polish (Phase 4)**: Depends on User Story 1 completion

### Critical Path

```
Phase 1 (Setup) → Phase 2 (TaskSearchInput) → Phase 3 (Action Pages) → Phase 4 (Polish)
```

### Within User Story 1

- **ActionGrid Navigation** (T011-T013): Can start after Foundational
- **View Page** (T014-T020): Can start in parallel with other pages after Foundational
- **Edit Page** (T021-T029): Can start in parallel with other pages after Foundational
- **Delete Page** (T030-T038): Can start in parallel with other pages after Foundational
- **Complete Page** (T039-T048): Can start in parallel with other pages after Foundational

### Parallel Opportunities

**Phase 1 - All tasks can run in parallel:**
- T001, T002, T003 (different directories/checks)

**Phase 2 - Sequential (TaskSearchInput is one component):**
- T004 → T005 → T006 → T007 → T008 → T009 → T010

**Phase 3 - High parallelism after ActionGrid update:**
- T011-T013 (ActionGrid update) must complete first
- Then ALL 4 page implementations can run in parallel:
  - View Page: T014-T020 (7 tasks)
  - Edit Page: T021-T029 (9 tasks)
  - Delete Page: T030-T038 (9 tasks)
  - Complete Page: T039-T048 (10 tasks)

**Phase 4 - All tasks can run in parallel:**
- T049-T054, T058, T059 (different concerns, different files)
- T055-T057 (testing tasks, sequential recommended)

---

## Parallel Example: Action Pages Implementation

Once Foundational phase (T004-T010) and ActionGrid update (T011-T013) are complete, launch all 4 action pages in parallel:

```bash
# Developer 1 or Agent 1:
Task: "Create and implement View Tasks page (T014-T020)"

# Developer 2 or Agent 2:
Task: "Create and implement Edit Task page (T021-T029)"

# Developer 3 or Agent 3:
Task: "Create and implement Delete Task page (T030-T038)"

# Developer 4 or Agent 4:
Task: "Create and implement Complete Task page (T039-T048)"
```

Each page is independent and can be developed/tested separately.

---

## Implementation Strategy

### MVP First (Recommended)

1. **Phase 1: Setup** (T001-T003) → ~5 minutes
2. **Phase 2: Foundational** (T004-T010) → ~30-45 minutes
   - Build TaskSearchInput component completely
3. **Phase 3A: ActionGrid** (T011-T013) → ~10 minutes
   - Add navigation handlers
4. **Phase 3B: One Action Page** (pick View page T014-T020) → ~30 minutes
   - Test end-to-end: Dashboard → Click "View All Tasks" → Navigate → Search → Select task → View details
5. **STOP and VALIDATE MVP**
   - Verify navigation works
   - Verify search works
   - Verify task display works
   - Fix any issues before proceeding
6. **Phase 3C: Remaining Pages** (T021-T048) → Can parallelize or go sequential
7. **Phase 4: Polish** (T049-T059)

### Sequential Delivery (One Action at a Time)

1. Complete Setup + Foundational (T001-T010)
2. Add ActionGrid navigation (T011-T013)
3. Add View page (T014-T020) → Test → Demo
4. Add Edit page (T021-T029) → Test → Demo
5. Add Delete page (T030-T038) → Test → Demo
6. Add Complete page (T039-T048) → Test → Demo
7. Polish all pages (T049-T059)

### Parallel Team Strategy

With 4 developers:

1. **All developers**: Complete Setup + Foundational together (T001-T010)
2. **Developer 1**: ActionGrid update (T011-T013)
3. Once ActionGrid is updated:
   - **Developer 1**: View page (T014-T020)
   - **Developer 2**: Edit page (T021-T029)
   - **Developer 3**: Delete page (T030-T038)
   - **Developer 4**: Complete page (T039-T048)
4. **All developers**: Polish together (T049-T059)

---

## Task Summary

**Total Tasks**: 59

**Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (User Story 1): 38 tasks
  - ActionGrid: 3 tasks
  - View Page: 7 tasks
  - Edit Page: 9 tasks
  - Delete Page: 9 tasks
  - Complete Page: 10 tasks
- Phase 4 (Polish): 11 tasks

**Parallelization Opportunities**:
- Phase 1: 3 tasks can run in parallel
- Phase 2: Sequential (single component)
- Phase 3: After ActionGrid update, 4 page groups (35 tasks) can run in parallel
- Phase 4: 9 tasks can run in parallel (3 testing tasks sequential)

**Estimated Timeline**:
- Sequential: ~4-6 hours
- With 4 parallel developers: ~2-3 hours
- MVP only (through T020): ~1.5-2 hours

---

## Notes

- [P] tasks = different files, no dependencies on incomplete work
- [US1] label = User Story 1 tasks (all tasks in this feature belong to single cohesive story)
- No backend changes required - all tasks are frontend-only
- TaskSearchInput is the critical dependency - must be complete before any action page
- Each action page follows same pattern: Auth → Animations → Search → Fetch → Action → Feedback
- Testing framework (Vitest + RTL) setup deferred - focus on implementation first
- Verify tests mentioned in quickstart.md verification checklist (T055)
- Commit after each page completion for easy rollback if needed
- Stop at Phase 3B checkpoint to validate MVP before continuing
