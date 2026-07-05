import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import type { Task, TaskPriority, TaskCategory } from '../types/task';
import { CATEGORIES } from '../types/task';
import { playClickSound } from './AudioSynthesizer';

interface AddTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'actualTime'>) => void;
  taskToEdit?: Task | null;
}

export const AddTaskDrawer: React.FC<AddTaskDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [deadline, setDeadline] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [shakeError, setShakeError] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDeadline(taskToEdit.deadline || '');
      setEstimatedTime(taskToEdit.estimatedTime || 25);
    } else {
      setTitle('');
      setPriority('medium');
      setCategory('personal');
      setDeadline('');
      setEstimatedTime(25);
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    playClickSound();
    onSave({
      title: title.trim(),
      priority,
      category,
      deadline: deadline || undefined,
      estimatedTime: Number(estimatedTime) || 25,
    });
    
    onClose();
  };

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div 
        className={`drawer-content ${shakeError ? 'shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2 className="drawer-title">
            {taskToEdit ? 'Edit Lock-In Task' : 'Add New Lock-In Task'}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">What are we locking into?</label>
            <input
              type="text"
              id="task-title"
              className="form-input"
              placeholder="e.g. Finish React Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div className="pill-grid">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`pill-option ${priority === p ? 'selected' : ''}`}
                  data-priority={p}
                  onClick={() => { playClickSound(); setPriority(p); }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="cat-selector-grid">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-option ${category === cat.id ? 'selected' : ''}`}
                  onClick={() => { playClickSound(); setCategory(cat.id); }}
                >
                  <span className="cat-dot" style={{ backgroundColor: cat.color }} />
                  <span>{cat.icon} {cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-deadline">Deadline (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                id="task-deadline"
                className="form-input"
                style={{ paddingRight: '40px' }}
                value={deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-est">
              Estimated Focus Time: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{estimatedTime} min</span>
            </label>
            <input
              type="range"
              id="task-est"
              min="5"
              max="120"
              step="5"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>5m</span>
              <span>25m (Std Pomodoro)</span>
              <span>60m</span>
              <span>120m</span>
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" className="secondary-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {taskToEdit ? <Save size={16} /> : <Plus size={16} />}
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
