'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Task } from '@/types';
import { TaskCard } from '../TaskCard/TaskCard';
import { cn } from '@/lib/cn';
import { staggerContainer, scaleIn } from '@/lib/animations';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, isCompleted: boolean) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  layout?: 'grid' | 'list';
  animated?: boolean;
}

function TaskListSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  const count = layout === 'grid' ? 6 : 4;

  return (
    <div
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      )}
    >
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-md bg-surface-hover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="h-5 bg-surface-hover rounded w-3/4" />
                <div className="h-5 bg-surface-hover rounded w-12" />
              </div>
              <div className="mt-3 h-4 bg-surface-hover rounded w-1/2" />
              <div className="mt-3 flex gap-2">
                <div className="h-4 bg-surface-hover rounded w-20" />
                <div className="h-4 bg-surface-hover rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="text-center py-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-hover mb-4"
      >
        <ClipboardList className="w-10 h-10 text-text-muted" />
      </motion.div>
      <p className="text-text-secondary text-lg">{message}</p>
      <p className="text-text-muted text-sm mt-1">
        Click the button above to create your first task
      </p>
    </motion.div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-status-error/10 mb-4">
        <span className="text-3xl">!</span>
      </div>
      <p className="text-status-error text-lg font-medium">Something went wrong</p>
      <p className="text-text-secondary text-sm mt-1">{error}</p>
    </motion.div>
  );
}

export function TaskList({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  loading = false,
  error = null,
  emptyMessage = "No tasks yet. Create your first task!",
  layout = 'grid',
  animated = true,
}: TaskListProps) {
  if (loading) {
    return <TaskListSkeleton layout={layout} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <motion.div
      variants={animated ? staggerContainer : undefined}
      initial={animated ? 'initial' : undefined}
      animate={animated ? 'animate' : undefined}
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      )}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onTaskToggle}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            animated={animated}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default TaskList;
