# Research Summary: Evolution of Todo - Full-Stack Web Application

---

## Frontend UI Transformation Research (2026-01-15)

### 1. Animation Library

**Decision**: Framer Motion
**Rationale**: Industry standard for React animations with 60fps performance, declarative API, built-in gesture support, layout animations for list reordering, AnimatePresence for enter/exit animations.
**Alternatives considered**:
- CSS/Tailwind animations: Limited to simple transitions, no gesture support
- GSAP: Overkill for UI animations, larger bundle, imperative API
- React Spring: Physics-based but less intuitive API

### 2. Icon Library

**Decision**: Lucide React
**Rationale**: Modern fork of Feather Icons, tree-shakeable, consistent 24x24 grid, TypeScript support, ~1KB per icon.
**Alternatives considered**:
- Heroicons: Slightly larger bundle, less variety
- React Icons: Mega-package, inconsistent styles
- Phosphor Icons: Less mainstream adoption

### 3. Dark Theme Implementation

**Decision**: Tailwind CSS with custom color palette
**Rationale**: Extends existing setup, CSS custom properties for consistency, dark-first approach.
**Color Palette**:
- Background: #0a0a0f (deep dark)
- Surface: #141420 (card background)
- Accent Orange: #f97316 (primary)
- Accent Yellow: #fbbf24 (secondary)

### 4. Glassmorphism Effects

**Decision**: CSS backdrop-filter with fallbacks
**Implementation**: rgba backgrounds with blur(10px), subtle borders, layered shadows.

### 5. Password Validation UX

**Decision**: Real-time validation with visual indicators
**Rules**: 8+ chars, uppercase, lowercase, digit, special character with check/circle icons.

### 6. Animated Counter

**Decision**: Custom hook with Framer Motion useSpring
**Use Case**: Stat cards with smooth number transitions.

### 7. Overdue Task Logic

**Decision**: due_date passed AND is_completed false
**Rationale**: Completed tasks shouldn't appear overdue.

### 8. Modal Implementation

**Decision**: Custom animated modal with Framer Motion
**Features**: Dark themed, orange accents, scale+fade animation, click-outside close.

### 9. App Branding

**Decision**: TaskFlow
**Rationale**: Modern, professional SaaS-style name.

### New Dependencies

```bash
npm install framer-motion lucide-react
```

---

## Architecture Research

### Tech Stack Selection

**Decision**: Full-stack web application with Next.js frontend and FastAPI backend
**Rationale**: Next.js provides excellent developer experience with SSR/SSG capabilities, while FastAPI offers fast API development with automatic documentation and type validation
**Alternatives considered**:
- React + Express: Less performant than Next.js, no automatic docs like FastAPI
- Vue + Spring Boot: Java ecosystem adds complexity for startup speed
- Angular + .NET: Heavy framework choice for lightweight todo app

### Authentication Method

**Decision**: Better Auth with JWT tokens
**Rationale**: Better Auth provides easy integration with Next.js and handles common authentication patterns securely
**Alternatives considered**:
- Auth0: More complex and costly for this project
- Custom JWT implementation: More prone to security issues
- Firebase Auth: Vendor lock-in concerns

### Database Selection

**Decision**: Neon Serverless PostgreSQL with SQLModel ORM
**Rationale**: PostgreSQL provides ACID compliance and advanced features, Neon offers serverless scaling, SQLModel provides Pydantic integration
**Alternatives considered**:
- MongoDB: Less suitable for relational data like tasks and users
- SQLite: Not suitable for concurrent users at scale
- MySQL: Less modern features compared to PostgreSQL

### AI Integration

**Decision**: OpenAI GPT-4 for conversational AI features
**Rationale**: GPT-4 provides excellent natural language understanding for todo management commands
**Alternatives considered**:
- OpenAI GPT-3.5: Less capable than GPT-4
- Self-hosted models: Higher complexity and maintenance
- Alternative providers: Less proven in NLP space

## API Design Patterns

### REST API Structure

**Decision**: RESTful API with versioning at v1 level
**Rationale**: REST is widely understood, easy to document, and works well with JWT authentication
**Endpoints planned**:
- `/api/v1/auth` - Authentication routes
- `/api/v1/users` - User management
- `/api/v1/tasks` - Task CRUD operations
- `/api/v1/priorities` - Priority management
- `/api/v1/tags` - Tag management
- `/api/v1/ai` - AI chatbot integration

### Data Modeling

**Decision**: Relational database model with proper normalization
**Rationale**: Todo app has clear relationships between users, tasks, priorities, and tags
**Entity relationships**:
- User (1) -> (Many) Task
- Task (Many) -> (1) Priority
- Task (Many) <-> (Many) Tag (via junction table)

## Deployment Strategy

### Containerization

**Decision**: Docker containers with Kubernetes orchestration
**Rationale**: Provides consistent environments, scalability, and cloud-native deployment capabilities
**Container strategy**:
- Separate containers for frontend and backend
- Database managed separately (Neon Serverless)
- Environment-specific configurations

### Infrastructure

**Decision**: Minikube for local development, DOKS for cloud deployment
**Rationale**: Minikube provides local Kubernetes experience, DOKS offers managed K8s on DigitalOcean
**Infrastructure components**:
- Deployments for frontend and backend
- Services for internal communication
- Ingress for external access
- ConfigMaps for configuration
- Secrets for sensitive data

## Security Considerations

### JWT Token Management

**Decision**: JWT tokens with refresh token rotation
**Rationale**: Stateless authentication suitable for microservices, refresh rotation improves security
**Implementation details**:
- Access tokens: 15 minutes expiry
- Refresh tokens: 7 days expiry
- Secure storage in httpOnly cookies

### Rate Limiting

**Decision**: Application-level rate limiting using Redis
**Rationale**: Centralized rate limiting that persists across application restarts
**Limits**:
- 100 requests per minute per user
- Burst allowance of 20 requests

## Performance Optimization

### Caching Strategy

**Decision**: Redis for application caching
**Rationale**: In-memory caching for frequently accessed data like user sessions and popular queries
**Cache targets**:
- User session data
- Frequently accessed tasks
- API response caching

### Database Optimization

**Decision**: Indexing strategy for common query patterns
**Rationale**: Proper indexing prevents slow queries as data grows
**Planned indexes**:
- User ID on tasks table (for user-specific queries)
- Created_at on tasks table (for sorting)
- Priority ID on tasks table (for filtering)

---

## Fix: Backend CORS and Registration Issues Research (2026-01-17)

### RQ1: FastAPI CORS Configuration

**Decision**: Use `allow_origins=["*"]` per spec clarification for maximum flexibility

**Rationale**:
- Spec clarification (Session 2026-01-17) explicitly chose Option A: "Allow all origins (*) for maximum flexibility"
- Current implementation uses specific origins list which is more restrictive
- For development and this project's scope, wildcard is acceptable

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Specific origins list | `["http://localhost:3000"]` | Less flexible, current approach causing issues |
| Environment-based | Load from `ALLOWED_ORIGINS` env var | More complex, not required by spec |
| Same-origin only | No CORS at all | Would break SPA architecture |

**Implementation**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### RQ2: PostgreSQL Connection Error Handling

**Decision**: Return generic 500 "Internal Server Error" without exposing database details

**Rationale**:
- Spec clarification (Session 2026-01-17) chose Option A: "Return generic 500 error with 'Internal Server Error' message"
- Security best practice to not expose internal infrastructure details
- Current code doesn't have explicit DB connection error handling

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Retry with backoff | Auto-retry connection | Adds complexity, user chose simpler approach |
| Specific error message | Tell user "Database unavailable" | Exposes internal details |
| Queue requests | Process when DB recovers | Over-engineering for MVP |

**Implementation**:
- Add try/catch around DB operations in auth service
- Return HTTP 500 with generic message on connection failure
- Log actual error for debugging (server-side only)

---

### RQ3: Post-Registration Flow

**Decision**: Redirect to login page with success message, do NOT auto-login

**Rationale**:
- Spec clarification (Session 2026-01-17) chose Option A: "Redirect to login page with success message, require manual login"
- Current implementation stores tokens and redirects to dashboard (auto-login)
- Need to modify AuthProvider.register() and RegisterForm behavior

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Auto-login + dashboard | Current behavior | User explicitly chose manual login |
| Auto-login + email verification | Verify email first | Over-engineering for MVP |
| Redirect to login only | No success message | Poor UX, user won't know if it worked |

**Implementation**:
1. Modify `AuthProvider.register()`: Don't store tokens, return success status
2. Modify `RegisterForm`: On success, redirect to `/auth/login?registered=true`
3. Modify `LoginForm`: Check for `registered` query param, show success message

---

### RQ4: JWT Token Storage

**Decision**: Use localStorage for JWT token storage

**Rationale**:
- Spec clarification (Session 2026-01-17) chose Option A: "localStorage - simple access, persists across tabs/sessions"
- Current implementation already uses localStorage (no change needed)
- Simple to implement with Axios interceptors

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| httpOnly cookies | More XSS-resistant | Requires backend cookie handling |
| sessionStorage | Cleared on tab close | Less persistent than desired |

**Implementation**: No change needed - already using localStorage in `utils/api.ts`

---

### RQ5: Frontend Error Display

**Decision**: Show inline error messages below the form/component that triggered the error

**Rationale**:
- Spec clarification (Session 2026-01-17) chose Option A: "Inline error messages below the form/component"
- Current implementation already shows inline errors in RegisterForm and LoginForm
- Provides contextual feedback without disrupting user flow

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Toast notifications | Auto-dismiss popups | Less contextual, user chose inline |
| Full-page error | Replace current content | Too disruptive |
| Modal dialog | Require acknowledgment | Interrupts flow |

**Implementation**: No change needed - already showing inline errors in forms

---

## Fix Resolution Summary (2026-01-17)

| Research Question | Status | Action Required |
|-------------------|--------|-----------------|
| RQ1: CORS Configuration | Resolved | Change origins to `["*"]` |
| RQ2: DB Error Handling | Resolved | Add try/catch, return generic 500 |
| RQ3: Registration Flow | Resolved | Modify to redirect to login, show success message |
| RQ4: JWT Storage | Resolved | No change (already using localStorage) |
| RQ5: Error Display | Resolved | No change (already inline) |

All NEEDS CLARIFICATION items resolved. Ready for Phase 1.

---

## Dashboard Card Functionality Fix Research (2026-01-21)

### RQ1: Frontend Testing Framework

**Unknown**: Testing framework for Next.js 15 + React 19 frontend

**Decision**: Vitest + React Testing Library

**Rationale**:
- Vitest is the modern standard for Vite-based projects and Next.js 15
- React Testing Library is recommended by React team for component testing
- Better performance than Jest (faster test execution)
- Native TypeScript support without additional configuration
- Compatible with React 19 and Next.js 15 App Router
- Framer Motion testing utilities available for animation testing

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Jest + React Testing Library | Traditional choice | Slower than Vitest, requires additional Babel configuration for Next.js 15 |
| Cypress Component Testing | Browser-based testing | Heavier weight, overkill for unit/component testing |
| Playwright Component Testing | Modern E2E framework | Better for E2E than unit testing, adds unnecessary complexity |

**Implementation Notes**:
- Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`
- Configure vitest.config.ts with Next.js path aliases
- Add test scripts to package.json
- Note: Testing implementation deferred to tasks phase

---

### RQ2: Next.js App Router Navigation Patterns

**Decision**: Use `useRouter` from `next/navigation` for client-side navigation

**Rationale**:
- Official Next.js 15 App Router pattern for programmatic navigation
- Already used in existing dashboard code (dashboard/page.tsx:6)
- Supports both `push()` and `replace()` methods
- Integrated with App Router prefetching and caching
- Type-safe with TypeScript

**Example Pattern**:
```typescript
'use client';
import { useRouter } from 'next/navigation';

export function ActionGrid({ onViewTasks }: Props) {
  const router = useRouter();

  const handleViewTasks = () => {
    router.push('/tasks/view');
  };

  return <ActionCard onClick={handleViewTasks} />;
}
```

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Link component | Declarative navigation | Cards need onClick handlers with custom logic before navigation |
| window.location.href | Browser navigation | Causes full page reload, loses SPA benefits, not compatible with Next.js prefetching |

---

### RQ3: Task Search/Selection UI Pattern

**Decision**: Search bar with autocomplete dropdown + manual ID input option

**Rationale**:
- Balances usability (search by title) with spec requirement (ID input capability)
- Common pattern in modern web applications (GitHub, Linear, Jira issue selection)
- Provides autocomplete for better UX while maintaining ID input fallback
- Can reuse existing task fetching API (GET /tasks)
- Accessible via keyboard navigation (arrow keys, enter, escape)

**Component Structure**:
```typescript
<TaskSearchInput
  onTaskSelected={(task: Task) => void}
  placeholder="Search by title or enter task ID..."
  variant="view" | "edit" | "delete" | "complete"
  showActions={boolean}  // Show edit/delete/complete buttons in dropdown
/>
```

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| ID-only input field | Simple text input | Poor UX - users don't memorize task IDs, requires navigation away to find IDs |
| Full task list first | Show all tasks on page load | Violates spec requirement (empty form with search/ID input) |
| Modal picker | Task selection in modal | Spec requires navigation to dedicated pages, not modals |

---

### RQ4: Framer Motion Page Transition Pattern

**Decision**: Use motion.div with fadeInUp animation from existing lib/animations.ts

**Rationale**:
- Consistent with existing dashboard animations (already using fadeInUp and staggerContainer)
- Next.js App Router doesn't support page-level AnimatePresence (no route change detection)
- Component-level animations provide sufficient visual feedback for navigation
- Reuses existing animation utilities (lib/animations.ts)
- Matches existing code patterns in dashboard/page.tsx

**Implementation Pattern**:
```typescript
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function ViewTasksPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background"
    >
      <motion.div variants={fadeInUp}>
        {/* Page content */}
      </motion.div>
    </motion.div>
  );
}
```

**Alternatives Considered**:
| Option | Description | Why Not Chosen |
|--------|-------------|----------------|
| Route-level AnimatePresence | Animate entire route changes | Not possible - Next.js App Router doesn't expose route change events |
| No animations | Plain page transitions | Violates spec requirement (Framer Motion for all interactions), inconsistent with existing UX |
| Custom layout with route tracking | Wrap pages in AnimatePresence | Over-engineering for this feature, would require significant refactoring |

---

## Dashboard Fix Resolution Summary (2026-01-21)

| Research Question | Status | Action Required |
|-------------------|--------|-----------------|
| RQ1: Testing Framework | Resolved | Document Vitest + RTL choice (implementation deferred) |
| RQ2: Navigation Pattern | Resolved | Use `useRouter().push()` from next/navigation |
| RQ3: Task Selection UI | Resolved | Implement search bar with autocomplete + ID input |
| RQ4: Page Transitions | Resolved | Use motion.div with existing fadeInUp animations |

All NEEDS CLARIFICATION items resolved. Ready for Phase 1.