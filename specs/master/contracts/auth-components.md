# Auth Component Contracts

**Feature**: TaskFlow Premium Auth Pages
**Date**: 2026-01-15

This document defines the API contracts for authentication components.

---

## 1. LoginForm Component

**Location**: `frontend/src/app/components/Auth/LoginForm.tsx`

### Props API

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;  // default: '/dashboard'
}
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | email | Yes | Valid email format |
| password | password | Yes | Non-empty |

### Visual Structure

```
┌─────────────────────────────────────┐
│                                     │
│        ╔════════════════╗           │
│        ║   TaskFlow     ║           │
│        ╚════════════════╝           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │         Welcome Back        │   │
│   │                             │   │
│   │  📧 Email                   │   │
│   │  ┌───────────────────────┐  │   │
│   │  │                       │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  🔒 Password                │   │
│   │  ┌───────────────────────┐  │   │
│   │  │                       │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  ┌───────────────────────┐  │   │
│   │  │      Sign In          │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  Don't have an account?     │   │
│   │  Register here →            │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Animation Behavior

```typescript
// Container animation
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

// Logo animation
const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};
```

### Error Handling

```typescript
// Display error with animation
{error && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-status-error/10 border border-status-error/20 rounded-lg p-3 text-status-error text-sm"
  >
    {error}
  </motion.div>
)}
```

---

## 2. RegisterForm Component

**Location**: `frontend/src/app/components/Auth/RegisterForm.tsx`

### Props API

```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;  // default: '/dashboard'
}
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| firstName | text | No | Max 100 chars |
| lastName | text | No | Max 100 chars |
| email | email | Yes | Valid email, unique |
| password | password | Yes | All password rules |

### Visual Structure

```
┌─────────────────────────────────────┐
│                                     │
│        ╔════════════════╗           │
│        ║   TaskFlow     ║           │
│        ╚════════════════╝           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      Create Account         │   │
│   │                             │   │
│   │  First Name    Last Name    │   │
│   │  ┌──────────┐ ┌──────────┐  │   │
│   │  │          │ │          │  │   │
│   │  └──────────┘ └──────────┘  │   │
│   │                             │   │
│   │  📧 Email                   │   │
│   │  ┌───────────────────────┐  │   │
│   │  │                       │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  🔒 Password                │   │
│   │  ┌───────────────────────┐  │   │
│   │  │                       │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  ╔═══════════════════════╗  │   │
│   │  ║ Password Requirements ║  │   │
│   │  ║ ✓ 8+ characters       ║  │   │
│   │  ║ ✗ Uppercase letter    ║  │   │
│   │  ║ ✓ Lowercase letter    ║  │   │
│   │  ║ ✗ One digit           ║  │   │
│   │  ║ ✗ Special character   ║  │   │
│   │  ╚═══════════════════════╝  │   │
│   │                             │   │
│   │  ┌───────────────────────┐  │   │
│   │  │    Create Account     │  │   │
│   │  └───────────────────────┘  │   │
│   │                             │   │
│   │  Already have an account?   │   │
│   │  Sign in here →             │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Form Submission Logic

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate password rules
  if (!isPasswordValid) {
    setError('Password does not meet all requirements');
    return;
  }

  setLoading(true);
  try {
    await register({
      email,
      password,
      first_name: firstName || undefined,
      last_name: lastName || undefined
    });
    onSuccess?.();
    router.push(redirectTo);
  } catch (err) {
    setError('Registration failed. Email may already be in use.');
  } finally {
    setLoading(false);
  }
};
```

---

## 3. PasswordStrength Component

**Location**: `frontend/src/app/components/Auth/PasswordStrength.tsx`

### Props API

```typescript
interface PasswordStrengthProps {
  password: string;
  showLabel?: boolean;  // default: true
  className?: string;
}
```

### Password Rules

```typescript
const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (p) => /[A-Z]/.test(p)
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (p) => /[a-z]/.test(p)
  },
  {
    id: 'digit',
    label: 'One digit',
    test: (p) => /\d/.test(p)
  },
  {
    id: 'special',
    label: 'One special character',
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p)
  }
];
```

### Visual Structure

```
┌─────────────────────────────────────┐
│ Password Requirements               │
├─────────────────────────────────────┤
│ ✓ At least 8 characters       ████  │
│ ✗ One uppercase letter             │
│ ✓ One lowercase letter             │
│ ✗ One digit                        │
│ ✗ One special character            │
└─────────────────────────────────────┘

Legend:
✓ = CheckCircle icon (text-status-success)
✗ = Circle icon (text-text-muted)
████ = Strength bar (gradient based on rules passed)
```

### Animation Behavior

```typescript
// Rule item animation
<motion.li
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
  className={cn(
    'flex items-center gap-2 text-sm',
    passed ? 'text-status-success' : 'text-text-muted'
  )}
>
  {passed ? (
    <CheckCircle className="w-4 h-4" />
  ) : (
    <Circle className="w-4 h-4" />
  )}
  {rule.label}
</motion.li>
```

### Strength Calculation

```typescript
const getPasswordStrength = (password: string): PasswordStrength => {
  const passedCount = PASSWORD_RULES.filter(r => r.test(password)).length;

  if (passedCount <= 2) return { level: 'weak', percentage: 20 };
  if (passedCount <= 3) return { level: 'medium', percentage: 50 };
  if (passedCount <= 4) return { level: 'strong', percentage: 75 };
  return { level: 'very-strong', percentage: 100 };
};
```

### Strength Bar Colors

| Level | Color | Percentage |
|-------|-------|------------|
| weak | status-error | 0-25% |
| medium | status-warning | 25-50% |
| strong | status-info | 50-75% |
| very-strong | status-success | 75-100% |

---

## 4. Auth Page Layout

**Location**: `frontend/src/app/auth/layout.tsx` (optional)

### Visual Specifications

```css
/* Full page centered layout */
.auth-page {
  @apply min-h-screen bg-background flex items-center justify-center p-4;
  background-image: radial-gradient(
    circle at top right,
    rgba(249, 115, 22, 0.1),
    transparent 50%
  );
}

/* Auth card (glassmorphism) */
.auth-card {
  @apply w-full max-w-md;
  @apply bg-surface/80 backdrop-blur-xl;
  @apply rounded-2xl border border-border;
  @apply shadow-2xl shadow-black/20;
  @apply p-8;
}
```

---

## 5. TaskFlow Logo Component

**Location**: `frontend/src/app/components/Auth/Logo.tsx`

### Props API

```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}
```

### Size Specifications

| Size | Font Size | Icon Size |
|------|-----------|-----------|
| sm | text-xl | 24px |
| md | text-3xl | 32px |
| lg | text-5xl | 48px |

### Visual Style

```tsx
<div className="flex items-center gap-2">
  <motion.div
    className="bg-accent-gradient p-2 rounded-xl"
    whileHover={{ rotate: [0, -10, 10, 0] }}
  >
    <ListTodo className="text-white" size={iconSize} />
  </motion.div>
  <span className="font-bold bg-clip-text text-transparent bg-accent-gradient">
    TaskFlow
  </span>
</div>
```

---

## 6. Auth Navigation Helper

### Link Styling

```tsx
// Link to other auth page
<p className="text-center text-sm text-text-secondary">
  Don't have an account?{' '}
  <Link
    href="/auth/register"
    className="text-accent-orange hover:text-accent-yellow transition-colors font-medium"
  >
    Register here
  </Link>
</p>
```

### Divider (optional, for social auth)

```tsx
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-border" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-surface text-text-muted">or continue with</span>
  </div>
</div>
```
