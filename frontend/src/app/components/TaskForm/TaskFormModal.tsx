'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { Task, CreateTaskRequest, UpdateTaskRequest, Priority, Tag } from '@/types';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Badge } from '@/app/components/ui/Badge';
import { cn } from '@/lib/cn';
import { fadeInUp } from '@/lib/animations';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  task?: Task | null;
  priorities: Priority[];
  tags: Tag[];
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  priorities,
  tags,
}: TaskFormModalProps) {
  const isEditing = !!task;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPriorityId, setSelectedPriorityId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setSelectedPriorityId(task.priority?.id || '');
        setDueDate(task.due_date?.split('T')[0] || '');
        setReminderTime(task.reminder_time || '');
        setSelectedTagIds(task.tags?.map((t) => t.id) || []);
      } else {
        resetForm();
      }
      setError('');
    }
  }, [isOpen, task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedPriorityId('');
    setDueDate('');
    setReminderTime('');
    setSelectedTagIds([]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const taskData: CreateTaskRequest | UpdateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority_id: selectedPriorityId || undefined,
        due_date: dueDate || undefined,
        reminder_time: reminderTime || undefined,
        tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      await onSubmit(taskData);
      onClose();
      resetForm();
    } catch {
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create Task'}
      size="lg"
      closeOnOverlayClick={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-status-error/10 border border-status-error/20 text-status-error text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <motion.div variants={fadeInUp}>
          <Input
            id="title"
            label="Title"
            placeholder="What needs to be done?"
            value={title}
            onChange={setTitle}
            leftIcon={<FileText className="w-4 h-4" />}
            required
            disabled={loading}
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={fadeInUp} className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
            disabled={loading}
            className={cn(
              'w-full bg-surface border border-border rounded-lg px-4 py-3',
              'text-text-primary placeholder:text-text-muted',
              'transition-all duration-200 resize-none',
              'focus:outline-none focus:ring-1 focus:border-accent-orange focus:ring-accent-orange/20',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          />
        </motion.div>

        {/* Priority and Due Date row */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
          {/* Priority select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">
              Priority
            </label>
            <select
              value={selectedPriorityId}
              onChange={(e) => setSelectedPriorityId(e.target.value)}
              disabled={loading}
              className={cn(
                'w-full bg-surface border border-border rounded-lg px-4 py-3',
                'text-text-primary',
                'transition-all duration-200',
                'focus:outline-none focus:ring-1 focus:border-accent-orange focus:ring-accent-orange/20',
                loading && 'opacity-50 cursor-not-allowed',
                !selectedPriorityId && 'text-text-muted'
              )}
            >
              <option value="">Select priority</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={setDueDate}
            leftIcon={<Calendar className="w-4 h-4" />}
            disabled={loading}
          />
        </motion.div>

        {/* Reminder time */}
        {dueDate && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="w-1/2 pr-2"
          >
            <Input
              id="reminderTime"
              label="Reminder Time"
              type="time"
              value={reminderTime}
              onChange={setReminderTime}
              leftIcon={<Clock className="w-4 h-4" />}
              disabled={loading}
            />
          </motion.div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div variants={fadeInUp} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <TagIcon className="w-4 h-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    disabled={loading}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      'border-2',
                      isSelected
                        ? 'border-transparent'
                        : 'border-border hover:border-text-muted',
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: isSelected ? `${tag.color}30` : 'transparent',
                      color: isSelected ? tag.color : undefined,
                      borderColor: isSelected ? tag.color : undefined,
                    }}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={fadeInUp} className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!title.trim()}
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </motion.div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
