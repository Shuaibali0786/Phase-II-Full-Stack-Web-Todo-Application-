# Quickstart Guide: Evolution of Todo Application

---

## Frontend UI Transformation Setup (2026-01-15)

### New Dependencies

```bash
cd frontend
npm install framer-motion lucide-react
```

### Tailwind Theme Extension

Add to `tailwind.config.ts`:

```typescript
colors: {
  background: '#0a0a0f',
  surface: { DEFAULT: '#141420', hover: '#1a1a2e', elevated: '#1e1e30' },
  border: { DEFAULT: '#2a2a3e', focus: '#f97316' },
  accent: { orange: '#f97316', yellow: '#fbbf24' },
  text: { primary: '#ffffff', secondary: '#a1a1aa', muted: '#71717a' },
  status: { success: '#22c55e', warning: '#eab308', error: '#ef4444', info: '#3b82f6' }
},
backgroundImage: { 'accent-gradient': 'linear-gradient(135deg, #f97316, #fbbf24)' }
```

### New Folder Structure

```
frontend/src/
├── app/components/ui/    # NEW: Button, Card, Input, Badge, Modal
├── app/components/Dashboard/  # NEW: StatCard, StatsGrid
├── hooks/                # NEW: useTaskStats, useAnimatedCounter, useModal
└── lib/                  # NEW: cn.ts, animations.ts
```

### Quick Start

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Prerequisites

- Node.js 18+ (for Next.js frontend)
- Python 3.11+ (for FastAPI backend)
- Docker & Docker Compose
- Git
- PostgreSQL client (optional, for local development)

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Configuration

### 1. Backend Configuration
Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
NEON_DATABASE_URL=your-neon-database-url
BETTER_AUTH_SECRET=your-better-auth-secret
OPENAI_API_KEY=your-openai-api-key
```

### 2. Frontend Configuration
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

## Database Setup

### 1. Initialize the Database
```bash
cd backend
python -m src.core.database --init
```

### 2. Run Migrations
```bash
alembic upgrade head
```

## Running the Application

### 1. Start the Backend
```bash
cd backend
uvicorn src.api.main:app --reload --port 8000
```

### 2. Start the Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## Docker Setup (Alternative)

### 1. Build and Start Containers
```bash
docker-compose up --build
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Running Tests

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Development Workflow

### 1. Creating a New Feature
1. Create a new branch: `git checkout -b feature/new-feature-name`
2. Add your changes to the appropriate layer (models, services, api, etc.)
3. Write tests for your changes
4. Update the API documentation if adding new endpoints
5. Submit a pull request

### 2. Adding a New API Endpoint
1. Define the endpoint in the appropriate router file
2. Create the corresponding service function
3. Add input/output schemas using Pydantic
4. Write unit and integration tests
5. Verify the endpoint appears in the API documentation

### 3. Adding a New Frontend Component
1. Create the component in the `components` directory
2. Follow the naming convention: `ComponentName/index.tsx`
3. Add stories for Storybook if applicable
4. Write tests using Jest and React Testing Library
5. Export the component in the appropriate barrel file

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

### Tasks
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `PATCH /tasks/{id}/complete` - Mark task as complete/incomplete

### Users
- `GET /users/me` - Get current user info
- `PUT /users/me` - Update current user info

### AI Chat
- `POST /ai/chat` - Send message to AI assistant
- `GET /ai/chat/history` - Get chat history

## Database Migrations

### Creating a Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Applying Migrations
```bash
alembic upgrade head
```

### Downgrade Migrations
```bash
alembic downgrade -1
```

## Deployment

### Local Deployment with Minikube
1. Start Minikube: `minikube start`
2. Build Docker images: `docker build -t todo-frontend ./frontend` and `docker build -t todo-backend ./backend`
3. Load images into Minikube: `minikube image load todo-frontend` and `minikube image load todo-backend`
4. Apply Kubernetes manifests: `kubectl apply -f ./k8s/`

### Production Deployment
1. Update image tags in Kubernetes manifests
2. Apply manifests to production cluster: `kubectl apply -f ./k8s/`
3. Monitor deployment: `kubectl get pods`

---

## Fix: CORS and Registration Issues (2026-01-17)

This section documents the fixes for:
1. PostgreSQL connection 500 errors
2. CORS errors blocking frontend requests
3. Registration flow redirect behavior

### Issue 1: CORS Configuration Fix

**Location**: `backend/src/api/main.py`

Change CORS middleware from specific origins to allow all:

```python
# BEFORE (causing issues):
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    ...
)

# AFTER (fix):
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 2: Database Connection Error Handling

Ensure PostgreSQL is running and accessible:

```bash
# Check PostgreSQL status (Windows)
pg_isready -h localhost -p 5432

# Start PostgreSQL (if using Docker)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo_app -p 5432:5432 -d postgres:15

# Create database if not exists
psql -h localhost -U postgres -c "CREATE DATABASE todo_app;"
```

**Backend .env configuration**:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_app
```

### Issue 3: Registration Flow Fix

**Per spec clarification**: After registration, redirect to login page (no auto-login).

**Files to modify**:

1. `frontend/src/providers/AuthProvider.tsx`:
   - `register()` should NOT store tokens
   - Return `{ success: true }` on success

2. `frontend/src/app/components/Auth/RegisterForm.tsx`:
   - On success, redirect to `/auth/login?registered=true`

3. `frontend/src/app/components/Auth/LoginForm.tsx`:
   - Detect `?registered=true` query param
   - Show success message: "Account created successfully! Please log in."

### Quick Fix Commands

```bash
# 1. Start PostgreSQL (required for registration to work)
docker start postgres || docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo_app -p 5432:5432 -d postgres:15

# 2. Start backend (port 8001)
cd backend
uvicorn src.api.main:app --reload --port 8001

# 3. Start frontend (port 3000)
cd frontend
npm run dev
```

### Verification Steps

1. **Test CORS**: Open browser console, check for no CORS errors
2. **Test Registration**: Register new user, verify redirect to login with success message
3. **Test Login**: Login with registered credentials, verify redirect to dashboard

---

## Dashboard Card Functionality Fix Setup (2026-01-21)

### Overview

This fix implements functional click handlers for all dashboard action cards that navigate to dedicated REST-style routes with task search/selection UI.

### No New Dependencies Required

All necessary dependencies (Framer Motion, Lucide React, Next.js 15 App Router) are already installed.

### New Files to Create

1. **frontend/src/app/tasks/view/page.tsx** - View all tasks page
2. **frontend/src/app/tasks/edit/page.tsx** - Edit task page
3. **frontend/src/app/tasks/delete/page.tsx** - Delete task page
4. **frontend/src/app/tasks/complete/page.tsx** - Complete/toggle task page
5. **frontend/src/components/TaskSearch/TaskSearchInput.tsx** - Reusable task search/ID input component

### Files to Modify

1. **frontend/src/app/components/Dashboard/ActionGrid.tsx** - Add navigation handlers using `useRouter()`

### Implementation Pattern

Each new task action page follows this structure:

```typescript
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { TaskSearchInput } from '@/components/TaskSearch/TaskSearchInput';
import { useAuth } from '@/providers/AuthProvider';

export default function ViewTasksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Auth redirect (if needed)
  // Task selection handler
  // API integration

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background"
    >
      <motion.div variants={fadeInUp}>
        {/* Page content with TaskSearchInput */}
      </motion.div>
    </motion.div>
  );
}
```

### Navigation Update Pattern

Update `ActionGrid.tsx` to add navigation:

```typescript
'use client';

import { useRouter } from 'next/navigation';

export function ActionGrid({ ...props }: ActionGridProps) {
  const router = useRouter();

  const handleViewTasks = () => router.push('/tasks/view');
  const handleUpdateTask = () => router.push('/tasks/edit');
  const handleDeleteTask = () => router.push('/tasks/delete');
  const handleCompleteTask = () => router.push('/tasks/complete');

  return (
    <motion.div>
      {/* Pass navigation handlers to ActionCard components */}
    </motion.div>
  );
}
```

### Quick Start for Development

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Create new route directories
mkdir -p src/app/tasks/{view,edit,delete,complete}

# 3. Create TaskSearch component directory
mkdir -p src/components/TaskSearch

# 4. Start development server (if not running)
npm run dev

# 5. Navigate to http://localhost:3000/dashboard
# 6. Click any action card to test navigation
```

### Testing the Fix

1. **Navigate to Dashboard**: `http://localhost:3000/dashboard`
2. **Click "View All Tasks" card**: Should navigate to `/tasks/view`
3. **Click "Update Tasks" card**: Should navigate to `/tasks/edit`
4. **Click "Delete Tasks" card**: Should navigate to `/tasks/delete`
5. **Click "Mark Complete" card**: Should navigate to `/tasks/complete`
6. **Verify Animations**: Check that Framer Motion fadeInUp animations play on page load
7. **Test Task Search**: Enter task title or ID in search input
8. **Test Back Navigation**: Browser back button should return to dashboard

### Route Structure

```
/dashboard               # Dashboard with action cards
/tasks/view             # View tasks with search (NEW)
/tasks/edit             # Edit task with search (NEW)
/tasks/delete           # Delete task with search (NEW)
/tasks/complete         # Complete task with search (NEW)
/tasks                  # Existing tasks list page (UNCHANGED)
```

### Verification Checklist

- [ ] All 5 action cards have click handlers
- [ ] Clicking each card navigates to correct route
- [ ] TaskSearchInput component renders on all 4 new pages
- [ ] Search functionality works (autocomplete dropdown)
- [ ] Manual ID input works
- [ ] Page transitions use Framer Motion animations
- [ ] Auth protection works (redirects to login if not authenticated)
- [ ] Existing /tasks page remains unchanged
- [ ] No backend API changes required

### Known Limitations

- **No task list on initial load**: Per spec, pages show empty forms with search (not full task lists)
- **Manual task selection required**: Users must search or enter ID before performing actions
- **Testing framework**: Vitest + RTL chosen but implementation deferred to tasks phase

### Next Steps

After quickstart verification:
1. Run `/sp.tasks` to generate detailed implementation tasks
2. Implement components following task checklist
3. Test all navigation flows
4. Verify error handling for invalid task IDs
5. Ensure consistent dark theme styling across all pages