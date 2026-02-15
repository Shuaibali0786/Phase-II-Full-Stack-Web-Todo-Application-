'use client';

import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fadeInUp, cardHoverScale } from '@/lib/animations';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

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
  index?: number;
}

const variantConfig = {
  total: {
    colorClass: 'text-accent-orange',
    bgClass: 'bg-accent-orange/10',
    borderHover: 'hover:border-accent-orange/50',
  },
  completed: {
    colorClass: 'text-status-success',
    bgClass: 'bg-status-success/10',
    borderHover: 'hover:border-status-success/50',
  },
  inProgress: {
    colorClass: 'text-status-info',
    bgClass: 'bg-status-info/10',
    borderHover: 'hover:border-status-info/50',
  },
  overdue: {
    colorClass: 'text-status-error',
    bgClass: 'bg-status-error/10',
    borderHover: 'hover:border-status-error/50',
  },
};

export function StatCard({
  title,
  value,
  icon,
  variant,
  trend,
  loading = false,
  animated = true,
  onClick,
  index = 0,
}: StatCardProps) {
  const config = variantConfig[variant];
  const animatedValue = useAnimatedCounter(value, { enabled: animated && !loading });
  const displayValue = useTransform(animatedValue, (v) => Math.round(v).toString());

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-surface-hover" />
          <div className="w-8 h-4 rounded bg-surface-hover" />
        </div>
        <div className="mt-4">
          <div className="h-4 w-20 rounded bg-surface-hover mb-2" />
          <div className="h-8 w-16 rounded bg-surface-hover" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={{ ...fadeInUp, ...cardHoverScale }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        'card cursor-pointer',
        config.borderHover,
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl', config.bgClass)}>
          <div className={config.colorClass}>{icon}</div>
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.direction === 'up' ? 'text-status-success' : 'text-status-error'
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div  className="mt-4">
        <p className="text-sm text-text-secondary">{title}</p>
        <motion.p className={cn('text-3xl font-bold mt-1', config.colorClass)}>
          {displayValue}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default StatCard;
