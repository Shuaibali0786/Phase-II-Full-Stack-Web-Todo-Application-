'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Task, TaskListResponse } from '@/types';
import { TaskTableProps, SortConfig, SortColumn, PageSize } from './types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import PaginationControls from './PaginationControls';

export default function TaskTable({ onAddTask, onEditTask, onDeleteTask, onTaskUpdated, refreshTrigger }: TaskTableProps) {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'created_at',
    order: 'desc',
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Calculate offset from page number
      const offset = (currentPage - 1) * pageSize;

      // Build query params
      const params = new URLSearchParams({
        sort: sortConfig.column,
        order: sortConfig.order,
        limit: pageSize.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data: TaskListResponse = await response.json();
      setTasks(data.tasks);
      setTotalTasks(data.total);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount, when pagination/sort changes, or when refreshTrigger changes
  useEffect(() => {
    fetchTasks();
  }, [currentPage, pageSize, sortConfig, refreshTrigger]);

  // Handle sort
  const handleSort = (column: SortColumn) => {
    setSortConfig((prev) => ({
      column,
      order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle toggle complete
  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${taskId}/complete?is_completed=${isCompleted}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle task completion');
      }

      // Optimistically update UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
        )
      );

      // Refresh data to ensure consistency
      await fetchTasks();

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      // Revert optimistic update on error
      await fetchTasks();
    }
  };

  // Handle edit
  const handleEdit = (task: Task) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  // Handle delete
  const handleDelete = (task: Task) => {
    if (onDeleteTask) {
      onDeleteTask(task);
    }
  };

  // Handle add task
  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask();
    }
  };

  // Loading state
  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-400 font-medium">Error loading tasks</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md">
          <p className="text-gray-400 mb-4">No tasks found. Create your first task to get started!</p>
          <button
            onClick={handleAddTask}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add Task Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
        <button
          onClick={handleAddTask}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-800 backdrop-blur-sm">
        <table className="w-full">
          <TableHeader sortConfig={sortConfig} onSort={handleSort} />
          <tbody>
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalTasks={totalTasks}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Error notification */}
      {error && tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
