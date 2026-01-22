'use client';

import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest, Priority, Tag } from '@/types';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => void;
  onCancel: () => void;
  task?: Task | null;
  priorities: Priority[];
  tags: Tag[];
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  task = null,
  priorities,
  tags,
  loading = false
}) => {
  const isEditing = !!task;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [selectedPriorityId, setSelectedPriorityId] = useState(task?.priority?.id || '');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [reminderTime, setReminderTime] = useState(task?.reminder_time || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(task?.tags?.map(t => t.id) || []);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setSelectedPriorityId(task.priority?.id || '');
      setDueDate(task.due_date || '');
      setReminderTime(task.reminder_time || '');
      setSelectedTagIds(task.tags?.map(t => t.id) || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description: description || undefined,
      priority_id: selectedPriorityId || undefined,
      due_date: dueDate || undefined,
      reminder_time: reminderTime || undefined,
      tag_ids: selectedTagIds,
    };

    onSubmit(taskData);
  };

  const handleTagChange = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="task-form-container">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={selectedPriorityId}
              onChange={(e) => setSelectedPriorityId(e.target.value)}
              className="form-control"
            >
              <option value="">Select Priority</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reminderTime">Reminder Time</label>
            <input
              type="time"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-selector">
            {tags.map(tag => (
              <label key={tag.id} className="tag-option">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <span
                  className="tag-badge"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .task-form-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .task-form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        label {
          display: block;
          margin-bottom: 4px;
          font-weight: bold;
          color: #333;
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        textarea.form-control {
          resize: vertical;
          min-height: 80px;
        }
        .tag-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-option {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .tag-option input {
          margin-right: 4px;
        }
        .tag-badge {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 0.8em;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TaskForm;