'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { TableRowProps } from './types';
import { format, isPast, parseISO } from 'date-fns';

export default function TableRow({ task, onToggleComplete, onEdit, onDelete }: TableRowProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleCheckboxChange = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id, !task.is_completed);
    } finally {
      setIsToggling(false);
    }
  };

  // Priority badge styling
  const getPriorityBadge = () => {
    if (!task.priority) {
      return <span className="text-gray-500 text-sm">None</span>;
    }

    const priorityColors: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    const colorClass = priorityColors[task.priority.name.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
        {task.priority.name}
      </span>
    );
  };

  // Status badge styling
  const getStatusBadge = () => {
    if (task.is_completed) {
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
        Pending
      </span>
    );
  };

  // Due date formatting and styling
  const getDueDateDisplay = () => {
    if (!task.due_date) {
      return <span className="text-gray-500 text-sm">No due date</span>;
    }

    try {
      const dueDate = parseISO(task.due_date);
      const isOverdue = !task.is_completed && isPast(dueDate);
      const formattedDate = format(dueDate, 'MMM d, yyyy');

      return (
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`} />
          <span className={`text-sm ${isOverdue ? 'text-red-400 font-medium' : 'text-gray-300'}`}>
            {formattedDate}
            {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
          </span>
        </div>
      );
    } catch (error) {
      return <span className="text-gray-500 text-sm">Invalid date</span>;
    }
  };

  const rowClass = `border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors ${
    task.is_completed ? 'opacity-60' : ''
  }`;

  return (
    <motion.tr
      className={rowClass}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Checkbox Column */}
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={handleCheckboxChange}
          disabled={isToggling}
          className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Mark task "${task.title}" as ${task.is_completed ? 'incomplete' : 'complete'}`}
        />
      </td>

      {/* Title Column */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className={`font-medium text-white ${task.is_completed ? 'line-through' : ''}`}>
            {task.title}
          </span>
          {task.description && (
            <span className="text-sm text-gray-400 line-clamp-1">
              {task.description}
            </span>
          )}
        </div>
      </td>

      {/* Status Column */}
      <td className="px-4 py-4">
        {getStatusBadge()}
      </td>

      {/* Priority Column */}
      <td className="px-4 py-4">
        {getPriorityBadge()}
      </td>

      {/* Due Date Column */}
      <td className="px-4 py-4">
        {getDueDateDisplay()}
      </td>

      {/* Actions Column */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
            aria-label={`Edit task "${task.title}"`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            aria-label={`Delete task "${task.title}"`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
