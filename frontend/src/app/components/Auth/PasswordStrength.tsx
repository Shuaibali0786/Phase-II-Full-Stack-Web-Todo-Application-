'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
  showLabel?: boolean;
  className?: string;
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'digit',
    label: 'One digit',
    test: (p) => /\d/.test(p),
  },
  {
    id: 'special',
    label: 'One special character',
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

interface PasswordStrength {
  level: StrengthLevel;
  percentage: number;
}

const strengthColors: Record<StrengthLevel, string> = {
  weak: 'bg-status-error',
  medium: 'bg-status-warning',
  strong: 'bg-status-info',
  'very-strong': 'bg-status-success',
};

function getPasswordStrength(password: string): PasswordStrength {
  const passedCount = PASSWORD_RULES.filter((r) => r.test(password)).length;

  if (passedCount <= 2) return { level: 'weak', percentage: 20 };
  if (passedCount <= 3) return { level: 'medium', percentage: 50 };
  if (passedCount <= 4) return { level: 'strong', percentage: 75 };
  return { level: 'very-strong', percentage: 100 };
}

export function PasswordStrength({
  password,
  showLabel = true,
  className,
}: PasswordStrengthProps) {
  const results = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const allPassed = results.every((r) => r.passed);

  return (
    <div className={cn('space-y-3', className)}>
      {showLabel && (
        <p className="text-sm font-medium text-text-secondary">
          Password Requirements
        </p>
      )}

      {/* Strength bar */}
      <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', strengthColors[strength.level])}
          initial={{ width: 0 }}
          animate={{ width: `${strength.percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Rules list */}
      <ul className="space-y-1.5">
        {results.map((rule, index) => (
          <motion.li
            key={rule.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'flex items-center gap-2 text-sm',
              rule.passed ? 'text-status-success' : 'text-text-muted'
            )}
          >
            {rule.passed ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 flex-shrink-0" />
            )}
            {rule.label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// Export validation helper for use in forms
export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export default PasswordStrength;
