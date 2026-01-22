'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Task, Priority, Tag } from '@/types';
import TaskList from '@/app/components/TaskList/TaskList';
import TaskForm from '@/app/components/TaskForm/TaskForm';
import { taskApi, priorityApi, tagApi } from '@/utils/api';

const TasksPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks, priorities, and tags on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, prioritiesRes, tagsRes] = await Promise.all([
        taskApi.getTasks(),
        priorityApi.getPriorities(),
        tagApi.getTags()
      ]);

      setTasks(tasksRes.data.tasks || []);
      setPriorities(prioritiesRes.data || []);
      setTags(tagsRes.data || []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, isCompleted: boolean) => {
    try {
      await taskApi.toggleTaskComplete(taskId, isCompleted);
      // Update the task in the local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        // Remove the task from the local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (taskData: any) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await taskApi.updateTask(editingTask.id, taskData);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === editingTask.id ? response.data : task
          )
        );
      } else {
        // Create new task
        const response = await taskApi.createTask(taskData);
        setTasks(prevTasks => [response.data, ...prevTasks]);
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access tasks</div>;
  }

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Your Tasks</h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="btn btn-primary"
        >
          Add New Task
        </button>
      </header>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          task={editingTask}
          priorities={priorities}
          tags={tags}
        />
      )}

      <TaskList
        tasks={tasks}
        onTaskToggle={handleTaskToggle}
        onTaskEdit={handleTaskEdit}
        onTaskDelete={handleTaskDelete}
        loading={loading}
        error={error}
      />

      <style jsx>{`
        .tasks-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TasksPage;
