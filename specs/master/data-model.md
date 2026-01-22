# Data Model: Evolution of Todo Application

---

## Frontend Component Interfaces (2026-01-15)

This section defines TypeScript interfaces for the premium UI transformation.

### Design Token Types

```typescript
// lib/tokens.ts
export interface ThemeColors {
  background: string;      // #0a0a0f
  surface: string;         // #141420
  surfaceHover: string;    // #1a1a2e
  border: string;          // #2a2a3e
  accent: {
    orange: string;        // #f97316
    yellow: string;        // #fbbf24
  };
  text: {
    primary: string;       // #ffffff
    secondary: string;     // #a1a1aa
    muted: string;         // #71717a
  };
  status: {
    success: string;       // #22c55e
    warning: string;       // #eab308
    error: string;         // #ef4444
    info: string;          // #3b82f6
  };
}
```

### UI Component Interfaces

```typescript
// Button Component
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  onClick?: () => void;
}

// Card Component
export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  hoverable?: boolean;
  animated?: boolean;
}

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Input Component
export interface InputProps {
  id: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  leftIcon?: React.ReactNode;
}
```

### Dashboard Component Interfaces

```typescript
// Stats Types
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

// StatCard Component
export type StatCardVariant = 'total' | 'completed' | 'inProgress' | 'overdue';
export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: StatCardVariant;
  animated?: boolean;
}

// StatsGrid Component
export interface StatsGridProps {
  stats: TaskStats;
  loading?: boolean;
  onStatClick?: (stat: keyof TaskStats) => void;
}
```

### Auth Component Interfaces

```typescript
// Password Validation
export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'digit', label: 'One digit', test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export interface PasswordStrengthProps {
  password: string;
  showLabel?: boolean;
}
```

### Custom Hook Interfaces

```typescript
// useTaskStats Hook
export function useTaskStats(tasks: Task[]): {
  stats: TaskStats;
  isOverdue: (task: Task) => boolean;
};

// useAnimatedCounter Hook
export function useAnimatedCounter(
  value: number,
  options?: { duration?: number }
): MotionValue<number>;

// useModal Hook
export function useModal(initial?: boolean): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};
```

---

## Entity Definitions

### User
**Description**: Represents an authenticated user of the application

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the user |
| email | String(255) | Unique, Not Null | User's email address |
| hashed_password | String(255) | Not Null | Hashed password using bcrypt |
| first_name | String(100) | Nullable | User's first name |
| last_name | String(100) | Nullable | User's last name |
| is_active | Boolean | Default: True | Whether the account is active |
| created_at | DateTime | Not Null | Account creation timestamp |
| updated_at | DateTime | Not Null | Last update timestamp |

### Task
**Description**: Core todo item created by a user

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the task |
| title | String(255) | Not Null | Task title |
| description | Text | Nullable | Detailed task description |
| is_completed | Boolean | Default: False | Completion status |
| priority_id | UUID | Foreign Key, Nullable | Reference to priority level |
| user_id | UUID | Foreign Key, Not Null | Reference to owner user |
| due_date | DateTime | Nullable | Deadline for the task |
| reminder_time | DateTime | Nullable | Time to send reminder notification |
| created_at | DateTime | Not Null | Task creation timestamp |
| updated_at | DateTime | Not Null | Last update timestamp |

### Priority
**Description**: Priority levels for organizing tasks

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the priority |
| name | String(50) | Not Null, Unique | Priority name (e.g., "Low", "Medium", "High") |
| value | Integer | Not Null | Numeric value for sorting (e.g., 1 for Low, 2 for Medium, 3 for High) |
| color | String(7) | Not Null | Hex color code for UI display |
| created_at | DateTime | Not Null | Priority creation timestamp |
| updated_at | DateTime | Not Null | Last update timestamp |

### Tag
**Description**: User-defined labels for categorizing tasks

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the tag |
| name | String(50) | Not Null | Tag name |
| color | String(7) | Not Null | Hex color code for UI display |
| user_id | UUID | Foreign Key, Not Null | Reference to owner user |
| created_at | DateTime | Not Null | Tag creation timestamp |
| updated_at | DateTime | Not Null | Last update timestamp |

### TaskTag (Junction Table)
**Description**: Many-to-many relationship between tasks and tags

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| task_id | UUID | Foreign Key, Not Null | Reference to the task |
| tag_id | UUID | Foreign Key, Not Null | Reference to the tag |
| created_at | DateTime | Not Null | Association creation timestamp |

### RecurringTask
**Description**: Template for tasks that repeat on a schedule

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the recurring task |
| task_template_id | UUID | Foreign Key, Not Null | Reference to the base task template |
| recurrence_pattern | String(20) | Not Null | Pattern (daily, weekly, monthly) |
| interval | Integer | Default: 1 | Interval multiplier for the pattern |
| end_condition | String(20) | Not Null | End condition (after_date, after_occurrences, never) |
| end_date | DateTime | Nullable | Date to stop recurrence |
| max_occurrences | Integer | Nullable | Maximum number of occurrences |
| created_at | DateTime | Not Null | Template creation timestamp |
| updated_at | DateTime | Not Null | Last update timestamp |

### TaskInstance
**Description**: Individual instances of recurring tasks

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Not Null | Unique identifier for the task instance |
| recurring_task_id | UUID | Foreign Key, Not Null | Reference to the recurring task template |
| original_task_id | UUID | Foreign Key, Not Null | Reference to the original task |
| scheduled_date | DateTime | Not Null | When this instance is scheduled |
| actual_completion_date | DateTime | Nullable | When this instance was completed |
| created_at | DateTime | Not Null | Instance creation timestamp |

## Relationships

### User -> Task
- **Type**: One-to-Many
- **Description**: A user can have multiple tasks
- **Constraint**: Cascade delete (when user is deleted, their tasks are also deleted)

### Task -> Priority
- **Type**: Many-to-One
- **Description**: A task can have one priority level
- **Constraint**: Set NULL when priority is deleted

### User -> Tag
- **Type**: One-to-Many
- **Description**: A user can have multiple tags
- **Constraint**: Cascade delete (when user is deleted, their tags are also deleted)

### Task -> Tag
- **Type**: Many-to-Many
- **Description**: A task can have multiple tags, and a tag can be applied to multiple tasks
- **Through**: TaskTag junction table

### Task -> RecurringTask
- **Type**: One-to-One (optional)
- **Description**: A task can be a template for recurring tasks

### RecurringTask -> TaskInstance
- **Type**: One-to-Many
- **Description**: A recurring task template can generate multiple task instances

## Indexes

### Required Indexes
1. **idx_tasks_user_id** - On Task.user_id for efficient user-specific queries
2. **idx_tasks_priority_id** - On Task.priority_id for priority-based filtering
3. **idx_tasks_due_date** - On Task.due_date for deadline-based queries
4. **idx_tasks_is_completed** - On Task.is_completed for completion status filtering
5. **idx_tags_user_id** - On Tag.user_id for efficient user-specific tag queries
6. **idx_task_instances_recurring_task_id** - On TaskInstance.recurring_task_id for efficient recurring task instance queries

### Composite Indexes
1. **idx_tasks_user_priority_completed** - On (user_id, priority_id, is_completed) for common dashboard queries
2. **idx_tasks_user_due_date** - On (user_id, due_date) for deadline-focused views

## Validation Rules

### Task Validation
- Title must be between 1 and 255 characters
- Due date must be in the future (if provided)
- Reminder time must be before due date (if both provided)

### User Validation
- Email must be a valid email format
- Email must be unique across all users

### Priority Validation
- Name must be unique per application (not per user)
- Value must be between 1 and 10

### Tag Validation
- Name must be unique per user (but not globally)
- Name must be between 1 and 50 characters

### RecurringTask Validation
- End date must be in the future (if provided)
- Max occurrences must be positive (if provided)
- Interval must be positive

## State Transitions

### Task State Transitions
- **Active** → **Completed**: When user marks task as complete
- **Completed** → **Active**: When user unmarks task as complete
- **Active** → **Deleted**: When user deletes task (soft delete)
- **Completed** → **Deleted**: When user deletes completed task (soft delete)

### RecurringTask State Transitions
- **Active** → **Paused**: When user pauses recurrence
- **Paused** → **Active**: When user resumes recurrence
- **Active** → **Ended**: When recurrence reaches end condition

---

## Registration Flow Update (2026-01-17)

### Updated Auth Interface

```typescript
// Updated AuthProvider interface for registration flow
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Registration response (backend returns tokens but frontend doesn't store them)
export interface RegisterResponse {
  access_token: string;    // Not stored - user must login manually
  refresh_token: string;   // Not stored - user must login manually
  token_type: string;
  user: User;
}

// Registration request
export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}
```

### Registration Flow State Machine

```
[Register Form]
    │
    ▼
[Submit Registration]
    │
    ├─ Success ──► [Redirect to /auth/login?registered=true]
    │                      │
    │                      ▼
    │              [Login Form shows success message]
    │
    └─ Error ───► [Show inline error message below form]
```

### Login Success Message Component

```typescript
// LoginForm should detect registered query param
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

// useSearchParams to detect ?registered=true
// Show success alert: "Account created successfully! Please log in."
```