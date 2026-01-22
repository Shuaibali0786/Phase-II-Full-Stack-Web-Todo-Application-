# UI Component Contracts

**Feature**: TaskFlow Premium UI
**Date**: 2026-01-15

This document defines the API contracts for shared UI components.

---

## 1. Button Component

**Location**: `frontend/src/app/components/ui/Button.tsx`

### Props API

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

### Usage Examples

```tsx
// Primary button with icon
<Button variant="primary" leftIcon={<Plus />}>
  Add Task
</Button>

// Danger button with loading state
<Button variant="danger" loading={isDeleting}>
  Delete
</Button>

// Ghost button (icon only)
<Button variant="ghost" size="sm">
  <Edit2 />
</Button>
```

### Visual Variants

| Variant | Background | Text | Hover |
|---------|------------|------|-------|
| primary | gradient (orange→yellow) | white | scale 1.02 |
| secondary | surface | text-secondary | surface-hover |
| danger | transparent | status-error | error/10 bg |
| ghost | transparent | text-secondary | surface-hover |

---

## 2. Card Component

**Location**: `frontend/src/app/components/ui/Card.tsx`

### Props API

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  hoverable?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}
```

### Visual Variants

| Variant | Background | Border | Shadow |
|---------|------------|--------|--------|
| default | surface | border | sm |
| glass | surface/70 + blur | white/10 | lg + glow |
| elevated | surface-elevated | border | xl |

### Animation Behavior

- `animated={true}`: Fade-in-up on mount
- `hoverable={true}`: Scale 1.02 + shadow increase on hover

---

## 3. Modal Component

**Location**: `frontend/src/app/components/ui/Modal.tsx`

### Props API

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;  // default: true
  closeOnEscape?: boolean;         // default: true
  showCloseButton?: boolean;       // default: true
}
```

### Size Specifications

| Size | Max Width |
|------|-----------|
| sm | 320px |
| md | 480px |
| lg | 640px |
| xl | 800px |

### Animation Behavior

```typescript
// Backdrop
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }

// Content
initial: { opacity: 0, scale: 0.95, y: 20 }
animate: { opacity: 1, scale: 1, y: 0 }
exit: { opacity: 0, scale: 0.95, y: 20 }
```

---

## 4. ConfirmModal Component

**Location**: `frontend/src/app/components/common/ConfirmModal.tsx`

### Props API

```typescript
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;   // default: "Confirm"
  cancelText?: string;    // default: "Cancel"
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}
```

### Usage Example

```tsx
<ConfirmModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Task"
  message="Are you sure you want to delete this task? This action cannot be undone."
  confirmText="Delete"
  variant="danger"
  loading={isDeleting}
/>
```

---

## 5. Input Component

**Location**: `frontend/src/app/components/ui/Input.tsx`

### Props API

```typescript
interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'time' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
```

### Visual States

| State | Border | Background | Ring |
|-------|--------|------------|------|
| default | border | surface | none |
| focus | accent-orange | surface | orange/20 |
| error | status-error | surface | error/20 |
| disabled | border | surface/50 | none |

---

## 6. Badge Component

**Location**: `frontend/src/app/components/ui/Badge.tsx`

### Props API

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  color?: string;  // Custom hex color override
  size?: 'sm' | 'md';
  className?: string;
}
```

### Variant Colors

| Variant | Background | Text |
|---------|------------|------|
| default | surface-hover | text-secondary |
| success | success/10 | success |
| warning | warning/10 | warning |
| error | error/10 | error |
| info | info/10 | info |

---

## 7. Animation Variants Export

**Location**: `frontend/src/lib/animations.ts`

### Exported Variants

```typescript
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export const cardHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};
```

---

## 8. Class Name Utility

**Location**: `frontend/src/lib/cn.ts`

### API

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
<div className={cn(
  'base-class',
  variant === 'primary' && 'primary-class',
  className
)}>
```
