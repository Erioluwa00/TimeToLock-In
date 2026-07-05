import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Task, DailyStreak, TaskCategory } from './types/task';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { AddTaskDrawer } from './components/AddTaskDrawer';
import { FocusMode } from './components/FocusMode';
import { playSuccessSound, playClickSound } from './components/AudioSynthesizer';
import { Search, Plus, Menu } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

const SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Finish TimeToLock-In portfolio project 🚀',
    priority: 'high',
    category: 'coding',
    deadline: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    estimatedTime: 30,
    actualTime: 12
  },
  {
    id: 'sample-2',
    title: 'Workout session: cardio and weights 🏋️',
    priority: 'medium',
    category: 'health',
    deadline: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    estimatedTime: 45,
    actualTime: 0
  },
  {
    id: 'sample-3',
    title: 'Read Atomic Habits: Chapter 4 📚',
    priority: 'low',
    category: 'school',
    deadline: new Date().toISOString().split('T')[0],
    completed: true,
    createdAt: new Date().toISOString(),
    estimatedTime: 25,
    actualTime: 25
  },
  {
    id: 'sample-4',
    title: 'Learn advanced state hooks in React 💻',
    priority: 'medium',
    category: 'coding',
    completed: false,
    createdAt: new Date().toISOString(),
    estimatedTime: 20,
    actualTime: 0
  }
];

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('timetolockin-tasks', SAMPLE_TASKS);
  const [streak, setStreak] = useLocalStorage<DailyStreak>('timetolockin-streak', { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] });
  
  // Navigation / Filter States
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<TaskCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Drawer / Add/Edit States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Focus Mode States
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Calculate Streak increment
  const handleStreakCheck = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (streak.lastActiveDate === todayStr) {
      return; // Already logged task completion today, streak stands
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastActiveDate === yesterdayStr) {
      setStreak({ count: streak.count + 1, lastActiveDate: todayStr });
    } else {
      setStreak({ count: 1, lastActiveDate: todayStr });
    }
  };

  // Toggle complete state
  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return prevTasks;

      const updated = [...prevTasks];
      const isCompleting = !updated[taskIndex].completed;
      
      updated[taskIndex] = {
        ...updated[taskIndex],
        completed: isCompleting,
        completedAt: isCompleting ? new Date().toISOString() : undefined
      };

      if (isCompleting) {
        // Celebrations!
        playSuccessSound();
        handleStreakCheck();
        
        // Trigger confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
        });
      } else {
        playClickSound();
      }

      return updated;
    });
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter(t => t.id !== id));
  };

  // Open drawer for adding task
  const handleAddTaskClick = () => {
    playClickSound();
    setTaskToEdit(null);
    setIsDrawerOpen(true);
  };

  // Open drawer for editing task
  const handleEditTaskClick = (task: Task) => {
    setTaskToEdit(task);
    setIsDrawerOpen(true);
  };

  // Save task (Create or Update)
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'actualTime'>) => {
    if (taskToEdit) {
      // Update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskToEdit.id
            ? { ...t, ...taskData }
            : t
        )
      );
    } else {
      // Create
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: taskData.title,
        priority: taskData.priority,
        category: taskData.category,
        deadline: taskData.deadline,
        estimatedTime: taskData.estimatedTime,
        completed: false,
        createdAt: new Date().toISOString(),
        actualTime: 0
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
    setTaskToEdit(null);
  };

  // Start Focus Mode
  const handleStartFocus = (task: Task) => {
    setFocusTask(task);
    setIsFocusActive(true);
  };

  // Quit Focus Mode and save elapsed focus time
  const handleQuitFocus = (minutesFocused: number, completedSession: boolean) => {
    if (focusTask && minutesFocused > 0) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === focusTask.id
            ? { ...t, actualTime: (t.actualTime || 0) + minutesFocused }
            : t
        )
      );
    }

    if (completedSession && focusTask) {
      // Mark task as completed if they finished the Pomodoro session and choose to complete
      handleToggleComplete(focusTask.id);
    }

    setIsFocusActive(false);
    setFocusTask(null);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (_e: React.DragEvent, id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, _id: string) => {
    e.preventDefault();
  };

  const handleDrop = (_e: React.DragEvent, targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    setTasks((prevTasks) => {
      const draggedIdx = prevTasks.findIndex(t => t.id === draggedId);
      const targetIdx = prevTasks.findIndex(t => t.id === targetId);

      if (draggedIdx === -1 || targetIdx === -1) return prevTasks;

      const reordered = [...prevTasks];
      const [removed] = reordered.splice(draggedIdx, 1);
      reordered.splice(targetIdx, 0, removed);
      return reordered;
    });
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // Filter tasks based on Search, General Filters, and Categories
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search query filter
    if (searchQuery.trim()) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category filter
    if (activeCategory) {
      result = result.filter(t => t.category === activeCategory);
    }

    // General filter (Tabs)
    const todayStr = new Date().toISOString().split('T')[0];
    switch (activeFilter) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
      case 'high':
        result = result.filter(t => t.priority === 'high' && !t.completed);
        break;
      case 'today':
        result = result.filter(t => t.deadline === todayStr && !t.completed);
        break;
      default:
        break;
    }

    return result;
  }, [tasks, activeFilter, activeCategory, searchQuery]);

  // Group filtered tasks for rendering
  const activeFilteredTasks = useMemo(() => filteredTasks.filter(t => !t.completed), [filteredTasks]);
  const completedFilteredTasks = useMemo(() => filteredTasks.filter(t => t.completed), [filteredTasks]);

  // Compute overall stats for Header
  const totalCompletedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);

  return (
    <div className="app-container">
      <Header 
        streakCount={streak.count} 
        completedCount={totalCompletedCount}
        totalCount={tasks.length}
      />

      <div className="app-content">
        <Sidebar 
          tasks={tasks}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="app-main">
          {/* Main workspace toolbar */}
          <div className="workspace-toolbar">
            <button 
              className="mobile-sidebar-toggle" 
              onClick={() => { playClickSound(); setIsSidebarOpen(true); }}
            >
              <Menu size={20} />
            </button>

            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search lock-in tasks..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="action-buttons">
              <button className="primary-btn" onClick={handleAddTaskClick}>
                <Plus size={16} />
                <span>Lock In Task</span>
              </button>
            </div>
          </div>

          {/* Active Tasks list */}
          <div className="tasks-columns">
            <div className="column-section">
              <h3 className="column-header">
                🎯 Focus List ({activeFilteredTasks.length})
              </h3>
              {activeFilteredTasks.length > 0 ? (
                <div className="task-grid">
                  {activeFilteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTaskClick}
                      onStartFocus={handleStartFocus}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              ) : activeFilter === 'all' && !activeCategory && !searchQuery ? (
                <div className="empty-state">
                  <div className="empty-icon">🎈</div>
                  <h4 className="empty-title">Nothing to lock into</h4>
                  <p className="empty-desc">You don't have any pending tasks. Create a new task to start locking in!</p>
                  <button className="primary-btn" onClick={handleAddTaskClick} style={{ marginTop: '8px' }}>
                    Create First Task
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h4 className="empty-title">No matching tasks</h4>
                  <p className="empty-desc">We couldn't find any tasks matching your filters or search term.</p>
                </div>
              )}
            </div>

            {/* Completed Tasks list */}
            {completedFilteredTasks.length > 0 && (
              <div className="column-section" style={{ marginTop: '16px' }}>
                <h3 className="column-header">
                  ✅ Completed ({completedFilteredTasks.length})
                </h3>
                <div className="task-grid">
                  {completedFilteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTaskClick}
                      onStartFocus={handleStartFocus}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Drawer Overlay for Add/Edit tasks */}
      <AddTaskDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Pomodoro Focus Mode overlay */}
      <FocusMode
        isActive={isFocusActive}
        task={focusTask}
        onQuit={handleQuitFocus}
      />
    </div>
  );
}

export default App;
