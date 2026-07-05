import React, { useRef } from 'react';
import type { Task } from '../types/task';
import { CATEGORIES } from '../types/task';
import { Trash2, Edit2, Play, Calendar } from 'lucide-react';
import { playClickSound } from './AudioSynthesizer';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
  onDragEnd: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onStartFocus,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const categoryInfo = CATEGORIES[task.category];

  const handleCheckboxChange = () => {
    onToggleComplete(task.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDelete(task.id);
  };

  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onStartFocus(task);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'tag-priority-high';
      case 'medium': return 'tag-priority-medium';
      default: return 'tag-priority-low';
    }
  };

  // Format deadline string for display
  const displayDeadline = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) {
      return <span className="detail-tag tag-deadline" style={{ color: 'var(--priority-high)' }}>⚠️ Today</span>;
    } else if (dateStr === tomorrowStr) {
      return <span className="detail-tag tag-deadline" style={{ color: 'var(--priority-medium)' }}>Tomorrow</span>;
    }

    return (
      <span className="detail-tag tag-deadline">
        <Calendar size={11} />
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`task-card glass animate-slide ${task.completed ? 'completed' : ''}`}
      draggable={!task.completed}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      onDrop={(e) => onDrop(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="task-header">
        <div className="checkbox-container">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark" />
        </div>
        <span className="task-title">{task.title}</span>
      </div>

      <div className="task-details">
        <span className={`detail-tag ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
        <span className="detail-tag tag-category">
          <span>{categoryInfo?.icon}</span>
          <span>{categoryInfo?.name}</span>
        </span>
        {displayDeadline(task.deadline)}
        {task.actualTime && task.actualTime > 0 ? (
          <span className="detail-tag tag-category" style={{ color: 'var(--accent)' }}>
            🎯 {task.actualTime}m focused
          </span>
        ) : null}
      </div>

      <div className="task-actions">
        {!task.completed && (
          <button 
            className="action-btn lockin" 
            onClick={handleFocusClick}
            title="Lock into Focus Mode (Pomodoro)"
          >
            <Play size={12} fill="currentColor" />
            <span>Lock In</span>
          </button>
        )}
        <button 
          className="action-btn edit" 
          onClick={handleEditClick}
          title="Edit Task"
        >
          <Edit2 size={13} />
        </button>
        <button 
          className="action-btn delete" 
          onClick={handleDeleteClick}
          title="Delete Task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
