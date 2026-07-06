import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Code, 
  BookOpen, 
  Home, 
  Gamepad2, 
  DollarSign, 
  Heart 
} from 'lucide-react';
import type { Task, TaskPriority, TaskCategory, SubTask } from '../types/task';
import { CATEGORIES } from '../types/task';
import { playClickSound } from './AudioSynthesizer';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'actualTime'>) => void;
  taskToEdit?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
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
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [shakeError, setShakeError] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDeadline(taskToEdit.deadline || '');
      setEstimatedTime(taskToEdit.estimatedTime || 25);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setPriority('medium');
      setCategory('personal');
      setDeadline('');
      setEstimatedTime(25);
      setSubtasks([]);
    }
    setSubtaskInput('');
  }, [taskToEdit, isOpen]);

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    playClickSound();
    setSubtasks([
      ...subtasks,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: subtaskInput.trim(),
        completed: false
      }
    ]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    playClickSound();
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

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
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });
    
    onClose();
  };

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  const renderCategoryIcon = (iconName: string) => {
    const size = 14;
    switch (iconName) {
      case 'Code': return <Code size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Gamepad2': return <Gamepad2 size={size} />;
      case 'DollarSign': return <DollarSign size={size} />;
      case 'Heart': return <Heart size={size} />;
      default: return null;
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${shakeError ? 'shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {taskToEdit ? 'Edit Lock-In Task' : 'Add New Lock-In Task'}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {renderCategoryIcon(cat.icon)}
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtasks (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add a step (e.g. Design wireframes)"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                className="primary-btn"
                style={{ padding: '0 16px', height: '42px', flexShrink: 0 }}
                onClick={handleAddSubtask}
              >
                <Plus size={16} />
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="modal-subtasks-container">
                {subtasks.map((st) => (
                  <div key={st.id} className="modal-subtask-item">
                    <span className="modal-subtask-title">{st.title}</span>
                    <button
                      type="button"
                      className="modal-subtask-delete-btn"
                      onClick={() => handleRemoveSubtask(st.id)}
                      title="Remove step"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          <div className="modal-footer">
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
