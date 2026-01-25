'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, CheckCircle, Circle, Calendar, Flag, ListOrdered, ArrowUpDown } from 'lucide-react';
import { Task } from '@/types';
import { format, parseISO } from 'date-fns';

interface ViewAllTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortOrder = 'latest' | 'oldest' | 'priority' | 'status';

export const ViewAllTasksModal: React.FC<ViewAllTasksModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  // Fetch all tasks
  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Fetch with high limit to get all tasks
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks?limit=1000&sort=created_at&order=desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching all tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllTasks();
    }
  }, [isOpen]);

  // Sort tasks based on selected order
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortOrder) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority?.name.toLowerCase() as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority?.name.toLowerCase() as keyof typeof priorityOrder] || 0;
        return bPriority - aPriority;
      case 'status':
        return (a.is_completed ? 1 : 0) - (b.is_completed ? 1 : 0);
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityBadge = (priority?: { name: string }) => {
    if (!priority) return <span className="text-gray-500 text-sm">None</span>;

    const priorityColors: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    const colorClass = priorityColors[priority.name.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
        {priority.name}
      </span>
    );
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const pendingCount = tasks.filter(t => !t.is_completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-gray-700 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <ListOrdered className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      View All Tasks
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Complete task history • {tasks.length} total tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="bg-gray-800/50 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">
                      <span className="font-semibold text-green-400">{completedCount}</span> Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">
                      <span className="font-semibold text-blue-400">{pendingCount}</span> Pending
                    </span>
                  </div>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                    <option value="status">By Status</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                      <p className="text-gray-400">Loading all tasks...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3 max-w-md text-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <p className="text-red-400 font-medium">Error loading tasks</p>
                      <p className="text-gray-400 text-sm">{error}</p>
                      <button
                        onClick={fetchAllTasks}
                        className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                      <p className="text-gray-400 mb-2">No tasks found</p>
                      <p className="text-gray-500 text-sm">Create your first task to get started!</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {sortedTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`px-6 py-4 hover:bg-gray-800/50 transition-colors duration-200 ${
                          task.is_completed ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Completion Status Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {task.is_completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h3
                              className={`text-lg font-medium mb-1 ${
                                task.is_completed
                                  ? 'text-gray-400 line-through'
                                  : 'text-white'
                              }`}
                            >
                              {task.title}
                            </h3>

                            {/* Description */}
                            {task.description && (
                              <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              {/* Priority */}
                              <div className="flex items-center gap-1.5">
                                <Flag className="w-4 h-4 text-gray-500" />
                                {getPriorityBadge(task.priority)}
                              </div>

                              {/* Due Date */}
                              {task.due_date && (
                                <div className="flex items-center gap-1.5 text-gray-400">
                                  <Calendar className="w-4 h-4" />
                                  <span>{format(parseISO(task.due_date), 'MMM d, yyyy')}</span>
                                </div>
                              )}

                              {/* Created Date */}
                              <div className="text-gray-500 text-xs">
                                Created: {formatDate(task.created_at)}
                              </div>
                            </div>

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {task.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${tag.color}22`,
                                      borderColor: `${tag.color}66`,
                                      color: tag.color,
                                      border: '1px solid',
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            {task.is_completed ? (
                              <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                Completed
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-800/50 border-t border-gray-700 px-6 py-4 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  Showing all {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
