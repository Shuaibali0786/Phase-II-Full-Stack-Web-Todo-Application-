'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fadeInUp, cardHoverScale } from '@/lib/animations';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  index?: number;
  disabled?: boolean;
}

const variantConfig = {
  primary: {
    colorClass: 'text-accent-blue',
    bgClass: 'bg-accent-blue/10',
    borderClass: 'border-accent-blue/20',
    hoverClass: 'hover:bg-accent-blue/20 hover:border-accent-blue/40',
  },
  secondary: {
    colorClass: 'text-text-secondary',
    bgClass: 'bg-surface-hover',
    borderClass: 'border-border',
    hoverClass: 'hover:bg-surface-active hover:border-border-hover',
  },
  success: {
    colorClass: 'text-status-success',
    bgClass: 'bg-status-success/10',
    borderClass: 'border-status-success/20',
    hoverClass: 'hover:bg-status-success/20 hover:border-status-success/40',
  },
  warning: {
    colorClass: 'text-status-warning',
    bgClass: 'bg-status-warning/10',
    borderClass: 'border-status-warning/20',
    hoverClass: 'hover:bg-status-warning/20 hover:border-status-warning/40',
  },
  error: {
    colorClass: 'text-status-error',
    bgClass: 'bg-status-error/10',
    borderClass: 'border-status-error/20',
    hoverClass: 'hover:bg-status-error/20 hover:border-status-error/40',
  },
};

export function ActionCard({
  title,
  description,
  icon,
  variant = 'primary',
  onClick,
  index = 0,
  disabled = false,
}: ActionCardProps) {
  const config = variantConfig[variant];

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <motion.div
      variants={{ ...fadeInUp, ...cardHoverScale }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      onClick={handleClick}
      className={cn(
        'card group',
        config.borderClass,
        config.hoverClass,
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed',
        'transition-all duration-200 ease-in-out'
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn('p-3 rounded-xl w-fit', config.bgClass)}>
          <div className={cn(config.colorClass, 'w-6 h-6')}>
            {icon}
          </div>
        </div>

        <div className="mt-4 flex-grow">
          <h3 className="text-base font-semibold text-text-primary group-hover:text-text-secondary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {onClick && !disabled && (
          <div className="mt-4 flex items-center text-sm font-medium text-accent-orange group-hover:text-accent-yellow transition-colors">
            <span>Get Started</span>
            <svg
              className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ActionCard;