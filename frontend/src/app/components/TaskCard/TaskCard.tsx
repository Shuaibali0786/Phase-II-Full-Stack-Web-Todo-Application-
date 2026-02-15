'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Calendar, Check } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/cn';
import { Badge } from '@/app/components/ui/Badge';
import { fadeInUp, cardHoverScale, checkAnimation } from '@/lib/animations';
import { isTaskOverdue } from '@/hooks/useTaskStats';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  animated?: boolean;
  compact?: boolean;
  index?: number;
}

const priorityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  animated = true,
  compact = false,
  index = 0,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOverdue = isTaskOverdue(task);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id, !task.is_completed);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const getPriorityColor = () => {
    if (!task.priority) return undefined;
    const name = task.priority.name.toLowerCase();
    return priorityColors[name] || task.priority.color;
  };

  return (
    <motion.div
      variants={animated ? { ...fadeInUp, ...cardHoverScale } : cardHoverScale}
      initial={animated ? 'initial' : 'rest'}
      animate={animated ? 'animate' : 'rest'}
      exit={animated ? 'exit' : undefined}
      whileHover="hover"
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'card group relative',
        task.is_completed && 'opacity-60',
        isOverdue && 'border-l-4 border-l-status-error',
        'hover:border-accent-orange/30'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-0.5',
            task.is_completed
              ? 'bg-accent-orange border-accent-orange'
              : 'border-border hover:border-accent-orange/50'
          )}
        >
          <AnimatePresence mode="wait">
            {task.is_completed && (
              <motion.div
                variants={checkAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'text-base font-medium text-text-primary leading-tight',
                task.is_completed && 'line-through text-text-muted'
              )}
            >
              {task.title}
            </h3>
            {task.priority && (
              <Badge color={getPriorityColor()} size="sm" className="flex-shrink-0">
                {task.priority.name}
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && !compact && (
            <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta row: Due date and tags */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Due date */}
              {task.due_date && (
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-xs',
                    isOverdue ? 'text-status-error' : 'text-text-muted'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(task.due_date)}
                </span>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {task.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} color={tag.color} size="sm">
                      {tag.name}
                    </Badge>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="text-xs text-text-muted">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons - appear on hover */}
            <div
              className={cn(
                'flex items-center gap-1 transition-opacity duration-200',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg text-text-muted hover:text-accent-orange hover:bg-accent-orange/10 transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;
