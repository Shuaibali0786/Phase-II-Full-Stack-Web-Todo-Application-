'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListTodo, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { TaskStats } from '@/hooks/useTaskStats';
import { staggerContainer } from '@/lib/animations';

interface StatsGridProps {
  stats: TaskStats;
  loading?: boolean;
  onStatClick?: (stat: keyof TaskStats) => void;
}

export function StatsGrid({ stats, loading = false, onStatClick }: StatsGridProps) {
  const statCards = [
    {
      key: 'total' as const,
      title: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo className="w-5 h-5" />,
      variant: 'total' as const,
    },
    {
      key: 'completed' as const,
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5" />,
      variant: 'completed' as const,
    },
    {
      key: 'inProgress' as const,
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Clock className="w-5 h-5" />,
      variant: 'inProgress' as const,
    },
    {
      key: 'overdue' as const,
      title: 'Overdue',
      value: stats.overdue,
      icon: <AlertCircle className="w-5 h-5" />,
      variant: 'overdue' as const,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statCards.map((card, index) => ( 
        <StatCard
          key={card.key}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          loading={loading}
          onClick={onStatClick ? () => onStatClick(card.key) : undefined}
          index={index}
        />
      ))}
    </motion.div>
  
  );
  
}

export default StatsGrid;
