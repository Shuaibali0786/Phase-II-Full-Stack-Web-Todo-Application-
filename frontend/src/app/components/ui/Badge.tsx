'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-surface-hover text-text-secondary',
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  error: 'bg-status-error/10 text-status-error',
  info: 'bg-status-info/10 text-status-info',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  color,
  size = 'sm',
  className,
}: BadgeProps) {
  const customStyles = color
    ? { backgroundColor: `${color}20`, color }
    : {};

  return (
    <span
      style={customStyles}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        !color && variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
