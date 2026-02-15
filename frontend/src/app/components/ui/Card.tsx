'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fadeInUp, cardHoverScale } from '@/lib/animations';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  hoverable?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-surface border border-border shadow-sm',
  glass: 'bg-surface/70 backdrop-blur-xl border border-white/10 shadow-lg',
  elevated: 'bg-surface-elevated border border-border shadow-xl',
};

export function Card({
  children,
  variant = 'default',
  hoverable = false,
  animated = false,
  className,
  onClick,
}: CardProps) {
  const Component = animated || hoverable ? motion.div : 'div';

  const motionProps = animated || hoverable ? {
    variants: animated && hoverable ? { ...fadeInUp, ...cardHoverScale } : animated ? fadeInUp : cardHoverScale,
    initial: animated ? 'initial' : 'rest',
    animate: animated ? 'animate' : 'rest',
    exit: animated ? 'exit' : undefined,
    whileHover: hoverable ? 'hover' : undefined,
  } : {};

  return (
    <Component
      {...motionProps}
      onClick={onClick}
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variantStyles[variant],
        hoverable && 'cursor-pointer hover:border-accent-orange/50 hover:shadow-lg hover:shadow-accent-orange/5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Card;
