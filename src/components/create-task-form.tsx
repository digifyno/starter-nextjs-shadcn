'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'feature' | 'bugfix' | 'docs' | 'refactor';

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
}

interface CreateTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

export function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('feature');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ title: title.trim(), description: description.trim(), priority, category });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="title">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
        >
          <option value="feature">Feature</option>
          <option value="bugfix">Bugfix</option>
          <option value="docs">Docs</option>
          <option value="refactor">Refactor</option>
        </select>
      </div>
      <Button type="submit">Create Task</Button>
    </form>
  );
}
