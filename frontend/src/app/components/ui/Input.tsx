'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

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
  minLength?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  minLength,
  maxLength,
  leftIcon,
  rightIcon,
  className,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const isDateOrTime = type === 'date' || type === 'time';

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      <div className={cn('relative group', isDateOrTime && 'cursor-pointer')}>
        {leftIcon && (
          <div
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isDateOrTime && 'pointer-events-none z-10',
              isFocused
                ? 'text-accent-orange'
                : isDateOrTime
                  ? 'text-accent-orange group-hover:text-accent-orange/90'
                  : 'text-text-secondary group-hover:text-accent-orange/70',
              disabled && 'text-text-muted'
            )}
          >
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          className={cn(
            'w-full bg-surface border rounded-lg px-4 py-3',
            'text-text-primary placeholder:text-text-muted',
            'transition-all duration-200',
            'focus:outline-none focus:ring-1',
            leftIcon && 'pl-10',
            (rightIcon || isPassword) && 'pr-10',
            error
              ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
              : 'border-border focus:border-accent-orange focus:ring-accent-orange/20',
            disabled && 'opacity-50 cursor-not-allowed bg-surface/50',
            isDateOrTime && 'cursor-pointer'
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-status-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
