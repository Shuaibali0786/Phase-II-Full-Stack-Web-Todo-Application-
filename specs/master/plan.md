# Implementation Plan: Dashboard Redesign - Professional Task Table

**Branch**: `master` | **Date**: 2026-01-21 | **Spec**: [specs/master/spec.md](spec.md)
**Input**: Feature specification from `/specs/master/spec.md`

**Note**: This plan replaces the navigation-based dashboard card implementation with a professional task management table featuring inline CRUD operations.

## Summary

Replace the existing navigation-based dashboard cards (which navigate to separate /tasks/view, /tasks/edit, /tasks/delete, /tasks/complete pages) with a professional task management dashboard featuring a data table with inline CRUD operations. The new dashboard will display actual tasks in a sortable table format with columns for Checkbox (completion toggle), Title, Status, Priority, Due Date, and Actions (Edit/Delete). All operations will be performed directly on the dashboard using modals (TaskFormModal for add/edit, DeleteConfirmationModal for delete) without navigation to separate pages. Pagination will be implemented with 25 tasks per page by default, configurable to 10/25/50/100. This approach aligns with modern SaaS task management patterns (Todoist, Asana, Linear) and provides better information density and user efficiency.

## Technical Context

**Language/Version**: TypeScript 5.3+, React 19, Next.js 15.5.9 (App Router)
**Primary Dependencies**:
- Frontend: Framer Motion 12.26.2, Lucide React 0.562.0, Tailwind CSS 3.4+
- Backend: Python 3.11, FastAPI, SQLModel, Neon Serverless PostgreSQL
- Auth: Better Auth (JWT-based)

**Storage**: Neon Serverless PostgreSQL (existing schema - no backend changes required)
**Testing**: Deferred - Vitest + React Testing Library setup documented but not implemented in this phase
**Target Platform**: Web (responsive design, mobile-first approach)
**Project Type**: Web application (Next.js frontend + FastAPI backend)
**Performance Goals**:
- 95% of API requests respond within 200ms
- Table rendering with 100 rows < 100ms
- Smooth 60fps animations for modals and interactions
- Support up to 1000 concurrent users

**Constraints**:
- Frontend-only changes - no backend API modifications
- Must reuse existing components: TaskFormModal, DeleteConfirmationModal
- Must maintain dark theme design system (orange/yellow accents, glassmorphism)
- Must support keyboard navigation and WCAG accessibility
- Pagination required for scalability (max 100 tasks per page)

**Scale/Scope**:
- 1 major component (TaskTable)
- 4-5 subcomponents (TableHeader, TableRow, PaginationControls, etc.)
- Modify 1 existing page (frontend/src/app/dashboard/page.tsx)
- Remove 4 navigation-based action pages (view, edit, delete, complete)
- Estimated ~800-1000 lines of new code
- Support for users with 1000+ tasks via pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Spec-Driven Development
- **Status**: PASS
- **Compliance**: This plan is generated from clarified specifications in spec.md
- **Evidence**: All requirements traced to Session 2026-01-21 clarifications
- **Action**: Continue spec-driven workflow through /sp.tasks and /sp.implement

### ✅ II. Reusable Intelligence
- **Status**: PASS
- **Compliance**: Reusing existing modal components (TaskFormModal, DeleteConfirmationModal)
- **Evidence**: TaskTable component will be modular and reusable
- **Action**: Design TaskTable as standalone component for potential reuse in other views

### ✅ III. Security & Authentication
- **Status**: PASS
- **Compliance**: JWT authentication via Better Auth already implemented
- **Evidence**: Dashboard page protected by useAuth hook, all API calls include auth tokens
- **Action**: Maintain existing auth protection on dashboard route

### ✅ IV. Full-Stack Accuracy
- **Status**: PASS
- **Compliance**: Frontend changes only, using existing backend APIs
- **Evidence**:
  - GET /tasks (with pagination params: page, limit)
  - POST /tasks (create)
  - PUT /tasks/{id} (update)
  - DELETE /tasks/{id} (delete)
  - PATCH /tasks/{id}/complete (toggle completion)
- **Action**: Verify all API contracts in Phase 1

### ✅ V. Cloud-Native Deployment
- **Status**: PASS (N/A for this feature)
- **Compliance**: Frontend changes do not affect deployment architecture
- **Action**: No deployment changes required

### ✅ VI. User Experience
- **Status**: PASS
- **Compliance**: Professional task table with sortable columns, instant feedback, accessibility
- **Evidence**:
  - Data table format (industry standard)
  - Modal-based interactions (non-blocking)
  - Checkbox for instant completion toggle
  - Keyboard navigation support
  - Mobile-responsive design
- **Action**: Implement with Framer Motion animations, maintain dark theme consistency

### Re-check After Phase 1 Design
- [ ] Verify TaskTable component architecture aligns with constitution
- [ ] Confirm no unnecessary complexity introduced
- [ ] Validate accessibility compliance (WCAG)
- [ ] Review performance optimization strategies

## Project Structure

### Documentation (this feature)

```text
specs/master/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── task-api.md      # Existing task API contracts (reference only)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/                 # NO CHANGES REQUIRED
└── [existing structure unchanged]

frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # MAJOR MODIFICATION - replace cards with TaskTable
│   │   ├── tasks/
│   │   │   ├── view/page.tsx              # REMOVE - no longer needed
│   │   │   ├── edit/page.tsx              # REMOVE - no longer needed
│   │   │   ├── delete/page.tsx            # REMOVE - no longer needed
│   │   │   └── complete/page.tsx          # REMOVE - no longer needed
│   │   └── components/
│   │       ├── Dashboard/
│   │       │   ├── ActionGrid.tsx         # REMOVE - replaced by TaskTable
│   │       │   └── StatCards.tsx          # KEEP - stats remain above table
│   │       ├── TaskTable/                 # NEW DIRECTORY
│   │       │   ├── TaskTable.tsx          # Main table component
│   │       │   ├── TableHeader.tsx        # Column headers with sort
│   │       │   ├── TableRow.tsx           # Individual task row
│   │       │   ├── PaginationControls.tsx # Pagination UI
│   │       │   └── types.ts               # Table-specific types
│   │       ├── TaskForm/
│   │       │   └── TaskFormModal.tsx      # REUSE - for add/edit
│   │       └── common/
│   │           └── DeleteConfirmationModal.tsx  # REUSE - for delete
│   ├── components/
│   │   └── TaskSearch/
│   │       └── TaskSearchInput.tsx        # REMOVE - no longer needed
│   ├── hooks/
│   │   └── usePagination.ts               # NEW - pagination logic
│   └── utils/
│       └── api.ts                          # MINOR UPDATE - pagination params
└── tests/                                   # Deferred - Vitest setup not in this phase
```

**Structure Decision**: Web application structure (frontend + backend). This feature modifies only the frontend dashboard page and introduces a new TaskTable component hierarchy. The navigation-based action pages (view, edit, delete, complete) and TaskSearchInput component will be removed as they are replaced by the inline table approach. Existing modal components (TaskFormModal, DeleteConfirmationModal) will be reused.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied:
- Spec-driven development followed
- Reuses existing modal components
- Maintains existing auth/security
- Uses existing backend APIs
- No deployment changes
- Improves user experience with professional table UI

---

## Phase 0: Research & Unknowns Resolution

**Status**: READY TO EXECUTE

### Research Tasks

1. **Task Table Component Architecture**
   - Decision needed: Component hierarchy for TaskTable
   - Research: Best practices for React table components with sorting/pagination
   - Output: Component architecture diagram in research.md

2. **Pagination Strategy**
   - Decision needed: Client-side vs server-side pagination
   - Research: Performance implications for 1000+ tasks
   - Output: Pagination implementation approach in research.md

3. **Sort Functionality**
   - Decision needed: Client-side vs server-side sorting
   - Research: Sorting patterns for tables with pagination
   - Output: Sorting implementation strategy in research.md

4. **Existing API Capabilities**
   - Decision needed: Does GET /tasks support pagination and sorting params?
   - Research: Review existing backend API implementation
   - Output: API capability assessment in research.md

5. **Migration Strategy**
   - Decision needed: How to deprecate navigation-based pages
   - Research: Safe removal of existing routes and components
   - Output: Migration checklist in research.md

6. **Accessibility for Tables**
   - Decision needed: ARIA attributes for sortable, interactive tables
   - Research: WCAG guidelines for data tables with actions
   - Output: Accessibility requirements in research.md

### Expected Outputs

- `research.md` with 6 sections addressing each research task
- Clear decisions on architecture, pagination, sorting, API usage
- Migration strategy from navigation-based to table-based dashboard

---

## Phase 1: Design & Contracts

**Status**: PENDING (depends on Phase 0 completion)

### Deliverables

1. **data-model.md**
   - No new data models required (using existing Task entity)
   - Document Task entity fields relevant to table display
   - Document pagination/sorting request/response structures

2. **contracts/**
   - `task-api.md` - Document existing API endpoints with pagination params
   - Include request/response examples for GET /tasks with page/limit/sort

3. **quickstart.md**
   - Development setup instructions
   - How to test TaskTable in isolation
   - How to verify pagination/sorting
   - How to test modal integrations
   - Checklist for removing old navigation pages

4. **Agent Context Update**
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
   - Add TaskTable component patterns to agent context
   - Preserve existing context between markers

---

## Architecture Preview (to be detailed in research.md)

### Component Hierarchy

```
DashboardPage
├── Logo + Header
├── StatCards (existing, unchanged)
└── TaskTable
    ├── TableToolbar
    │   ├── AddTaskButton (opens TaskFormModal)
    │   ├── SearchInput (filter tasks)
    │   └── ViewOptions (page size selector)
    ├── Table
    │   ├── TableHeader (sortable columns)
    │   └── TableBody
    │       └── TableRow[] (for each task)
    │           ├── Checkbox (completion toggle)
    │           ├── TaskInfo (title, description preview)
    │           ├── StatusBadge
    │           ├── PriorityBadge
    │           ├── DueDateDisplay
    │           └── ActionButtons
    │               ├── EditButton (opens TaskFormModal)
    │               └── DeleteButton (opens DeleteConfirmationModal)
    └── PaginationControls
        ├── PageInfo (showing X-Y of Z)
        ├── PageSizeSelector (10/25/50/100)
        └── PageNavigation (prev/next, page numbers)
```

### Data Flow

```
User Action → Component Handler → API Call → State Update → UI Re-render

Examples:
- Add Task: Click "Add Task" → Open TaskFormModal → Submit → POST /tasks → Refresh table
- Edit Task: Click Edit icon → Open TaskFormModal with data → Submit → PUT /tasks/{id} → Refresh table
- Delete Task: Click Delete icon → Open DeleteConfirmationModal → Confirm → DELETE /tasks/{id} → Refresh table
- Complete Task: Click checkbox → PATCH /tasks/{id}/complete → Optimistic UI update + refresh
- Sort: Click column header → Update sort state → GET /tasks?sort=column&order=asc → Update table
- Paginate: Click next → Update page state → GET /tasks?page=2&limit=25 → Update table
```

### State Management

```typescript
// Dashboard page state
const [tasks, setTasks] = useState<Task[]>([]);
const [totalTasks, setTotalTasks] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(25);
const [sortColumn, setSortColumn] = useState<keyof Task>('created_at');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Modals
const [showAddTaskModal, setShowAddTaskModal] = useState(false);
const [editingTask, setEditingTask] = useState<Task | null>(null);
const [deletingTask, setDeletingTask] = useState<Task | null>(null);
```

---

## Migration Strategy (to be detailed in research.md)

1. **Remove old navigation-based pages** (4 files)
   - frontend/src/app/tasks/view/page.tsx
   - frontend/src/app/tasks/edit/page.tsx
   - frontend/src/app/tasks/delete/page.tsx
   - frontend/src/app/tasks/complete/page.tsx

2. **Remove unused components** (2 files)
   - frontend/src/app/components/Dashboard/ActionGrid.tsx
   - frontend/src/components/TaskSearch/TaskSearchInput.tsx

3. **Update dashboard page**
   - Replace ActionGrid with TaskTable
   - Add modal state management
   - Implement pagination/sorting logic

4. **Verify no broken links**
   - Check for any internal links to removed routes
   - Update navigation if any references exist

---

## Next Steps

1. ✅ Plan created (this file)
2. ⏳ Execute Phase 0: Research (6 research tasks)
3. ⏳ Execute Phase 1: Design (data-model, contracts, quickstart)
4. ⏳ Run agent context update
5. ⏳ Re-evaluate Constitution Check
6. ⏳ Proceed to /sp.tasks for task breakdown

**Command**: `/sp.plan` execution continues with Phase 0 research generation...
