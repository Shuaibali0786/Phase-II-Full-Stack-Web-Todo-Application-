# Dashboard Component Contracts

**Feature**: TaskFlow Premium Dashboard
**Date**: 2026-01-15

This document defines the API contracts for dashboard-specific components.

---

## 1. StatCard Component

**Location**: `frontend/src/app/components/Dashboard/StatCard.tsx`

### Props API

```typescript
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: 'total' | 'completed' | 'inProgress' | 'overdue';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  loading?: boolean;
  animated?: boolean;
  onClick?: () => void;
}
```

### Variant Configuration

```typescript
const STAT_CONFIGS = {
  total: {
    colorClass: 'text-accent-orange',
    bgClass: 'bg-accent-orange/10',
    icon: 'ListTodo'
  },
  completed: {
    colorClass: 'text-status-success',
    bgClass: 'bg-status-success/10',
    icon: 'CheckCircle'
  },
  inProgress: {
    colorClass: 'text-status-info',
    bgClass: 'bg-status-info/10',
    icon: 'Clock'
  },
  overdue: {
    colorClass: 'text-status-error',
    bgClass: 'bg-status-error/10',
    icon: 'AlertCircle'
  }
};
```

### Visual Structure

```
┌─────────────────────────────────┐
│  ┌────┐                         │
│  │icon│  Title              ▲2  │
│  └────┘  123                    │
│                                 │
└─────────────────────────────────┘

- Icon in colored circle (40x40px)
- Title: text-sm, text-secondary
- Value: text-2xl, font-bold, animated
- Trend: optional, small arrow + percentage
```

### Animation Behavior

- **On mount**: Staggered fade-in-up (index-based delay)
- **Value change**: Animated counter (spring physics)
- **On hover**: Scale 1.02, shadow increase, border glow

---

## 2. StatsGrid Component

**Location**: `frontend/src/app/components/Dashboard/StatsGrid.tsx`

### Props API

```typescript
interface StatsGridProps {
  stats: TaskStats;
  loading?: boolean;
  onStatClick?: (stat: keyof TaskStats) => void;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}
```

### Layout Specification

```
Mobile (< 640px):
┌─────────┐
│  Total  │
├─────────┤
│Complete │
├─────────┤
│Progress │
├─────────┤
│ Overdue │
└─────────┘

Tablet (640px - 1024px):
┌─────────┬─────────┐
│  Total  │Complete │
├─────────┼─────────┤
│Progress │ Overdue │
└─────────┴─────────┘

Desktop (> 1024px):
┌─────────┬─────────┬─────────┬─────────┐
│  Total  │Complete │Progress │ Overdue │
└─────────┴─────────┴─────────┴─────────┘
```

### CSS Classes

```css
.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}
```

---

## 3. TaskCard Component (Enhanced)

**Location**: `frontend/src/app/components/TaskCard/TaskCard.tsx`

### Props API

```typescript
interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  animated?: boolean;
  compact?: boolean;
}
```

### Visual Structure

```
┌────────────────────────────────────────┐
│ ☑ Task Title                    [High] │
│                                        │
│ Task description text here...          │
│                                        │
│ 📅 Jan 15, 2026     [Tag1] [Tag2]     │
│                                        │
│                    [Edit] [Delete]     │
└────────────────────────────────────────┘

- Checkbox: Custom styled, accent-orange when checked
- Title: text-lg, strike-through if completed
- Priority Badge: Colored pill
- Description: text-sm, text-secondary, 2 lines max
- Due date: text-xs with icon, red if overdue
- Tags: Small colored badges
- Actions: Icon buttons (Edit2, Trash2), appear on hover
```

### Animation Behavior

- **On mount**: Fade-in-up (AnimatePresence)
- **On complete toggle**: Checkmark scale animation
- **On hover**: Subtle scale + shadow
- **On delete**: Exit animation (fade-out-down)

### State Classes

```typescript
const taskCardClasses = cn(
  'task-card',
  task.is_completed && 'opacity-60',
  isOverdue(task) && 'border-l-4 border-l-status-error'
);
```

---

## 4. TaskList Component (Enhanced)

**Location**: `frontend/src/app/components/TaskList/TaskList.tsx`

### Props API

```typescript
interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, isCompleted: boolean) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  layout?: 'grid' | 'list';
  animated?: boolean;
}
```

### Layout Modes

**Grid Layout (default)**:
```css
.task-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4;
}
```

**List Layout**:
```css
.task-list {
  @apply flex flex-col gap-3;
}
```

### Empty State

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  className="text-center py-12"
>
  <ClipboardList className="w-16 h-16 mx-auto text-text-muted mb-4" />
  <p className="text-text-secondary text-lg">
    {emptyMessage || "No tasks yet. Create your first task!"}
  </p>
</motion.div>
```

### Loading State

```tsx
// Skeleton cards (3-6 depending on viewport)
<div className="task-grid">
  {[...Array(6)].map((_, i) => (
    <div key={i} className="task-card animate-pulse">
      <div className="h-6 bg-surface-hover rounded w-3/4 mb-4" />
      <div className="h-4 bg-surface-hover rounded w-1/2" />
    </div>
  ))}
</div>
```

---

## 5. TaskForm Component (Modal)

**Location**: `frontend/src/app/components/TaskForm/TaskForm.tsx`

### Props API

```typescript
interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  task?: Task | null;  // If provided, edit mode
  priorities: Priority[];
  tags: Tag[];
}
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | text | Yes | 1-255 chars |
| description | textarea | No | Max 2000 chars |
| priority_id | select | No | Valid priority ID |
| due_date | date | No | Future date |
| reminder_time | time | No | - |
| tag_ids | multi-select | No | Valid tag IDs |

### Modal Structure

```
┌─────────────────────────────────────┐
│ Create Task                    [X]  │
├─────────────────────────────────────┤
│                                     │
│ Title *                             │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description                         │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Priority        Due Date            │
│ ┌───────────┐   ┌───────────┐      │
│ │ Select ▼  │   │ 📅        │      │
│ └───────────┘   └───────────┘      │
│                                     │
│ Tags                                │
│ [Work] [Personal] [Urgent]         │
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Create Task] │
└─────────────────────────────────────┘
```

### Submission Flow

1. Validate all fields
2. Show loading state on submit button
3. Call onSubmit with form data
4. On success: Close modal, clear form
5. On error: Display error message, keep modal open

---

## 6. useTaskStats Hook

**Location**: `frontend/src/hooks/useTaskStats.ts`

### API

```typescript
function useTaskStats(tasks: Task[]): UseTaskStatsReturn;

interface UseTaskStatsReturn {
  stats: TaskStats;
  isOverdue: (task: Task) => boolean;
  getTasksByStatus: (status: 'completed' | 'inProgress' | 'overdue') => Task[];
}
```

### Implementation Logic

```typescript
const isOverdue = (task: Task): boolean => {
  if (!task.due_date || task.is_completed) return false;
  return new Date(task.due_date) < new Date();
};

const stats = useMemo(() => ({
  total: tasks.length,
  completed: tasks.filter(t => t.is_completed).length,
  inProgress: tasks.filter(t => !t.is_completed && !isOverdue(t)).length,
  overdue: tasks.filter(t => isOverdue(t)).length,
}), [tasks]);
```

---

## 7. useAnimatedCounter Hook

**Location**: `frontend/src/hooks/useAnimatedCounter.ts`

### API

```typescript
function useAnimatedCounter(
  value: number,
  options?: UseAnimatedCounterOptions
): MotionValue<number>;

interface UseAnimatedCounterOptions {
  duration?: number;  // default: 0.8
  delay?: number;     // default: 0
  enabled?: boolean;  // default: true
}
```

### Usage Example

```tsx
const AnimatedNumber = ({ value }: { value: number }) => {
  const animatedValue = useAnimatedCounter(value);
  const rounded = useTransform(animatedValue, Math.round);

  return <motion.span>{rounded}</motion.span>;
};
```
