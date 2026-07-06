import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { AppTheme, TaskCategory, Task } from '../types/task';
import { CATEGORIES } from '../types/task';
import { 
  Folder, 
  Sparkles, 
  CheckSquare, 
  List, 
  Clock, 
  AlertTriangle,
  Heart,
  BookOpen,
  Code,
  Gamepad2,
  DollarSign,
  Home as HomeIcon,
  Palette
} from 'lucide-react';
import { playClickSound } from './AudioSynthesizer';

interface SidebarProps {
  tasks: Task[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeCategory: TaskCategory | null;
  setActiveCategory: (cat: TaskCategory | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  activeFilter,
  setActiveFilter,
  activeCategory,
  setActiveCategory,
  isOpen,
  setIsOpen
}) => {
  const { theme, setTheme } = useTheme();

  // Compute stats for filters
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    return {
      all: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
      today: tasks.filter(t => t.deadline === todayStr && !t.completed).length,
    };
  }, [tasks]);

  // Compute stats for categories
  const categoryCounts = useMemo(() => {
    const counts = {} as Record<TaskCategory, number>;
    Object.keys(CATEGORIES).forEach(cat => {
      counts[cat as TaskCategory] = tasks.filter(t => t.category === cat && !t.completed).length;
    });
    return counts;
  }, [tasks]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  // Get a motivational quote based on completion rate
  const motivationalQuote = useMemo(() => {
    if (tasks.length === 0) return "Add your first task and lock in!";
    if (completionPercentage === 100) return "Phenomenal job! You finished everything!";
    if (completionPercentage >= 80) return "Unstoppable! Almost at the finish line!";
    if (completionPercentage >= 50) return "Halfway there! Keep up the momentum!";
    if (completionPercentage > 0) return "Every task completed is progress!";
    return "Let's complete a task and start a streak!";
  }, [completionPercentage, tasks.length]);

  const themesList: { name: AppTheme; label: string; color: string }[] = [
    { name: 'dark', label: 'Midnight', color: '#18181b' },
    { name: 'light', label: 'Light', color: '#e2e8f0' },
    { name: 'purple', label: 'Purple', color: '#a855f7' },
    { name: 'forest', label: 'Forest', color: '#10b981' },
    { name: 'ocean', label: 'Ocean', color: '#0ea5e9' },
    { name: 'sunset', label: 'Sunset', color: '#f43f5e' },
  ];

  const handleFilterClick = (filter: string) => {
    playClickSound();
    setActiveFilter(filter);
    setActiveCategory(null); // Clear category filter when general filter is clicked
  };

  const handleCategoryClick = (catId: TaskCategory | null) => {
    playClickSound();
    setActiveCategory(catId);
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    playClickSound();
    setTheme(newTheme);
  };

  // Render Lucide icons for categories
  const renderCategoryIcon = (catId: TaskCategory) => {
    const size = 16;
    switch (catId) {
      case 'coding': return <Code size={size} style={{ color: 'var(--cat-coding)' }} />;
      case 'school': return <BookOpen size={size} style={{ color: 'var(--cat-school)' }} />;
      case 'personal': return <HomeIcon size={size} style={{ color: 'var(--cat-personal)' }} />;
      case 'gaming': return <Gamepad2 size={size} style={{ color: 'var(--cat-gaming)' }} />;
      case 'finance': return <DollarSign size={size} style={{ color: 'var(--cat-finance)' }} />;
      case 'health': return <Heart size={size} style={{ color: 'var(--cat-health)' }} />;
    }
  };

  return (
    <aside className={`app-sidebar glass ${isOpen ? 'open' : ''}`}>
      {/* Mobile close overlay */}
      <div className="sidebar-close-btn" onClick={() => { playClickSound(); setIsOpen(false); }}>
        &times;
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">
          <Palette size={16} /> Themes
        </h3>
        <div className="theme-grid">
          {themesList.map((t) => (
            <button
              key={t.name}
              className={`theme-btn ${theme === t.name ? 'active' : ''}`}
              style={{ backgroundColor: t.color }}
              onClick={() => handleThemeChange(t.name)}
              title={t.label}
            >
              {theme === t.name && (
                <span className="theme-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Filters</h3>
        <ul className="sidebar-menu">
          <li className={activeFilter === 'all' && activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleFilterClick('all')}>
              <List size={16} />
              <span>All Tasks</span>
              <span className="badge">{stats.all}</span>
            </button>
          </li>
          <li className={activeFilter === 'active' && activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleFilterClick('active')}>
              <CheckSquare size={16} />
              <span>Active</span>
              <span className="badge">{stats.active}</span>
            </button>
          </li>
          <li className={activeFilter === 'completed' && activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleFilterClick('completed')}>
              <Sparkles size={16} />
              <span>Completed</span>
              <span className="badge">{stats.completed}</span>
            </button>
          </li>
          <li className={activeFilter === 'high' && activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleFilterClick('high')}>
              <AlertTriangle size={16} />
              <span>High Priority</span>
              <span className="badge">{stats.high}</span>
            </button>
          </li>
          <li className={activeFilter === 'today' && activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleFilterClick('today')}>
              <Clock size={16} />
              <span>Due Today</span>
              <span className="badge">{stats.today}</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">
          <Folder size={16} /> Categories
        </h3>
        <ul className="sidebar-menu">
          <li className={activeCategory === null && activeFilter === 'all' ? '' : activeCategory === null ? 'active' : ''}>
            <button onClick={() => handleCategoryClick(null)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Folder size={16} />
              <span>All Categories</span>
            </button>
          </li>
          {Object.values(CATEGORIES).map((cat) => (
            <li key={cat.id} className={activeCategory === cat.id ? 'active' : ''}>
              <button onClick={() => handleCategoryClick(cat.id)}>
                <span className="category-menu-icon">
                  {renderCategoryIcon(cat.id)}
                </span>
                <span>{cat.name}</span>
                <span className="badge">{categoryCounts[cat.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="progress-section">
          <div className="progress-label">
            <span>Daily Lock-In Progress</span>
            <span className="percentage-text">{completionPercentage}%</span>
          </div>
          {/* Custom segmented progress bar */}
          <div className="custom-progress-bar">
            <div 
              className="progress-fill glow-active" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="motivational-text">{motivationalQuote}</p>
        </div>
      </div>
    </aside>
  );
};
