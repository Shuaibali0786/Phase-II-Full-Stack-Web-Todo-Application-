import { useMemo } from 'react';
import { Task } from '@/types';

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface UseTaskStatsReturn {
  stats: TaskStats;
  isOverdue: (task: Task) => boolean;
  getTasksByStatus: (status: 'completed' | 'inProgress' | 'overdue') => Task[];
}

/**
 * Check if a task is overdue
 * A task is overdue when:
 * 1. It has a due_date
 * 2. The due_date has passed (is in the past)
 * 3. The task is NOT completed
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.due_date || task.is_completed) {
    return false;
  }
  const dueDate = new Date(task.due_date);
  const now = new Date();
  // Compare dates without time (start of day)
  dueDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return dueDate < now;
}

export function useTaskStats(tasks: Task[]): UseTaskStatsReturn {
  const stats = useMemo<TaskStats>(() => {
    const completed = tasks.filter((t) => t.is_completed).length;
    const overdue = tasks.filter((t) => isTaskOverdue(t)).length;
    const inProgress = tasks.filter(
      (t) => !t.is_completed && !isTaskOverdue(t)
    ).length;

    return {
      total: tasks.length,
      completed,
      inProgress,
      overdue,
    };
  }, [tasks]);

  const getTasksByStatus = useMemo(() => {
    return (status: 'completed' | 'inProgress' | 'overdue'): Task[] => {
      switch (status) {
        case 'completed':
          return tasks.filter((t) => t.is_completed);
        case 'overdue':
          return tasks.filter((t) => isTaskOverdue(t));
        case 'inProgress':
          return tasks.filter((t) => !t.is_completed && !isTaskOverdue(t));
        default:
          return [];
      }
    };
  }, [tasks]);

  return {
    stats,
    isOverdue: isTaskOverdue,
    getTasksByStatus,
  };
}

export default useTaskStats;
